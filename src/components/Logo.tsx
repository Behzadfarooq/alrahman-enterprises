import { cn } from "@/lib/utils";

/** Al Rahman Enterprises monogram: an "A" arch inside a rounded shield. */
export function LogoMark({ className }: { className?: string }) {
  return (
    // Solid fills only — a gradient would need a document-unique id, which breaks
    // when the logo is rendered more than once on the same page.
    <svg viewBox="0 0 48 48" aria-hidden className={cn("h-9 w-9", className)}>
      <rect width="48" height="48" rx="13" fill="#0f3336" />
      <rect x="4" y="4" width="40" height="40" rx="10" fill="#1f5154" />
      <path
        d="M14 34.5 24 13l10 21.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18.6 28h10.8" stroke="#fda52f" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-extrabold tracking-tight sm:text-base",
            inverted ? "text-white" : "text-brand-900",
          )}
        >
          Al Rahman
        </span>
        <span
          className={cn(
            "mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
            inverted ? "text-brand-200" : "text-brand-500",
          )}
        >
          Enterprises
        </span>
      </span>
    </span>
  );
}
