import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { QuickToggle } from "@/components/admin/QuickToggle";
import { deleteProductAction, toggleFeaturedAction, toggleStockAction } from "@/app/admin/actions";
import { CheckIcon, EditIcon, PlusIcon, SearchIcon } from "@/components/icons";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; stock?: string; featured?: string; saved?: string }>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, stock, featured, saved } = await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { modelNumber: { contains: q, mode: "insensitive" } },
    ];
  }
  if (stock === "in") where.inStock = true;
  if (stock === "out") where.inStock = false;
  if (featured === "1") where.isFeatured = true;

  const products = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-950">Products</h1>
          <p className="mt-1 text-sm text-brand-600">
            {products.length} {products.length === 1 ? "product" : "products"} shown
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <PlusIcon width={17} height={17} /> Add a product
        </Link>
      </header>

      {saved && (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckIcon width={16} height={16} /> &ldquo;{saved}&rdquo; has been saved and is live on the website.
        </p>
      )}

      <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/admin/products">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search products by name or model number…"
            className="h-11 w-full rounded-xl border border-brand-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <select
          name="stock"
          defaultValue={stock ?? ""}
          className="h-11 rounded-xl border border-brand-200 bg-white px-4 text-sm font-medium text-brand-800 outline-none focus:border-brand-500 sm:w-44"
        >
          <option value="">All stock</option>
          <option value="in">In stock only</option>
          <option value="out">Out of stock only</option>
        </select>
        <button type="submit" className="h-11 rounded-xl border border-brand-200 bg-white px-5 text-sm font-semibold text-brand-800 hover:bg-brand-50">
          Search
        </button>
      </form>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-white px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-brand-900">
            {q || stock || featured ? "No products match this search" : "No products yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-brand-600">
            {q || stock || featured
              ? "Try a different search, or clear the filters."
              : "Add your first product and it will appear on the website immediately."}
          </p>
          <Link
            href="/admin/products/new"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <PlusIcon width={17} height={17} /> Add a product
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-white p-4 sm:flex-row sm:items-center"
            >
              <span className="relative h-20 w-20 shrink-0 self-start overflow-hidden rounded-xl border border-brand-100 bg-brand-50">
                {p.images[0] ? (
                  <Image src={p.images[0].url} alt="" fill sizes="80px" className="object-contain p-1.5" />
                ) : (
                  <span className="flex h-full items-center justify-center px-1 text-center text-[10px] font-medium text-brand-400">
                    No photo
                  </span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-sm font-bold text-brand-950">{p.name}</h2>
                  {!p.isPublished && <Badge tone="warning">Hidden from site</Badge>}
                </div>
                <p className="mt-1 text-xs text-brand-500">
                  {p.brand?.name ?? "No brand"} · {p.category?.name ?? "No category"}
                  {p.modelNumber ? ` · Model ${p.modelNumber}` : ""}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-brand-900">
                  {formatPrice(p.priceInr) ?? "Price on enquiry"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <QuickToggle
                  action={toggleStockAction}
                  id={p.id}
                  on={p.inStock}
                  onLabel="In stock"
                  offLabel="Out of stock"
                />
                <QuickToggle
                  action={toggleFeaturedAction}
                  id={p.id}
                  on={p.isFeatured}
                  onLabel="Featured"
                  offLabel="Not featured"
                />
                <Link
                  href={`/admin/products/${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-800 hover:bg-brand-50"
                >
                  <EditIcon width={14} height={14} /> Edit
                </Link>
                <ConfirmDelete action={deleteProductAction} id={p.id} name={p.name} what="product" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
