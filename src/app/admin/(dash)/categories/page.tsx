import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-brand-950">Categories</h1>
        <p className="mt-1 text-sm text-brand-600">
          Categories group your products on the website — refrigerators, ACs, televisions and so on.
        </p>
      </header>

      <TaxonomyManager
        kind="category"
        saveAction={saveCategoryAction}
        deleteAction={deleteCategoryAction}
        textLabel="Short description"
        textHint="Optional — shown under the category name on the website."
        addHint="Add a category such as Refrigerators, Air Conditioners or Water Purifiers."
        items={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          text: c.description,
          sortOrder: c.sortOrder,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
