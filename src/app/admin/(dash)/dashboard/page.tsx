import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { AlertIcon, BoxIcon, GridIcon, PlusIcon, TagIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, inStock, featured, brands, categories, recent, noImages] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { inStock: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.brand.count(),
    prisma.category.count(),
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { brand: { select: { name: true } }, images: { take: 1, orderBy: { sortOrder: "asc" } } },
    }),
    prisma.product.count({ where: { images: { none: {} } } }),
  ]);

  const stats = [
    { label: "Products", value: products, href: "/admin/products", icon: BoxIcon },
    { label: "In stock", value: inStock, href: "/admin/products?stock=in", icon: BoxIcon },
    { label: "Featured on homepage", value: featured, href: "/admin/products?featured=1", icon: GridIcon },
    { label: "Brands", value: brands, href: "/admin/brands", icon: TagIcon },
    { label: "Categories", value: categories, href: "/admin/categories", icon: GridIcon },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-950">Welcome back</h1>
          <p className="mt-1 text-sm text-brand-600">
            Anything you change here appears on the website straight away.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <PlusIcon width={17} height={17} /> Add a product
        </Link>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-brand-100 bg-white p-4 transition-colors hover:border-brand-300"
          >
            <Icon width={18} height={18} className="text-brand-400" />
            <p className="mt-3 font-display text-2xl font-extrabold text-brand-950">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-brand-600">{label}</p>
          </Link>
        ))}
      </div>

      {(products - inStock > 0 || noImages > 0) && (
        <div className="mt-6 space-y-2">
          {products - inStock > 0 && (
            <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertIcon width={16} height={16} />
              {products - inStock} {products - inStock === 1 ? "product is" : "products are"} marked out of stock.{" "}
              <Link href="/admin/products" className="font-semibold underline underline-offset-2">Review them</Link>
            </p>
          )}
          {noImages > 0 && (
            <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertIcon width={16} height={16} />
              {noImages} {noImages === 1 ? "product has" : "products have"} no photo yet — products with photos sell better.
            </p>
          )}
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-brand-100 bg-white">
        <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <h2 className="font-display text-sm font-bold text-brand-950">Recently updated</h2>
          <Link href="/admin/products" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-600">
            No products yet.{" "}
            <Link href="/admin/products/new" className="font-semibold text-brand-800 underline underline-offset-2">
              Add your first product
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-brand-100">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/products/${p.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-50/60">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-brand-100 bg-brand-50">
                    {p.images[0] && (
                      <Image src={p.images[0].url} alt="" fill sizes="48px" className="object-contain p-1" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-brand-950">{p.name}</span>
                    <span className="block truncate text-xs text-brand-500">
                      {p.brand?.name ?? "No brand"} · {formatPrice(p.priceInr) ?? "Price on enquiry"}
                    </span>
                  </span>
                  <Badge tone={p.inStock ? "success" : "danger"}>{p.inStock ? "In stock" : "Out of stock"}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-brand-100 bg-white p-5">
        <h2 className="font-display text-sm font-bold text-brand-950">How this works</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-700/85">
          <li>• <strong>Products</strong> — add, edit, delete, upload photos, and switch stock on or off.</li>
          <li>• <strong>Brands</strong> and <strong>Categories</strong> — anything you add here appears in the product form and on the website menus.</li>
          <li>• Turn on <strong>Feature on homepage</strong> in a product to show it in the &ldquo;Featured&rdquo; row.</li>
          <li>• Need help? Call your developer, or check the README in the project folder.</li>
        </ul>
        <p className="mt-4 text-xs text-brand-500">
          Store phone shown on the site: {site.phoneDisplay} · {site.address.full}
        </p>
      </section>
    </div>
  );
}
