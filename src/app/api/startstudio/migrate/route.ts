import { NextResponse } from "next/server";

import {
  isSanityWriteConfigured,
  migrateLegacyBlobContentToSanity,
} from "@/lib/startstudio-sanity";
import { getStartStudioContent, isAdminAuthorized } from "@/lib/startstudio";

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSanityWriteConfigured()) {
    return NextResponse.json(
      {
        error: "Sanity write is not configured (missing project/dataset or SANITY_API_WRITE_TOKEN)",
      },
      { status: 500 },
    );
  }

  const content = await getStartStudioContent();
  if (!content) {
    return NextResponse.json(
      { ok: false, error: "Legacy Blob content not found" },
      { status: 404 },
    );
  }

  try {
    const result = await migrateLegacyBlobContentToSanity(content);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: reason }, { status: 500 });
  }
}
