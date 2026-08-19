import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { deleteBrandAction, saveBrandAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Brands" };

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-brand-950">Brands</h1>
        <p className="mt-1 text-sm text-brand-600">
          Brands you add here can be chosen when adding a product, and appear on the website.
        </p>
      </header>

      <TaxonomyManager
        kind="brand"
        saveAction={saveBrandAction}
        deleteAction={deleteBrandAction}
        textLabel="About this brand"
        textHint="Optional — one or two lines shown on the Brands page."
        addHint="Add any brand you stock, such as Voltas, Haier or Samsung."
        items={brands.map((b) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          text: b.about,
          sortOrder: b.sortOrder,
          productCount: b._count.products,
        }))}
      />
    </div>
  );
}
