/**
 * Single source of truth for Al Rahman Enterprises business information.
 * Values marked PLACEHOLDER are awaiting confirmation from the owner.
 */
export const site = {
  name: "Al Rahman Enterprises",
  shortName: "Al Rahman",
  tagline: "Home appliances & electronics, trusted in Anantnag",
  description:
    "Al Rahman Enterprises on KP Road, Sadiqabad, Anantnag stocks refrigerators, air conditioners, washing machines, televisions and home appliances from brands like Voltas and Haier. Visit the showroom or call for the best price.",

  phone: "7006509625",
  phoneE164: "+917006509625",
  phoneDisplay: "+91 70065 09625",
  whatsapp: "917006509625",

  // PLACEHOLDER — replace once the business email is confirmed.
  email: "contact@alrahmanenterprises.com",
  emailIsPlaceholder: true,

  address: {
    line1: "Sadiqabad, KP Road",
    city: "Anantnag",
    state: "Jammu & Kashmir",
    postalCode: "192101",
    country: "IN",
    full: "Sadiqabad, KP Road, Anantnag, Jammu & Kashmir 192101",
  },

  mapsUrl: "https://maps.app.goo.gl/ED5fMMZ3HJ3Etz919",
  // Coordinates taken from the Google Maps listing above, so the embedded map
  // always pins the showroom itself rather than a name search result.
  geo: { lat: 33.7366534, lng: 75.1546848 },

  // PLACEHOLDER — replace with the real showroom timings.
  hours: [
    { days: "Monday – Saturday", time: "10:00 AM – 8:00 PM" },
    { days: "Sunday", time: "10:00 AM – 2:00 PM" },
  ],
  hoursArePlaceholder: true,

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function waLink(message?: string) {
  const text = message ?? `Hello ${site.name}, I would like to enquire about a product.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function telLink() {
  return `tel:${site.phoneE164}`;
}
