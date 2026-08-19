import { site } from "@/lib/site";
import { MapPinIcon } from "./icons";
import { cn } from "@/lib/utils";

/**
 * Google Maps embed. The public "maps/embed/v1" API needs a key, so we use the
 * keyless query embed — it works without any billing setup.
 */
export function StoreMap({ className }: { className?: string }) {
  const src = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&output=embed`;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-brand-100 shadow-card", className)}>
      <iframe
        title={`Map showing ${site.name} in ${site.address.city}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full min-h-[300px] w-full border-0"
      />
      <a
        href={site.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-t border-brand-100 bg-white px-4 py-3.5 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
      >
        <MapPinIcon width={17} height={17} /> Get directions on Google Maps
      </a>
    </div>
  );
}
