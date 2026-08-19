import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, EmptyState, SectionHeading } from "@/components/ui";
import { getCategories } from "@/lib/queries";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Product Categories",
  description: `Refrigerators, air conditioners, washing machines, televisions and home appliances available at ${site.name} in Anantnag.`,
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        eyebrow="Categories"
        title="Everything we carry, by category"
        description="Pick a category to see exactly what is available in the showroom right now."
      />

      {categories.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No categories yet"
            description="Categories added from the admin dashboard will be listed here."
            action={<ButtonLink href="/products" variant="outline">Browse products</ButtonLink>}
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] bg-brand-50/60">
                {c.imageUrl && (
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 380px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-bold text-brand-950">{c.name}</h2>
                {c.description && <p className="mt-2 text-sm leading-relaxed text-brand-700/80">{c.description}</p>}
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-500">
                  {c._count.products} {c._count.products === 1 ? "product" : "products"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
