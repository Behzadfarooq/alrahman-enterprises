import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Pagination } from "@/components/Pagination";
import { ButtonLink, EmptyState } from "@/components/ui";
import { getBrands, getCategories, listProducts } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse every refrigerator, air conditioner, washing machine, television and home appliance currently available at Al Rahman Enterprises, Anantnag.",
  alternates: { canonical: "/products" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function Skeleton() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-brand-100 bg-white p-4">
          <div className="aspect-square rounded-xl bg-brand-50" />
          <div className="mt-4 h-3 w-1/3 rounded bg-brand-50" />
          <div className="mt-2 h-4 w-full rounded bg-brand-50" />
          <div className="mt-2 h-4 w-2/3 rounded bg-brand-50" />
        </div>
      ))}
    </div>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters = {
    q: first(sp.q),
    brand: first(sp.brand),
    category: first(sp.category),
    stock: first(sp.stock),
    sort: first(sp.sort),
  };
  const page = Math.max(1, Number(first(sp.page) ?? 1) || 1);

  const [{ items, total, pages }, brands, categories] = await Promise.all([
    listProducts(filters, page),
    getBrands(),
    getCategories(),
  ]);

  const makeHref = (p: number) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v) next.set(k, v);
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <>
      <ProductFilters
        total={total}
        brands={brands.filter((b) => b._count.products > 0).map((b) => ({ name: b.name, slug: b.slug, count: b._count.products }))}
        categories={categories.filter((c) => c._count.products > 0).map((c) => ({ name: c.name, slug: c.slug, count: c._count.products }))}
      />

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No products match your search"
            description="Try a different keyword, or clear the filters to see everything we have in the showroom."
            action={<ButtonLink href="/products" variant="outline">Show all products</ButtonLink>}
          />
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination page={page} pages={pages} makeHref={makeHref} />
        </>
      )}
    </>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container-page py-10 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">Our catalogue</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
          Products available in store
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-700/80 sm:text-base">
          Everything listed here is stocked or readily arranged at our Anantnag showroom.
          Call us to confirm the current price and availability before you visit.
        </p>
      </header>

      <Suspense fallback={<Skeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
