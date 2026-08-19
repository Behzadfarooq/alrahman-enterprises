import { PhoneIcon, WhatsAppIcon } from "./icons";
import { site, telLink, waLink } from "@/lib/site";

/** Fixed call/WhatsApp bar for phones — the primary conversion path on mobile. */
export function MobileContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 p-2.5 backdrop-blur sm:hidden">
      <div className="flex gap-2">
        <a
          href={telLink()}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-800 text-sm font-semibold text-white active:scale-[0.98]"
        >
          <PhoneIcon width={18} height={18} /> Call {site.phone}
        </a>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1ebe5d] text-sm font-semibold text-white active:scale-[0.98]"
        >
          <WhatsAppIcon width={18} height={18} /> WhatsApp
        </a>
      </div>
    </div>
  );
}
