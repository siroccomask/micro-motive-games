import { NextRequest, NextResponse } from "next/server";
import { b } from "@/baml_client/baml_client";
import type { DiscoveryMessage } from "@/baml_client/baml_client";
import { toPublicCodexError } from "@/libs/codex/public-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FinalizeRequest = {
  acceptedStatement?: string;
  messages?: DiscoveryMessage[];
  evidenceSummary?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FinalizeRequest;
    const acceptedStatement = body.acceptedStatement?.trim() ?? "";
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (
      !acceptedStatement ||
      messages.length === 0 ||
      messages.some(
        (message) =>
          typeof message?.role !== "string" ||
          typeof message?.content !== "string",
      )
    ) {
      return NextResponse.json(
        { error: "An accepted statement and typed conversation are required." },
        { status: 400 },
      );
    }

    const generatedMotive = await b.FinalizeMicroMotive(
      {
        accepted_statement: acceptedStatement,
        messages,
        evidence_summary: body.evidenceSummary ?? null,
      },
    );

    return NextResponse.json({
      motive: {
        ...generatedMotive,
        statement: acceptedStatement,
      },
    });
  } catch (error) {
    const publicError = toPublicCodexError(error);

    return NextResponse.json(publicError, { status: publicError.status });
  }
}
