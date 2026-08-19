import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Electronics & Home Appliances in Anantnag`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "electronics shop Anantnag", "home appliances Anantnag", "refrigerator Anantnag",
    "AC dealer Anantnag", "washing machine Kashmir", "Voltas Anantnag", "Haier Anantnag",
    "KP Road Sadiqabad", "Al Rahman Enterprises",
    // Customers search both spellings — keep the variants discoverable.
    "Ar-Rahman Enterprises", "Al Rahman Anantnag", "Al Rahman electronics",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Electronics & Home Appliances in Anantnag`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0f3336",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
