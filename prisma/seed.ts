/**
 * Seeds the admin account plus a realistic starter catalogue.
 * Safe to re-run: everything is upserted by slug/email.
 * Every record here can be edited or deleted from the admin dashboard.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const categories = [
  { name: "Refrigerators", image: "refrigerator", description: "Single door, double door and side-by-side refrigerators for every family size." },
  { name: "Air Conditioners", image: "air-conditioner", description: "Split and window ACs with inverter technology, sized for Kashmir summers." },
  { name: "Washing Machines", image: "washing-machine", description: "Semi-automatic, fully automatic top load and front load washers." },
  { name: "Televisions", image: "television", description: "HD, Full HD, 4K and smart LED televisions in every screen size." },
  { name: "Kitchen Appliances", image: "microwave", description: "Microwave ovens, water purifiers, mixers and everyday kitchen essentials." },
  { name: "Home Appliances", image: "appliance", description: "Water heaters, air coolers, fans and other appliances for the home." },
];

const brands = [
  { name: "Voltas", about: "A Tata enterprise and India's leading air conditioning brand, also known for refrigerators and washing machines under Voltas Beko." },
  { name: "Haier", about: "The world's largest home appliance maker, known for reliable refrigerators, washing machines and televisions." },
];

type Seed = {
  name: string; brand: string; category: string; model: string; image: string;
  price?: number; mrp?: number; promo?: string; featured?: boolean; inStock?: boolean;
  description: string; specs: Array<{ label: string; value: string }>;
};

const products: Seed[] = [
  {
    name: "Voltas 1.5 Ton 3 Star Inverter Split AC", brand: "Voltas", category: "Air Conditioners",
    model: "185V Vectra Prism", image: "air-conditioner", price: 34990, mrp: 46990,
    promo: "Free standard installation this season", featured: true,
    description: "A 1.5 ton inverter split air conditioner suited to rooms up to 150 sq ft. The adjustable inverter compressor holds the set temperature while drawing less power, and the turbo mode cools the room quickly on the hottest afternoons.",
    specs: [
      { label: "Capacity", value: "1.5 Ton" }, { label: "Star Rating", value: "3 Star (2023)" },
      { label: "Compressor", value: "Inverter, copper" }, { label: "Suitable For", value: "Rooms up to 150 sq ft" },
      { label: "Warranty", value: "1 year product, 10 years compressor" },
    ],
  },
  {
    name: "Voltas 1 Ton 3 Star Fixed Speed Window AC", brand: "Voltas", category: "Air Conditioners",
    model: "123 LZF", image: "air-conditioner", price: 26490, mrp: 32990, featured: false,
    description: "A dependable 1 ton window air conditioner with a copper condenser and washable anti-dust filter. Straightforward to install in a standard window opening and easy to service locally.",
    specs: [
      { label: "Capacity", value: "1 Ton" }, { label: "Star Rating", value: "3 Star" },
      { label: "Type", value: "Window" }, { label: "Condenser", value: "100% copper" },
      { label: "Warranty", value: "1 year product, 5 years compressor" },
    ],
  },
  {
    name: "Voltas Beko 250 L Frost Free Double Door Refrigerator", brand: "Voltas", category: "Refrigerators",
    model: "RFF265D", image: "refrigerator", price: 27990, mrp: 34500,
    description: "A 250 litre frost free double door refrigerator built for a family of three to four. Neo Frost dual cooling keeps the freezer and fresh food compartments separate so vegetables stay crisp and odours do not travel.",
    specs: [
      { label: "Capacity", value: "250 Litres" }, { label: "Type", value: "Double door, frost free" },
      { label: "Star Rating", value: "2 Star" }, { label: "Shelves", value: "Toughened glass" },
      { label: "Warranty", value: "1 year product, 10 years compressor" },
    ],
  },
  {
    name: "Voltas Beko 8 kg Semi Automatic Washing Machine", brand: "Voltas", category: "Washing Machines",
    model: "WTT80DGRG", image: "washing-machine", price: 13490, mrp: 17990,
    description: "An 8 kg semi automatic twin tub washing machine with a powerful wash motor and a separate spin tub. Uses less water than a fully automatic machine and works well where the water supply is irregular.",
    specs: [
      { label: "Capacity", value: "8 kg" }, { label: "Type", value: "Semi automatic, top load" },
      { label: "Spin Speed", value: "1350 RPM" }, { label: "Body", value: "Rust proof plastic" },
      { label: "Warranty", value: "2 years product, 5 years motor" },
    ],
  },
  {
    name: "Haier 190 L Single Door Refrigerator", brand: "Haier", category: "Refrigerators",
    model: "HED-191TS", image: "refrigerator", price: 15990, mrp: 20500, featured: true,
    description: "A compact 190 litre direct cool single door refrigerator with a toughened glass shelf and a large vegetable box. The 1 hour icing technology and stabiliser free operation from 135V to 290V suit areas with fluctuating voltage.",
    specs: [
      { label: "Capacity", value: "190 Litres" }, { label: "Type", value: "Single door, direct cool" },
      { label: "Star Rating", value: "4 Star" }, { label: "Special", value: "Stabiliser free operation" },
      { label: "Warranty", value: "1 year product, 10 years compressor" },
    ],
  },
  {
    name: "Haier 7 kg Fully Automatic Top Load Washing Machine", brand: "Haier", category: "Washing Machines",
    model: "HWM70-AE", image: "washing-machine", price: 16990, mrp: 21990, featured: true,
    promo: "Free demo and installation at home",
    description: "A 7 kg fully automatic top load washing machine with eight wash programmes and Oceanus wave drum that is gentle on fabric. Near zero pressure inlet means it fills even when the water pressure is low.",
    specs: [
      { label: "Capacity", value: "7 kg" }, { label: "Type", value: "Fully automatic, top load" },
      { label: "Programmes", value: "8 wash programmes" }, { label: "Spin Speed", value: "740 RPM" },
      { label: "Warranty", value: "2 years product, 10 years motor" },
    ],
  },
  {
    name: "Haier 108 cm (43 inch) 4K Smart LED TV", brand: "Haier", category: "Televisions",
    model: "LE43K7000GA", image: "television", price: 24990, mrp: 39990, featured: true,
    description: "A 43 inch 4K Ultra HD smart television with Google TV, hands free voice search and 30W speakers. Three HDMI ports make it easy to connect a set top box, a soundbar and a game console at the same time.",
    specs: [
      { label: "Screen Size", value: "108 cm (43 inch)" }, { label: "Resolution", value: "4K Ultra HD, 3840 x 2160" },
      { label: "Smart OS", value: "Google TV" }, { label: "Sound", value: "30W output, Dolby Audio" },
      { label: "Connectivity", value: "3 x HDMI, 2 x USB, Wi-Fi" }, { label: "Warranty", value: "1 year comprehensive" },
    ],
  },
  {
    name: "Haier 80 cm (32 inch) HD Ready Smart LED TV", brand: "Haier", category: "Televisions",
    model: "LE32A6500GA", image: "television", price: 13490, mrp: 18990,
    description: "A 32 inch HD Ready smart LED television that fits comfortably in a bedroom or a shop counter. Runs popular streaming apps over Wi-Fi and includes a bezel-less display.",
    specs: [
      { label: "Screen Size", value: "80 cm (32 inch)" }, { label: "Resolution", value: "HD Ready, 1366 x 768" },
      { label: "Smart OS", value: "Android based" }, { label: "Sound", value: "20W output" },
      { label: "Warranty", value: "1 year comprehensive" },
    ],
  },
  {
    name: "Haier 1.5 Ton 5 Star Inverter Split AC", brand: "Haier", category: "Air Conditioners",
    model: "HSU19K-PYFR5BN", image: "air-conditioner", price: 41990, mrp: 55990,
    description: "A 5 star rated 1.5 ton inverter split AC with self cleaning and a 7-in-1 convertible mode that lets you run the unit at lower capacity when the room is only partly occupied.",
    specs: [
      { label: "Capacity", value: "1.5 Ton" }, { label: "Star Rating", value: "5 Star" },
      { label: "Convertible", value: "7-in-1 modes" }, { label: "Condenser", value: "100% copper" },
      { label: "Warranty", value: "1 year product, 10 years compressor" },
    ],
  },
  {
    name: "Voltas Beko 20 L Solo Microwave Oven", brand: "Voltas", category: "Kitchen Appliances",
    model: "MS20SD", image: "microwave", price: 6490, mrp: 8990,
    description: "A 20 litre solo microwave oven for reheating, defrosting and everyday cooking. Simple mechanical dials make it easy to use for all age groups.",
    specs: [
      { label: "Capacity", value: "20 Litres" }, { label: "Type", value: "Solo" },
      { label: "Power", value: "700 W" }, { label: "Controls", value: "Mechanical dial" },
      { label: "Warranty", value: "1 year" },
    ],
  },
  {
    name: "Haier 25 L Water Heater", brand: "Haier", category: "Home Appliances",
    model: "ES25V-D1", image: "appliance", price: 9490, mrp: 12990, inStock: false,
    description: "A 25 litre storage water heater with a glass lined tank and adjustable thermostat, sized for bathroom use through the Kashmir winter. Currently out of stock — call the showroom for the next delivery date.",
    specs: [
      { label: "Capacity", value: "25 Litres" }, { label: "Type", value: "Storage, vertical" },
      { label: "Pressure", value: "8 bar" }, { label: "Warranty", value: "2 years product, 5 years tank" },
    ],
  },
  {
    name: "Voltas 50 L Personal Air Cooler", brand: "Voltas", category: "Home Appliances",
    model: "VN-P50MH", image: "appliance", mrp: 11490,
    description: "A 50 litre personal air cooler with honeycomb pads and a high air throw. Price on enquiry — call the showroom for today's best rate.",
    specs: [
      { label: "Tank Capacity", value: "50 Litres" }, { label: "Air Throw", value: "Up to 40 ft" },
      { label: "Pads", value: "Honeycomb" }, { label: "Warranty", value: "1 year" },
    ],
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "owner@alrahmanenterprises.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 12), name: "Store Owner" },
  });
  console.log(`Admin account ready: ${email}`);

  const categoryIds = new Map<string, string>();
  for (const [i, c] of categories.entries()) {
    const row = await prisma.category.upsert({
      where: { slug: slugify(c.name) },
      update: { description: c.description, imageUrl: `/seed/${c.image}.svg`, sortOrder: i },
      create: { name: c.name, slug: slugify(c.name), description: c.description, imageUrl: `/seed/${c.image}.svg`, sortOrder: i },
    });
    categoryIds.set(c.name, row.id);
  }

  const brandIds = new Map<string, string>();
  for (const [i, b] of brands.entries()) {
    const row = await prisma.brand.upsert({
      where: { slug: slugify(b.name) },
      update: { about: b.about, sortOrder: i },
      create: { name: b.name, slug: slugify(b.name), about: b.about, sortOrder: i },
    });
    brandIds.set(b.name, row.id);
  }

  for (const p of products) {
    const slug = slugify(`${p.name} ${p.model}`);
    const data = {
      name: p.name,
      modelNumber: p.model,
      description: p.description,
      specs: p.specs,
      priceInr: p.price ?? null,
      mrpInr: p.mrp ?? null,
      promoText: p.promo ?? null,
      inStock: p.inStock ?? true,
      isFeatured: p.featured ?? false,
      isPublished: true,
      brandId: brandIds.get(p.brand)!,
      categoryId: categoryIds.get(p.category)!,
    };
    const product = await prisma.product.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug },
    });
    const url = `/seed/${p.image}.svg`;
    const existing = await prisma.productImage.findFirst({ where: { productId: product.id } });
    if (!existing) {
      await prisma.productImage.create({
        data: { productId: product.id, url, alt: p.name, sortOrder: 0 },
      });
    }
  }
  console.log(`Seeded ${categories.length} categories, ${brands.length} brands, ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
