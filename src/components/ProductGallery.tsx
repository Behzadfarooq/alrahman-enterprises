"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Img = { id: string; url: string; alt: string | null };

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-brand-100 bg-brand-50/60 text-sm font-medium text-brand-400">
        No photo available yet
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
        <Image
          src={current.url}
          alt={current.alt ?? name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-white transition-colors",
                i === active ? "border-brand-700 ring-1 ring-brand-700" : "border-brand-100 hover:border-brand-300",
              )}
            >
              <Image src={img.url} alt="" fill sizes="90px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
