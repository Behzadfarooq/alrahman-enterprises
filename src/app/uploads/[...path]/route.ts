import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Serves images written by the local storage driver.
 *
 * Next.js only serves files that existed in /public at build time, so freshly
 * uploaded photos need this handler. In production STORAGE_DRIVER is "supabase"
 * and image URLs point at Supabase directly, so this route is never hit.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Reject traversal attempts before touching the filesystem.
  if (segments.some((s) => s.includes("..") || s.includes("\0"))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const root = path.join(process.cwd(), "public", "uploads");
  const file = path.join(root, ...segments);
  if (!file.startsWith(root + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const info = await stat(file);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });

    const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
    return new NextResponse(stream, {
      headers: {
        "Content-Type": file.endsWith(".webp") ? "image/webp" : "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
