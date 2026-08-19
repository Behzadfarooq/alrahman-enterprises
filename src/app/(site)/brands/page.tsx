import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, EmptyState, SectionHeading } from "@/components/ui";
import { ChevronRightIcon } from "@/components/icons";
import { getBrands } from "@/lib/queries";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Brands We Stock",
  description: `Authorised brands available at ${site.name}, KP Road, Anantnag — including Voltas and Haier appliances with full manufacturer warranty.`,
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        eyebrow="Our brands"
        title="Brands we stock and service"
        description="We deal in appliances from established manufacturers, supplied through authorised channels with full brand warranty and after-sales support."
      />

      {brands.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No brands added yet"
            description="Brands added from the admin dashboard will be listed on this page."
            action={<ButtonLink href="/products" variant="outline">Browse products</ButtonLink>}
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/products?brand=${b.slug}`}
              className="group flex flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-extrabold tracking-tight text-brand-900">{b.name}</span>
                <ChevronRightIcon className="text-brand-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
              </div>
              {b.about && <p className="mt-3 text-sm leading-relaxed text-brand-700/80">{b.about}</p>}
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-500">
                {b._count.products} {b._count.products === 1 ? "product" : "products"} listed
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
