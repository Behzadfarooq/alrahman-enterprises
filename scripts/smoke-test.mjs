/**
 * HTTP smoke test: auth gating, upload API, public pages and SEO output.
 *
 * Requires the app running on port 3411:
 *   npx next build && npx next start -p 3411
 *   pnpm test:smoke
 */
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import sharp from "sharp";


const BASE = "http://localhost:3411";
const prisma = new PrismaClient();
const results = [];
const check = (name, pass, extra = "") => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
  return pass;
};

// 1. Credential verification uses real bcrypt hashes
const admin = await prisma.adminUser.findFirst();
check("admin account exists", Boolean(admin), admin?.email);
check("password is hashed with bcrypt", admin.passwordHash.startsWith("$2"));
check("seeded password verifies", await bcrypt.compare(process.env.ADMIN_PASSWORD, admin.passwordHash));
check("wrong password rejected", !(await bcrypt.compare("wrong-password", admin.passwordHash)));

// 2. Unauthenticated access is blocked
const noAuth = await fetch(`${BASE}/admin/products`, { redirect: "manual" });
check("admin route redirects when signed out", noAuth.status === 307, `got ${noAuth.status}`);
const uploadNoAuth = await fetch(`${BASE}/api/admin/upload`, { method: "POST", body: new FormData() });
check("upload API rejects anonymous", uploadNoAuth.status === 401, `got ${uploadNoAuth.status}`);

// 3. A forged cookie must not work
const forged = await new SignJWT({ email: "x@x.com" })
  .setProtectedHeader({ alg: "HS256" }).setSubject("fake").setExpirationTime("1h")
  .sign(new TextEncoder().encode("a-completely-different-secret-value-000000"));
const forgedRes = await fetch(`${BASE}/admin/products`, {
  headers: { cookie: `arre_session=${forged}` }, redirect: "manual",
});
check("forged session cookie rejected", forgedRes.status === 307, `got ${forgedRes.status}`);

// 4. A valid session gets in
const token = await new SignJWT({ email: admin.email })
  .setProtectedHeader({ alg: "HS256" }).setSubject(admin.id).setIssuedAt().setExpirationTime("1h")
  .sign(new TextEncoder().encode(process.env.SESSION_SECRET));
const cookie = `arre_session=${token}`;
for (const path of ["/admin/dashboard", "/admin/products", "/admin/products/new", "/admin/brands", "/admin/categories"]) {
  const r = await fetch(`${BASE}${path}`, { headers: { cookie } });
  check(`signed-in GET ${path}`, r.status === 200, `got ${r.status}`);
}

// 5. Real image upload through the API (sharp + storage driver)
const png = await sharp({ create: { width: 1400, height: 900, channels: 3, background: "#2f7d81" } })
  .png().toBuffer();
const fd = new FormData();
fd.append("files", new File([png], "test-photo.png", { type: "image/png" }));
const up = await fetch(`${BASE}/api/admin/upload`, { method: "POST", headers: { cookie }, body: fd });
const upJson = await up.json();
check("authenticated image upload", up.ok && Array.isArray(upJson.urls), JSON.stringify(upJson).slice(0, 120));
if (upJson.urls?.[0]) {
  const img = await fetch(`${BASE}${upJson.urls[0]}`);
  const type = img.headers.get("content-type");
  check("uploaded image is served", img.ok, `${upJson.urls[0]} (${type})`);
  check("upload converted to webp", upJson.urls[0].endsWith(".webp"));
}

// 6. Bad file type is rejected with a useful message
const badFd = new FormData();
badFd.append("files", new File([Buffer.from("not an image")], "notes.txt", { type: "text/plain" }));
const bad = await fetch(`${BASE}/api/admin/upload`, { method: "POST", headers: { cookie }, body: badFd });
const badJson = await bad.json();
check("non-image upload rejected", bad.status === 400 && Boolean(badJson.error), badJson.error);

// 7. Public pages reflect database content
const home = await fetch(`${BASE}/`).then((r) => r.text());
check("homepage renders featured product", home.includes("Haier 108 cm"));
check("homepage renders phone number", home.includes("70065 09625"));
check("homepage has LocalBusiness schema", home.includes("ElectronicsStore"));
const detail = await fetch(`${BASE}/products/haier-108-cm-43-inch-4k-smart-led-tv-le43k7000ga`);
const detailHtml = await detail.text();
check("product detail page loads", detail.status === 200, `got ${detail.status}`);
check("product page has Product schema", detailHtml.includes('"@type":"Product"'));
check("product page has WhatsApp enquiry link", detailHtml.includes("wa.me/917006509625"));
const filtered = await fetch(`${BASE}/products?brand=voltas`).then((r) => r.text());
check("brand filter excludes other brands", filtered.includes("Voltas") && !filtered.includes("Haier 108 cm"));
const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
check("sitemap lists product URLs", (sitemap.match(/<url>/g) || []).length >= 15);
const robots = await fetch(`${BASE}/robots.txt`).then((r) => r.text());
check("robots blocks /admin", robots.includes("/admin"));

console.log(results.join("\n"));
const failed = results.filter((r) => r.startsWith("FAIL")).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
await prisma.$disconnect();
process.exit(failed ? 1 : 0);
