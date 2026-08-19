import Image from "next/image";
import Link from "next/link";
import { ButtonLink, AnchorButton, SectionHeading, EmptyState, Badge } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { StoreMap } from "@/components/StoreMap";
import {
  ChevronRightIcon, ClockIcon, MapPinIcon, PhoneIcon, ShieldIcon,
  SparkIcon, TruckIcon, WhatsAppIcon,
} from "@/components/icons";
import { getBrands, getCategories, getFeaturedProducts } from "@/lib/queries";
import { site, telLink, waLink } from "@/lib/site";

export const revalidate = 60;

const trust = [
  { icon: ShieldIcon, title: "Genuine brand warranty", body: "Every product is sourced through authorised channels with full manufacturer warranty." },
  { icon: TruckIcon, title: "Local delivery & installation", body: "Delivery and fitting arranged across Anantnag and the surrounding areas." },
  { icon: SparkIcon, title: "Honest, in-person advice", body: "Compare models side by side in the showroom and get a straight recommendation." },
];

export default async function HomePage() {
  const [featured, categories, brands] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getBrands(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(60rem 30rem at 15% -10%, #2f7d81 0%, transparent 60%), radial-gradient(40rem 24rem at 95% 20%, #fda52f22 0%, transparent 65%)",
          }}
        />
        <div className="container-page relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="animate-rise">
            <Badge tone="accent" className="mb-5">
              <MapPinIcon width={13} height={13} /> KP Road, Sadiqabad — Anantnag
            </Badge>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Electronics & home appliances,
              <span className="text-accent-300"> chosen with care.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-200/85 sm:text-lg">
              Refrigerators, air conditioners, washing machines and televisions from trusted brands —
              on display at our Anantnag showroom. Browse what is in stock, then call us for the best price.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/products" size="lg" variant="accent">
                Browse products <ChevronRightIcon width={17} height={17} />
              </ButtonLink>
              <AnchorButton href={telLink()} size="lg" variant="outline" className="border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15">
                <PhoneIcon width={18} height={18} /> {site.phoneDisplay}
              </AnchorButton>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                { k: `${categories.length}`, v: "Categories" },
                { k: `${brands.length}`, v: "Brands stocked" },
                { k: "In-store", v: "Demo & advice" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-extrabold text-white">{s.k}</dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-brand-300/80">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Showroom-style product collage built from category art */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {categories.slice(0, 4).map((c, i) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-lift transition-transform duration-300 hover:-translate-y-1"
                  style={{ transform: i % 2 ? "translateY(1.5rem)" : undefined }}
                >
                  {c.imageUrl && (
                    <Image
                      src={c.imageUrl}
                      alt={c.name}
                      fill
                      sizes="240px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={i < 2}
                    />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/85 to-transparent p-3 text-sm font-bold text-white">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-brand-100 bg-brand-50/50">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-3 sm:py-10">
          {trust.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card">
                <Icon />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-700/75">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Shop by category"
          title="What we keep in the showroom"
          description="From everyday kitchen appliances to full-size refrigerators and air conditioners."
          action={
            <ButtonLink href="/categories" variant="outline" size="sm">
              All categories <ChevronRightIcon width={15} height={15} />
            </ButtonLink>
          }
        />
        {categories.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="No categories yet" description="Categories added from the admin dashboard will appear here." />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="group rounded-2xl border border-brand-100 bg-white p-3 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl bg-brand-50/70">
                  {c.imageUrl && (
                    <Image
                      src={c.imageUrl}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 180px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-3 font-display text-[13px] font-bold leading-tight text-brand-950">{c.name}</p>
                <p className="mt-1 text-[11px] text-brand-500">
                  {c._count.products} {c._count.products === 1 ? "product" : "products"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="border-y border-brand-100 bg-brand-50/40">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured this month"
            description="A selection of what is moving fastest off the showroom floor."
            action={
              <ButtonLink href="/products" variant="outline" size="sm">
                See all products <ChevronRightIcon width={15} height={15} />
              </ButtonLink>
            }
          />
          {featured.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No featured products yet"
                description="Mark a product as featured in the admin dashboard and it will show up here."
                action={<ButtonLink href="/products" variant="outline" size="sm">Browse all products</ButtonLink>}
              />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brands */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Brands"
          title="Names you already trust"
          description="We stock and service leading appliance brands, with full manufacturer warranty."
          align="center"
        />
        {brands.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="No brands added yet" description="Add brands from the admin dashboard to display them here." />
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {brands.map((b) => (
              <Link
                key={b.id}
                href={`/products?brand=${b.slug}`}
                className="group flex min-w-[150px] flex-col items-center gap-1 rounded-2xl border border-brand-100 bg-white px-8 py-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <span className="font-display text-xl font-extrabold tracking-tight text-brand-900">{b.name}</span>
                <span className="text-xs text-brand-500">{b._count.products} products</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Location & contact */}
      <section className="border-t border-brand-100 bg-white">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Find us"
              title="Come and see it in person"
              description="Our showroom is on KP Road in Sadiqabad, Anantnag. Walk in to compare models, or call ahead and we will keep it ready."
            />
            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><MapPinIcon /></span>
                <div>
                  <p className="font-display text-sm font-bold text-brand-950">Address</p>
                  <p className="mt-0.5 text-sm text-brand-700/80">{site.address.full}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><PhoneIcon /></span>
                <div>
                  <p className="font-display text-sm font-bold text-brand-950">Phone</p>
                  <a href={telLink()} className="mt-0.5 block text-sm text-brand-700/80 hover:text-brand-900">{site.phoneDisplay}</a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><ClockIcon /></span>
                <div>
                  <p className="font-display text-sm font-bold text-brand-950">Showroom hours</p>
                  {site.hours.map((h) => (
                    <p key={h.days} className="mt-0.5 text-sm text-brand-700/80">
                      {h.days} · {h.time}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <AnchorButton href={telLink()}><PhoneIcon width={17} height={17} /> Call the showroom</AnchorButton>
              <AnchorButton href={waLink()} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                <WhatsAppIcon width={17} height={17} /> WhatsApp us
              </AnchorButton>
            </div>
          </div>
          <StoreMap className="min-h-[340px]" />
        </div>
      </section>
    </>
  );
}
