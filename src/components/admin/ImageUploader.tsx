"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { AlertIcon, TrashIcon, UploadIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type UploadedImage = { url: string; alt?: string };

/**
 * Drag-and-drop (or click to browse) uploader with previews and reordering.
 * The resulting list is serialised into a hidden input so it posts with the form.
 */
export function ImageUploader({
  name = "images",
  initial = [],
}: {
  name?: string;
  initial?: UploadedImage[];
}) {
  const [images, setImages] = useState<UploadedImage[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    if (images.length + files.length > 10) {
      setError("A product can have at most 10 images.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      for (const file of files) body.append("files", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = (await response.json()) as { urls?: string[]; error?: string };

      if (!response.ok || !payload.urls) {
        setError(payload.error ?? "Upload failed. Please try again.");
        return;
      }
      const uploaded = payload.urls.map((url) => ({ url }));
      setImages((current) => [...current, ...uploaded]);
    } catch {
      setError("Upload failed — please check your internet connection and try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) {
      setError("Please drop image files only (JPG, PNG or WebP).");
      return;
    }
    void upload(files);
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
          dragging ? "border-brand-500 bg-brand-50" : "border-brand-200 bg-brand-50/40",
        )}
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card">
          <UploadIcon width={22} height={22} />
        </span>
        <p className="mt-3 font-display text-sm font-bold text-brand-950">
          Drag photos here, or choose from your device
        </p>
        <p className="mt-1 text-xs text-brand-600">
          JPG, PNG or WebP · up to 8 MB each · the first photo is used as the main image
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <li
              key={img.url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-brand-200 bg-white"
            >
              <Image src={img.url} alt="" fill sizes="140px" className="object-contain p-2" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-md bg-brand-800 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  MAIN
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-white/95 p-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Move image left"
                  className="rounded px-1.5 text-brand-700 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setImages((c) => c.filter((_, idx) => idx !== i))}
                  aria-label="Remove image"
                  className="rounded px-1.5 text-red-600 hover:bg-red-50"
                >
                  <TrashIcon width={15} height={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === images.length - 1}
                  aria-label="Move image right"
                  className="rounded px-1.5 text-brand-700 disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
