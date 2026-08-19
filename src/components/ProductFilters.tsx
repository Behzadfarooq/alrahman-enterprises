"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SearchIcon, XIcon } from "./icons";
import { cn } from "@/lib/utils";

type Option = { name: string; slug: string; count: number };

export function ProductFilters({
  brands,
  categories,
  total,
}: {
  brands: Option[];
  categories: Option[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");

  // Keep the input in sync when navigation changes the URL (e.g. "Clear all").
  useEffect(() => setQuery(params.get("q") ?? ""), [params]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  // Debounce search so typing does not fire a request per keystroke.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (query === current) return;
    const id = setTimeout(() => update({ q: query || null }), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const activeBrand = params.get("brand");
  const activeCategory = params.get("category");
  const inStockOnly = params.get("stock") === "in";
  const sort = params.get("sort") ?? "featured";
  const hasFilters = Boolean(activeBrand || activeCategory || inStockOnly || params.get("q"));

  const Chip = ({
    label,
    active,
    onClick,
    count,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-brand-800 bg-brand-800 text-white"
          : "border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50",
      )}
    >
      {label}
      {count !== undefined && <span className={cn("ml-1.5", active ? "text-brand-200" : "text-brand-400")}>{count}</span>}
    </button>
  );

  return (
    <div className={cn("space-y-5 transition-opacity", pending && "opacity-60")}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, brand or model number…"
            aria-label="Search products"
            className="h-12 w-full rounded-xl border border-brand-200 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-brand-400 focus:border-brand-500"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}
          aria-label="Sort products"
          className="h-12 rounded-xl border border-brand-200 bg-white px-4 text-sm font-medium text-brand-800 outline-none focus:border-brand-500 sm:w-52"
        >
          <option value="featured">Sort: Featured first</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-brand-500">Category</span>
          <Chip label="All" active={!activeCategory} onClick={() => update({ category: null })} />
          {categories.map((c) => (
            <Chip
              key={c.slug}
              label={c.name}
              count={c.count}
              active={activeCategory === c.slug}
              onClick={() => update({ category: activeCategory === c.slug ? null : c.slug })}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-brand-500">Brand</span>
          <Chip label="All" active={!activeBrand} onClick={() => update({ brand: null })} />
          {brands.map((b) => (
            <Chip
              key={b.slug}
              label={b.name}
              count={b.count}
              active={activeBrand === b.slug}
              onClick={() => update({ brand: activeBrand === b.slug ? null : b.slug })}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-800">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => update({ stock: e.target.checked ? "in" : null })}
            className="h-4 w-4 rounded border-brand-300 accent-brand-700"
          />
          In stock only
        </label>
        <div className="flex items-center gap-3">
          <p className="text-sm text-brand-600">
            {total} {total === 1 ? "product" : "products"}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900"
            >
              <XIcon width={14} height={14} /> Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
