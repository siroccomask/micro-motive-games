import { NextRequest, NextResponse } from "next/server";
import { b } from "@/baml_client/baml_client";
import type { DiscoveryMessage } from "@/baml_client/baml_client";
import { toPublicCodexError } from "@/libs/codex/public-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DiscoveryRequest = {
  messages?: DiscoveryMessage[];
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DiscoveryRequest;
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (
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

    const turn = await b.ContinueDiscovery(messages);
    return NextResponse.json({ turn });
  } catch (error) {
    const publicError = toPublicCodexError(error);

    return NextResponse.json(publicError, { status: publicError.status });
  }
}
