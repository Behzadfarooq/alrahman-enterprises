import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per upload
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export class UploadError extends Error {}

/** Resizes and re-encodes to WebP so product photos stay small and consistent. */
async function normalise(file: File) {
  if (!ALLOWED.includes(file.type)) {
    throw new UploadError(`Unsupported file type: ${file.type || "unknown"}. Use JPG, PNG or WebP.`);
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError(`"${file.name}" is larger than 8 MB. Please use a smaller image.`);
  }
  const input = Buffer.from(await file.arrayBuffer());
  return sharp(input)
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new UploadError("Supabase storage is not configured.");
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Stores one image and returns its public URL. */
export async function saveImage(file: File): Promise<string> {
  // Hosted serverless filesystems are read-only or wiped between requests, so
  // the local driver would silently lose photos. Fail loudly instead of
  // accepting an upload that cannot last.
  const isHosted = Boolean(process.env.NETLIFY || process.env.VERCEL);
  if (isHosted && process.env.STORAGE_DRIVER !== "supabase") {
    throw new UploadError(
      "Image storage is not configured. Set STORAGE_DRIVER=supabase and the Supabase keys in your hosting environment.",
    );
  }

  const buffer = await normalise(file);
  const key = `${new Date().getFullYear()}/${randomUUID()}.webp`;

  if (process.env.STORAGE_DRIVER === "supabase") {
    const bucket = process.env.SUPABASE_BUCKET || "product-images";
    const client = supabase();
    const { error } = await client.storage
      .from(bucket)
      .upload(key, buffer, { contentType: "image/webp", upsert: false });
    if (error) throw new UploadError(`Upload failed: ${error.message}`);
    return client.storage.from(bucket).getPublicUrl(key).data.publicUrl;
  }

  const target = path.join(process.cwd(), "public", "uploads", key);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
  return `/uploads/${key}`;
}

/** Best-effort removal; a missing file must never block deleting a product. */
export async function deleteImage(url: string): Promise<void> {
  try {
    if (process.env.STORAGE_DRIVER === "supabase") {
      const bucket = process.env.SUPABASE_BUCKET || "product-images";
      const marker = `/${bucket}/`;
      const key = url.slice(url.indexOf(marker) + marker.length);
      if (!key || key === url) return;
      await supabase().storage.from(bucket).remove([key]);
      return;
    }
    if (!url.startsWith("/uploads/")) return;
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // Ignore — the database record is the source of truth.
  }
}
