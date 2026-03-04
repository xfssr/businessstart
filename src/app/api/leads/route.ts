import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

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
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const createdAt = new Date().toISOString();
      const payload = {
        id: crypto.randomUUID(),
        name,
        phone,
        business,
        message,
        locale,
        sourcePath,
        createdAt,
      };

      const day = createdAt.slice(0, 10);
      const pathname = `startstudio/leads/${day}/${payload.id}.json`;
      await put(pathname, JSON.stringify(payload, null, 2), {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: "application/json; charset=utf-8",
      });

      return NextResponse.json({ ok: true, stored: "blob" }, { status: 201 });
    }

    return NextResponse.json({ ok: true, stored: "skipped_no_blob_token" }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Could not store lead" }, { status: 500 });
  }
}
