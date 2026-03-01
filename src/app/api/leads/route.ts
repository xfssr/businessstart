import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/sanity/lib/client";

type LeadBody = {
  name?: string;
  phone?: string;
  business?: string;
  message?: string;
  locale?: string;
  sourcePath?: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: LeadBody;

  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const name = normalizeString(body.name);
  const phone = normalizeString(body.phone);
  const business = normalizeString(body.business);
  const message = normalizeString(body.message);
  const locale = normalizeString(body.locale) || "he";
  const sourcePath = normalizeString(body.sourcePath) || "/";

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    if (process.env.SANITY_API_WRITE_TOKEN) {
      await sanityWriteClient.create({
        _type: "lead",
        name,
        phone,
        business,
        message,
        locale,
        sourcePath,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, stored: "sanity" }, { status: 201 });
    }

    return NextResponse.json({ ok: true, stored: "skipped_no_write_token" }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Could not store lead" }, { status: 500 });
  }
}
