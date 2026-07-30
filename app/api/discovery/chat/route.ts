import { NextRequest, NextResponse } from "next/server";
import type { DiscoveryMessage } from "@/baml_client/baml_client";
import { toPublicCodexError } from "@/libs/codex/public-error";
import { continueDiscovery } from "@/libs/discovery/continue";
import {
  isDiscoveryEntry,
  isDiscoveryMethod,
  isDiscoveryStage,
} from "@/libs/discovery/strategy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DiscoveryRequest = {
  entry?: unknown;
  method?: unknown;
  stage?: unknown;
  messages?: DiscoveryMessage[];
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DiscoveryRequest;
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (
      !isDiscoveryEntry(body.entry) ||
      (body.method != null && !isDiscoveryMethod(body.method)) ||
      (body.stage != null && !isDiscoveryStage(body.stage)) ||
      messages.length === 0 ||
      messages.some(
        (message) =>
          typeof message?.role !== "string" ||
          typeof message?.content !== "string",
      )
    ) {
      return NextResponse.json(
        { error: "A non-empty typed conversation is required." },
        { status: 400 },
      );
    }

    const turn = await continueDiscovery({
      entry: body.entry,
      method: isDiscoveryMethod(body.method) ? body.method : null,
      stage: isDiscoveryStage(body.stage) ? body.stage : null,
      messages,
    });
    return NextResponse.json({ turn });
  } catch (error) {
    const publicError = toPublicCodexError(error);

    return NextResponse.json(publicError, { status: publicError.status });
  }
}
