import Link from "next/link";
import { Logo } from "./Logo";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { site, telLink, waLink } from "@/lib/site";

export function Footer({
  categories,
}: {
  categories: Array<{ name: string; slug: string }>;
}) {
  return (
    <footer className="mt-24 border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">
            Your neighbourhood electronics and home appliance showroom on KP Road, Sadiqabad, Anantnag.
            Genuine products, brand warranty and honest advice.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={telLink()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Call the showroom"
            >
              <PhoneIcon width={18} height={18} />
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Message on WhatsApp"
            >
              <WhatsAppIcon width={18} height={18} />
            </a>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Open in Google Maps"
            >
              <MapPinIcon width={18} height={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/products" className="text-brand-200/85 hover:text-white">All products</Link></li>
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="text-brand-200/85 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li><Link href="/brands" className="text-brand-200/85 hover:text-white">Brands we stock</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">Visit the store</h3>
          <ul className="mt-4 space-y-3.5 text-sm text-brand-200/85">
            <li className="flex gap-3">
              <MapPinIcon width={17} height={17} className="mt-0.5 shrink-0 text-accent-300" />
              <span>{site.address.line1}<br />{site.address.city}, {site.address.state} {site.address.postalCode}</span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon width={17} height={17} className="mt-0.5 shrink-0 text-accent-300" />
              <a href={telLink()} className="hover:text-white">{site.phoneDisplay}</a>
            </li>
            <li className="flex gap-3">
              <MailIcon width={17} height={17} className="mt-0.5 shrink-0 text-accent-300" />
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">Showroom hours</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-200/85">
            {site.hours.map((h) => (
              <li key={h.days} className="flex gap-3">
                <ClockIcon width={17} height={17} className="mt-0.5 shrink-0 text-accent-300" />
                <span>{h.days}<br /><span className="text-brand-300/70">{h.time}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-brand-300/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>
            Prices and availability shown are indicative — please call the showroom to confirm.{" "}
            <Link href="/admin" className="underline-offset-2 hover:text-white hover:underline">Owner login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
