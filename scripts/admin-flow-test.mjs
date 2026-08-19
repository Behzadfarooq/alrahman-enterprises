/**
 * Browser test for the admin dashboard: login, brand/category/product CRUD,
 * image upload, stock toggle, validation and mobile layout.
 *
 * Requires the app running on port 3411:
 *   npx next build && npx next start -p 3411
 *   pnpm test:admin
 */
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3411";
const prisma = new PrismaClient();
const out = [];
const check = (n, ok, extra = "") => out.push(`${ok ? "PASS" : "FAIL"}  ${n}${extra ? " — " + extra : ""}`);

const photo = path.join(tmpdir(), "arre-test-product.png");
writeFileSync(photo, await sharp({ create: { width: 1200, height: 1200, channels: 3, background: "#123d40" } }).png().toBuffer());

// Remove leftovers from any previous run so the checks start from a clean slate.
await prisma.product.deleteMany({ where: { name: { startsWith: "Testo Smart Kettle" } } });
await prisma.brand.deleteMany({ where: { name: "Testo Appliances" } });
await prisma.category.deleteMany({ where: { name: "Test Gadgets" } });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", (e) => out.push(`FAIL  browser console error — ${e.message}`));

// --- Login with wrong password
await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', process.env.ADMIN_EMAIL);
await page.fill('input[name="password"]', "definitely-wrong");
await page.click('button[type="submit"]');
await page.waitForTimeout(4000);
check("wrong password shows an error", await page.getByText(/Incorrect email or password/i).isVisible());

// --- Login correctly (fresh page so the failed attempt cannot interfere)
await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', process.env.ADMIN_EMAIL);
await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD);
await page.click('button[type="submit"]');
await page.waitForURL("**/admin/dashboard", { timeout: 15000 });
check("login redirects to dashboard", page.url().includes("/admin/dashboard"));

// --- Create a brand
await page.goto(`${BASE}/admin/brands`);
await page.fill('input[name="name"]', "Testo Appliances");
await page.fill('textarea[name="about"]', "A brand created by the automated check.");
await page.click('button[type="submit"]:has-text("Add brand")');
// Wait for the row to appear rather than guessing a delay (production is remote).
await page.getByText("Testo Appliances").first().waitFor({ timeout: 30000 });
const brandRow = await prisma.brand.findFirst({ where: { name: "Testo Appliances" } });
check("brand created via admin UI", Boolean(brandRow), brandRow?.slug);

// --- Create a category
await page.goto(`${BASE}/admin/categories`);
await page.fill('input[name="name"]', "Test Gadgets");
await page.click('button[type="submit"]:has-text("Add category")');
await page.getByText("Test Gadgets").first().waitFor({ timeout: 30000 });
const catRow = await prisma.category.findFirst({ where: { name: "Test Gadgets" } });
check("category created via admin UI", Boolean(catRow), catRow?.slug);

// --- Create a product with an uploaded image + specs
await page.goto(`${BASE}/admin/products/new`);
await page.fill('input[name="name"]', "Testo Smart Kettle 1.7 L");
await page.selectOption('select[name="brandId"]', { label: "Testo Appliances" });
await page.selectOption('select[name="categoryId"]', { label: "Test Gadgets" });
await page.fill('input[name="modelNumber"]', "TK-1700");
await page.fill('textarea[name="description"]', "An automated-test kettle used to verify the admin dashboard.");
await page.fill('input[name="priceInr"]', "2,499");
await page.fill('input[name="mrpInr"]', "3499");
await page.fill('input[name="promoText"]', "Test offer");
await page.locator('input[name="specLabel"]').first().fill("Capacity");
await page.locator('input[name="specValue"]').first().fill("1.7 Litres");
await page.setInputFiles('input[type="file"]', photo);
await page.waitForSelector('text=MAIN', { timeout: 20000 });
check("uploaded photo preview appears", await page.getByText("MAIN").isVisible());
await page.check('input[name="isFeatured"]');
await page.click('button[type="submit"]:has-text("Add product")');
await page.waitForURL((u) => u.pathname === "/admin/products" && u.searchParams.has("saved"), { timeout: 30000 });
check("save redirects to product list", page.url().includes("saved="));

