import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit product" };

type Spec = { label: string; value: string };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <nav className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/admin/products" className="font-semibold text-brand-600 hover:text-brand-900">
          ← Back to products
        </Link>
        {product.isPublished && (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="font-semibold text-brand-600 hover:text-brand-900"
          >
            View on website ↗
          </Link>
        )}
      </nav>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-brand-950">Edit product</h1>

      <ProductForm
        brands={brands}
        categories={categories}
        values={{
          id: product.id,
          name: product.name,
          brandId: product.brandId ?? "",
          categoryId: product.categoryId ?? "",
          modelNumber: product.modelNumber ?? "",
          description: product.description ?? "",
          promoText: product.promoText ?? "",
          priceInr: product.priceInr?.toString() ?? "",
          mrpInr: product.mrpInr?.toString() ?? "",
          inStock: product.inStock,
          isFeatured: product.isFeatured,
          isPublished: product.isPublished,
          specs: (Array.isArray(product.specs) ? product.specs : []) as Spec[],
          images: product.images.map((i) => ({ url: i.url, alt: i.alt ?? undefined })),
        }}
      />
    </div>
  );
}
