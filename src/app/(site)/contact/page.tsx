import type { Metadata } from "next";
import { AnchorButton, SectionHeading } from "@/components/ui";
import { StoreMap } from "@/components/StoreMap";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { site, telLink, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit Us & Contact",
  description: `Visit ${site.name} at ${site.address.full}. Call ${site.phoneDisplay} or message us on WhatsApp for prices and availability.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        eyebrow="Get in touch"
        title="Visit the showroom in Anantnag"
        description="We are on KP Road in Sadiqabad. Call ahead and we will keep the model you are interested in ready for a demo."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><PhoneIcon /></span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">Call the showroom</p>
                <a href={telLink()} className="mt-1 block font-display text-xl font-extrabold text-brand-800 hover:text-brand-600">
                  {site.phoneDisplay}
                </a>
                <p className="mt-1 text-xs text-brand-600">Fastest way to confirm price and stock.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <AnchorButton href={telLink()}><PhoneIcon width={17} height={17} /> Call now</AnchorButton>
              <AnchorButton href={waLink()} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                <WhatsAppIcon width={17} height={17} /> WhatsApp
              </AnchorButton>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><MapPinIcon /></span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">Showroom address</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-700/85">
                  {site.address.line1}<br />
                  {site.address.city}, {site.address.state} {site.address.postalCode}
                </p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><ClockIcon /></span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">Showroom hours</p>
                <ul className="mt-1 space-y-1 text-sm text-brand-700/85">
                  {site.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-6">
                      <span>{h.days}</span>
                      <span className="font-medium text-brand-900">{h.time}</span>
                    </li>
                  ))}
                </ul>
                {site.hoursArePlaceholder && (
                  <p className="mt-2 text-xs text-brand-500">
                    Timings may vary on public holidays — please call to confirm.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><MailIcon /></span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">Email</p>
                <a href={`mailto:${site.email}`} className="mt-1 block text-sm text-brand-700/85 hover:text-brand-900">
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <StoreMap className="min-h-[520px]" />
      </div>
    </div>
  );
}