const created = await prisma.product.findFirst({
  where: { name: "Testo Smart Kettle 1.7 L" },
  include: { images: true, brand: true, category: true },
});
check("product saved to database", Boolean(created));
if (!created) { console.log(out.join("\n")); console.log("URL:", page.url()); console.log((await page.textContent("body")).replace(/\s+/g," ").slice(0,600)); await browser.close(); await prisma.$disconnect(); process.exit(1); }
check("price parsed from '2,499'", created?.priceInr === 2499, String(created?.priceInr));
check("brand linked", created?.brand?.name === "Testo Appliances");
check("category linked", created?.category?.name === "Test Gadgets");
check("spec saved", JSON.stringify(created?.specs).includes("1.7 Litres"));
check("image attached", (created?.images.length ?? 0) === 1, created?.images[0]?.url);
check("featured flag saved", created?.isFeatured === true);

// --- The public site reflects it immediately
const pub = await page.goto(`${BASE}/products/${created.slug}`);
check("new product live on public site", pub.status() === 200, `status ${pub.status()}`);
check("public page shows the price", await page.getByText("₹2,499").first().isVisible());
const homeRes = await page.goto(`${BASE}/`);
check("featured product appears on homepage", (await page.getByText("Testo Smart Kettle").count()) > 0);

// --- Edit it
await page.goto(`${BASE}/admin/products/${created.id}`);
await page.fill('input[name="name"]', "Testo Smart Kettle 2.0 L");
await page.fill('input[name="priceInr"]', "2999");
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForURL((u) => u.pathname === "/admin/products" && u.searchParams.has("saved"), { timeout: 30000 });
const edited = await prisma.product.findUnique({ where: { id: created.id }, include: { images: true } });
check("edit saved name", edited?.name === "Testo Smart Kettle 2.0 L");
check("edit saved price", edited?.priceInr === 2999, String(edited?.priceInr));
check("edit kept the existing image", edited?.images.length === 1);

// --- Stock toggle from the list
await page.goto(`${BASE}/admin/products`);
await page.getByText("Testo Smart Kettle 2.0 L").first().waitFor({ timeout: 15000 });
const row = page.locator("ul > li").filter({ hasText: "Testo Smart Kettle 2.0 L" }).first();
await row.getByRole("button", { name: "In stock", exact: true }).click();
await page.waitForTimeout(6000);
const toggled = await prisma.product.findUnique({ where: { id: created.id } });
check("stock toggle works from the list", toggled?.inStock === false, `inStock=${toggled?.inStock}`);

// --- Validation: empty name is refused
await page.goto(`${BASE}/admin/products/new`);
await page.fill('input[name="name"]', "A");
await page.locator('input[name="name"]').evaluate((el) => el.removeAttribute("required"));
await page.click('button[type="submit"]:has-text("Add product")');
await page.waitForTimeout(5000);
check("short name rejected with a message", await page.getByText(/Product name is required|fix the highlighted/i).first().isVisible());

// --- Delete the product
page.on("dialog", (d) => d.accept());
await page.goto(`${BASE}/admin/products`);
await page.getByText("Testo Smart Kettle 2.0 L").first().waitFor({ timeout: 15000 });
const row2 = page.locator("ul > li").filter({ hasText: "Testo Smart Kettle 2.0 L" }).first();
await row2.getByRole("button", { name: "Delete" }).click();
await page.waitForTimeout(6000);
check("product deleted", !(await prisma.product.findUnique({ where: { id: created.id } })));

// --- Clean up the test taxonomy
await prisma.brand.deleteMany({ where: { name: "Testo Appliances" } });
await prisma.category.deleteMany({ where: { name: "Test Gadgets" } });

// --- Sign out
await page.goto(`${BASE}/admin/dashboard`);
await page.getByRole("button", { name: /Sign out/i }).click();
await page.waitForURL("**/admin/login**", { timeout: 15000 });
check("sign out returns to login", page.url().includes("/admin/login"));

// --- Mobile viewport sanity
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${BASE}/`);
const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("homepage has no horizontal overflow on mobile", overflow <= 1, `${overflow}px`);
check("mobile call bar is visible", await mobile.getByRole("link", { name: /Call 7006509625/i }).isVisible());
await mobile.goto(`${BASE}/products`);
const overflow2 = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("products page has no horizontal overflow on mobile", overflow2 <= 1, `${overflow2}px`);

await browser.close();
console.log(out.join("\n"));
const failed = out.filter((r) => r.startsWith("FAIL")).length;
console.log(`\n${out.length - failed}/${out.length} checks passed`);
await prisma.$disconnect();
process.exit(failed ? 1 : 0);
