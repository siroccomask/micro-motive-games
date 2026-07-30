import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { toPublicCodexError } from "@/libs/codex/public-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role?: string;
  content?: string | Array<{ type?: string; text?: string }>;
};

type CodexResult = {
  content: string;
  model: string;
  totalTokens: number | null;
};

function contentToText(content: ChatMessage["content"]): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => (part?.type === "text" ? part.text ?? "" : ""))
    .filter(Boolean)
    .join("\n");
}

function formatPrompt(messages: ChatMessage[]): string {
  const rendered = messages
    .map((message) => {
      const role = message.role?.toUpperCase() || "USER";
      return `${role}\n${contentToText(message.content)}`;
    })
    .join("\n\n");

  return [
    "Do not use tools. Respond only to the supplied prompt.",
    "Return the structured answer requested by the prompt with no commentary outside it.",
    "",
    rendered,
  ].join("\n");
}

async function runCodex(prompt: string): Promise<CodexResult> {
  const workingDirectory = await mkdtemp(join(tmpdir(), "motive-codex-"));

  try {
    const args = [
      "exec",
      "--ephemeral",
      "--ignore-user-config",
      "--sandbox",
      "read-only",
      "--skip-git-repo-check",
      "--color",
      "never",
      "-C",
      workingDirectory,
      "-",
    ];

    const result = await new Promise<CodexResult>((resolve, reject) => {
      const child = spawn("codex", args, {
        env: process.env,
        stdio: ["pipe", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";

      const timeout = setTimeout(() => {
        child.kill("SIGTERM");
        reject(new Error("Codex timed out after 120 seconds."));
      }, 120_000);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.on("close", (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          reject(
            new Error(
              `Codex exited with status ${code}.\n${stderr.slice(-2_000)}`,
            ),
          );
          return;
        }

        const model = stderr.match(/^model:\s*(.+)$/m)?.[1]?.trim() ?? "unknown";
        const tokenMatch = stderr.match(/tokens used\s*\n([\d,]+)/i);
        const totalTokens = tokenMatch
          ? Number(tokenMatch[1].replaceAll(",", ""))
          : null;

        resolve({
          content: stdout.trim(),
          model,
          totalTokens,
        });
      });

      child.stdin.end(prompt);
    });

    return result;
  } finally {
    await rm(workingDirectory, { recursive: true, force: true });
  }
}

export async function POST(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];
  const adapterHeader = request.headers.get("x-motive-adapter");

  if (
    adapterHeader !== "motive-local" ||
    (host !== "127.0.0.1" && host !== "localhost" && host !== "[::1]")
  ) {
    return NextResponse.json({ error: "Local adapter only." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      messages?: ChatMessage[];
      model?: string;
      stream?: boolean;
    };
    const startedAt = Date.now();
    const codex = await runCodex(formatPrompt(body.messages ?? []));
    const id = `codex-${startedAt}`;
    const created = Math.floor(startedAt / 1000);
    const usage = {
      prompt_tokens: codex.totalTokens,
      completion_tokens: 0,
      total_tokens: codex.totalTokens,
    };
    if (body.stream) {
      const chunks = [
        {
          id,
          object: "chat.completion.chunk",
          created,
          model: codex.model,
          choices: [
            {
              index: 0,
              delta: { role: "assistant" },
              finish_reason: null as "stop" | null,
            },
          ],
        },
        {
          id,
          object: "chat.completion.chunk",
          created,
          model: codex.model,
          choices: [
            {
              index: 0,
              delta: { content: codex.content },
              finish_reason: null as "stop" | null,
            },
          ],
        },
        {
          id,
          object: "chat.completion.chunk",
          created,
          model: codex.model,
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: "stop",
            },
          ],
          usage,
        },
      ];
      const stream = chunks
        .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
        .concat("data: [DONE]\n\n")
        .join("");

      return new Response(stream, {
        headers: {
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "text/event-stream; charset=utf-8",
        },
      });
    }

    return NextResponse.json({
      id,
      object: "chat.completion",
      created,
      model: codex.model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: codex.content,
          },
          finish_reason: "stop",
        },
      ],
      usage,
    });
  } catch (error) {
    const publicError = toPublicCodexError(error);
    return NextResponse.json(publicError, { status: publicError.status });
  }
}
