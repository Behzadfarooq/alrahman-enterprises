import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add a product" };

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <nav className="mb-4 text-sm">
        <Link href="/admin/products" className="font-semibold text-brand-600 hover:text-brand-900">
          ← Back to products
        </Link>
      </nav>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-brand-950">Add a product</h1>

      <ProductForm
        brands={brands}
        categories={categories}
        values={{
          name: "",
          brandId: "",
          categoryId: "",
          modelNumber: "",
          description: "",
          promoText: "",
          priceInr: "",
          mrpInr: "",
          inStock: true,
          isFeatured: false,
          isPublished: true,
          specs: [],
          images: [],
        }}
      />
    </div>
  );
}
