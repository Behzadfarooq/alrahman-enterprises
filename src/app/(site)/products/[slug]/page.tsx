import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { AnchorButton, Badge, ButtonLink, SectionHeading } from "@/components/ui";
import { CheckIcon, ChevronRightIcon, PhoneIcon, ShieldIcon, WhatsAppIcon, XIcon } from "@/components/icons";
import { getProductBySlug, productCard } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { site, telLink, waLink } from "@/lib/site";
import { discountPercent, formatPrice } from "@/lib/utils";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true },
    take: 200,
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const price = formatPrice(product.priceInr);
  return {
    title: product.name,
    description:
      product.description?.slice(0, 155) ??
      `${product.name} ${product.brand ? `by ${product.brand.name} ` : ""}available at ${site.name}, Anantnag.${price ? ` Priced at ${price}.` : ""}`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 155) ?? undefined,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

type Spec = { label: string; value: string };

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const specs = (Array.isArray(product.specs) ? product.specs : []) as Spec[];
  const price = formatPrice(product.priceInr);
  const off = discountPercent(product.priceInr, product.mrpInr);

  const related = await prisma.product.findMany({
    where: {
      isPublished: true,
      id: { not: product.id },
      OR: [{ categoryId: product.categoryId }, { brandId: product.brandId }],
    },
    ...productCard,
    take: 4,
    orderBy: { isFeatured: "desc" },
  });

  const enquiry = `Hello ${site.name}, I am interested in the ${product.name}${
    product.modelNumber ? ` (model ${product.modelNumber})` : ""
  }. Is it available?`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    sku: product.modelNumber ?? product.id,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    image: product.images.map((i) => new URL(i.url, site.url).toString()),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.priceInr ?? undefined,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.name },
      url: `${site.url}/products/${product.slug}`,
    },
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-brand-600">
        <Link href="/" className="hover:text-brand-900">Home</Link>
        <ChevronRightIcon width={13} height={13} className="text-brand-300" />
        <Link href="/products" className="hover:text-brand-900">Products</Link>
        {product.category && (
          <>
            <ChevronRightIcon width={13} height={13} className="text-brand-300" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-900">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRightIcon width={13} height={13} className="text-brand-300" />
        <span className="truncate font-medium text-brand-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.brand && (
              <Link href={`/products?brand=${product.brand.slug}`}>
                <Badge>{product.brand.name}</Badge>
              </Link>
            )}
            {product.category && (
              <Link href={`/products?category=${product.category.slug}`}>
                <Badge>{product.category.name}</Badge>
              </Link>
            )}
            <Badge tone={product.inStock ? "success" : "danger"}>
              {product.inStock ? <CheckIcon width={13} height={13} /> : <XIcon width={13} height={13} />}
              {product.inStock ? "In stock" : "Out of stock"}
            </Badge>
          </div>

          <h1 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-brand-950 sm:text-3xl">
            {product.name}
          </h1>
          {product.modelNumber && (
            <p className="mt-2 text-sm text-brand-600">Model number: <span className="font-semibold text-brand-800">{product.modelNumber}</span></p>
          )}

          <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
            {price ? (
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-brand-950">{price}</span>
                {product.mrpInr && product.mrpInr > (product.priceInr ?? 0) && (
                  <>
                    <span className="text-base text-brand-400 line-through">{formatPrice(product.mrpInr)}</span>
                    {off !== null && <Badge tone="accent">Save {off}%</Badge>}
                  </>
                )}
              </div>
            ) : (
              <p className="font-display text-xl font-bold text-brand-900">Price on enquiry</p>
            )}
            <p className="mt-2 text-xs text-brand-600">
              Inclusive of taxes. Call the showroom to confirm today&apos;s final price.
            </p>
            {product.promoText && (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-accent-100 px-3 py-2 text-sm font-semibold text-accent-700">
                <ShieldIcon width={16} height={16} /> {product.promoText}
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <AnchorButton href={telLink()} size="lg">
              <PhoneIcon width={18} height={18} /> Call {site.phoneDisplay}
            </AnchorButton>
            <AnchorButton
              href={waLink(enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
            >
              <WhatsAppIcon width={18} height={18} /> Enquire on WhatsApp
            </AnchorButton>
          </div>

          {product.description && (
            <section className="mt-8">
              <h2 className="font-display text-lg font-bold text-brand-950">About this product</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-700/85">
                {product.description}
              </p>
            </section>
          )}

          {specs.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-lg font-bold text-brand-950">Specifications</h2>
              <dl className="mt-3 overflow-hidden rounded-2xl border border-brand-100">
                {specs.map((s, i) => (
                  <div
                    key={`${s.label}-${i}`}
                    className={`grid grid-cols-[minmax(120px,38%)_1fr] gap-4 px-4 py-3 text-sm ${i % 2 ? "bg-white" : "bg-brand-50/50"}`}
                  >
                    <dt className="font-semibold text-brand-700">{s.label}</dt>
                    <dd className="text-brand-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <p className="mt-6 text-xs leading-relaxed text-brand-500">
            Visit us at {site.address.full}. Product images are representative; colours and
            finishes may vary slightly by batch.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading
            eyebrow="You may also like"
            title="Similar products in store"
            action={<ButtonLink href="/products" variant="outline" size="sm">All products</ButtonLink>}
          />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
