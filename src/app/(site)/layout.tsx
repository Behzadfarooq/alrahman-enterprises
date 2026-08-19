import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileContactBar } from "@/components/MobileContactBar";
import { getCategories } from "@/lib/queries";
import { site } from "@/lib/site";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  name: site.name,
  description: site.description,
  telephone: site.phoneE164,
  email: site.email,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.mapsUrl,
  priceRange: "₹₹",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <>
      {/* Plain <script> so the structured data is in the server-rendered HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="min-h-[60vh] pb-20 sm:pb-0">
        {children}
      </main>
      <Footer categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} />
      <MobileContactBar />
    </>
  );
}
