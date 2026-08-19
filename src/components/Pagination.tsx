import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pages,
  makeHref,
}: {
  page: number;
  pages: number;
  makeHref: (page: number) => string;
}) {
  if (pages <= 1) return null;
  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={makeHref(page - 1)} className="rounded-lg border border-brand-200 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">
          Previous
        </Link>
      )}
      {numbers.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - numbers[i - 1] > 1 && <span className="px-1 text-brand-400">…</span>}
          <Link
            href={makeHref(n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "min-w-10 rounded-lg border px-3 py-2 text-center text-sm font-semibold",
              n === page ? "border-brand-800 bg-brand-800 text-white" : "border-brand-200 text-brand-700 hover:bg-brand-50",
            )}
          >
            {n}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link href={makeHref(page + 1)} className="rounded-lg border border-brand-200 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">
          Next
        </Link>
      )}
    </nav>
  );
}
