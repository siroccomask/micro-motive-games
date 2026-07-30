import { NextRequest, NextResponse } from "next/server";
import {
  listMotives,
  migrateMotives,
  saveMotive,
  setMotiveStatus,
} from "@/libs/motives/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function canMutate(request: NextRequest) {
  return request.headers.get("x-motive-local") === "file-store";
}

function errorResponse(error: unknown) {
  return NextResponse.json(
    {
      error:
        error instanceof Error ? error.message : "Unknown motive storage error.",
    },
    { status: 400 },
  );
}

export async function GET() {
  try {
    return NextResponse.json({
      motives: await listMotives(),
      storage: "file",
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  if (!canMutate(request)) {
    return NextResponse.json({ error: "Local file store only." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      action?: "migrate" | "save";
      motives?: unknown;
      motive?: unknown;
    };

    if (body.action === "migrate") {
      return NextResponse.json({
        ...(await migrateMotives(body.motives)),
        storage: "file",
      });
    }

    if (body.action === "save") {
      return NextResponse.json({
        ...(await saveMotive(body.motive)),
        storage: "file",
      });
    }

    return NextResponse.json({ error: "Unknown storage action." }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  if (!canMutate(request)) {
    return NextResponse.json({ error: "Local file store only." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      id?: string;
      status?: "confirmed" | "archived";
    };

    if (
      typeof body.id !== "string" ||
      (body.status !== "confirmed" && body.status !== "archived")
    ) {
      return NextResponse.json(
        { error: "A motive id and valid status are required." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ...(await setMotiveStatus(body.id, body.status)),
      storage: "file",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
