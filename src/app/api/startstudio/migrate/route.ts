import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/startstudio";

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Migration endpoint is no longer needed. This project now runs on Vercel Blob only.",
    },
    { status: 410 },
  );
}
