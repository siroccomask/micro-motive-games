import { NextRequest, NextResponse } from "next/server";
import { b } from "@/baml_client/baml_client";
import { toPublicCodexError } from "@/libs/codex/public-error";
import type { MicroMotive } from "@/libs/motives/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BreakdownRequest = {
  motive?: MicroMotive;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BreakdownRequest;
    const motive = body.motive;

    if (
      !motive ||
      typeof motive.title !== "string" ||
      typeof motive.statement !== "string" ||
      typeof motive.whyItMatters !== "string" ||
      !Array.isArray(motive.evidence)
    ) {
      return NextResponse.json(
        { error: "A confirmed micro-motive is required." },
        { status: 400 },
      );
    }

    const result = await b.BreakdownMicroMotive({
      title: motive.title,
      statement: motive.statement,
      why_it_matters: motive.whyItMatters,
      boundary_conditions: motive.boundaryConditions ?? null,
      evidence: motive.evidence,
    });

    return NextResponse.json({ candidates: result.candidates });
  } catch (error) {
    const publicError = toPublicCodexError(error);
    return NextResponse.json(publicError, { status: publicError.status });
  }
}
