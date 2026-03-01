import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

const MEDIA_PREFIX = "startstudio/media/";

function getBlobFetchHeaders() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname")?.trim();

  if (!pathname || !pathname.startsWith(MEDIA_PREFIX)) {
    return NextResponse.json({ error: "Invalid pathname" }, { status: 400 });
  }

  try {
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    const blob = blobs.find((item) => item.pathname === pathname);

    if (!blob) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const upstream = await fetch(blob.url, {
      headers: getBlobFetchHeaders(),
      cache: "force-cache",
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "Media fetch failed" }, { status: 404 });
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=604800, s-maxage=604800");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
