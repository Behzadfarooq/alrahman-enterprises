# Al Rahman Enterprises — Website & Admin Dashboard

Online product catalogue for **Al Rahman Enterprises**, an electronics and home
appliance showroom at Sadiqabad, KP Road, Anantnag, Jammu & Kashmir.

The public site lists everything in the showroom. The owner manages products,
brands, categories, photos and stock from a password-protected admin dashboard —
no developer needed for day-to-day updates.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Running it locally](#running-it-locally)
3. [Using the admin dashboard](#using-the-admin-dashboard)
4. [Project structure](#project-structure)
5. [Deploying to production](#deploying-to-production)
6. [Environment variables](#environment-variables)
7. [Business details to update](#business-details-to-update)
8. [Tests](#tests)

---

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript | Fast, great SEO, one codebase for site + admin |
| Styling | Tailwind CSS v4 | Small CSS output, consistent design tokens |
| Database | PostgreSQL via Prisma ORM | Free tier on Supabase/Neon, easy migrations |
| Image storage | Supabase Storage (local disk in dev) | Free tier, survives redeploys |
| Auth | Signed JWT session cookie + bcrypt | One owner account, no third-party dependency |
| Image processing | sharp | Uploads are auto-resized and converted to WebP |
| Hosting | Vercel | Free hobby tier, zero-config deploys |

---

## Running it locally

**Requirements:** Node.js 22 (see `.nvmrc`) and pnpm.

```bash
nvm use              # picks up Node 22 from .nvmrc
pnpm install
```

### 1. Start a database

For local development the quickest option is Prisma's bundled Postgres:

```bash
npx prisma dev -n alrahman -d      # prints a connection string
```

Copy that URL into `DATABASE_URL` in `.env` (keep `&pgbouncer=true&connection_limit=1`
on the end — it is required for pooled connections).

Alternatively point `DATABASE_URL` at any Postgres database, including your
Supabase one.

### 2. Set up `.env`

```bash
cp .env.example .env
```

Then fill in `DATABASE_URL`, and set `SESSION_SECRET` to a long random string:

```bash
openssl rand -base64 32
```

### 3. Create the tables and sample data

```bash
pnpm db:migrate      # creates the tables
pnpm db:seed         # creates the admin account + sample catalogue
```

The seed reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env` and creates that
login. Sample Voltas and Haier products are added so the site looks complete —
all of them can be edited or deleted from the dashboard.

### 4. Run it

```bash
pnpm dev
```

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

---

## Using the admin dashboard

Sign in at `/admin` with the email and password from the seed step.

| Page | What you can do |
| --- | --- |
| **Overview** | Counts of products, stock and brands; warnings about products with no photo |
| **Products** | Search, add, edit, delete; one-click In stock / Featured toggles |
| **Add / Edit product** | Name, brand, category, model number, description, specifications, price, MRP, offer text, photos, and visibility switches |
| **Brands** | Add, edit, delete brands (Voltas and Haier are seeded, nothing is hard-coded) |
| **Categories** | Add, edit, delete categories |

Notes for whoever maintains the store:

- **Photos** — drag files onto the upload box or click *Upload images*. The first
  photo is the main one; use the arrows to reorder, the bin icon to remove.
  Images are automatically resized and converted to WebP, so large phone photos
  are fine.
- **Price** — leave it empty to show *"Price on enquiry"* on the website.
- **Feature on homepage** — puts the product in the homepage *Featured* row.
- **Show on website** — untick to hide a product without deleting it.
- Deleting a brand or category never deletes its products; they simply lose that
  label.
- Every change appears on the public site immediately.

---

## Project structure

```
prisma/
  schema.prisma          Database models (Product, Brand, Category, images, admin user)
  seed.ts                Admin account + sample catalogue
src/
  app/
    (site)/              Public website (home, products, brands, categories, contact)
    admin/
      actions.ts         All admin server actions (create/update/delete + auth)
      login/             Owner login screen
      (dash)/            Protected dashboard pages
    api/admin/upload/    Image upload endpoint (auth-protected)
    uploads/[...path]/   Serves locally-stored images in development
    sitemap.ts robots.ts SEO routes
  components/            Shared UI, plus components/admin/* for the dashboard
  lib/
    site.ts              ALL business details — phone, address, hours, email
    auth.ts              Session cookie + password hashing
    storage.ts           Image processing and storage drivers
    queries.ts           Product/brand/category queries used by the site
    validation.ts        Zod form schemas
  middleware.ts          Blocks /admin/* without a valid session
```

---

## Deploying to production

Recommended setup — **Vercel (free) + Supabase (free)**. Expected cost: ₹0/month
plus the domain (roughly ₹700–₹1,200/year).

### Step 1 — Create the Supabase project (database + image storage)

1. Sign up at <https://supabase.com> and create a project. Pick the
   **Mumbai (ap-south-1)** region for the best speed in India.
2. **Project Settings → Database → Connection string → URI**. Copy the
   **Transaction pooler** URI (port 6543) and append
   `?sslmode=require&pgbouncer=true&connection_limit=1`. This is `DATABASE_URL`.
3. **Storage → New bucket** → name it `product-images` and tick **Public bucket**.
4. **Project Settings → API** → copy the **Project URL** (`SUPABASE_URL`) and the
   **service_role** key (`SUPABASE_SERVICE_ROLE_KEY`). Keep the service_role key
   secret — it is only ever used on the server.

### Step 2 — Push the schema and create the owner account

From your computer, with `DATABASE_URL` pointing at Supabase:

```bash
pnpm db:deploy       # creates the tables in Supabase
pnpm db:seed         # creates the admin login + sample products
```

Set a strong `ADMIN_PASSWORD` in `.env` before seeding — that is the password the
owner will use.

### Step 3 — Deploy to Vercel

1. Push this project to a GitHub repository.
2. At <https://vercel.com> → **Add New → Project** → import that repository.
   Vercel detects Next.js automatically; no build settings need changing.
3. Add these **Environment Variables** (Production *and* Preview):

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | the Supabase pooler URI from step 1 |
   | `SESSION_SECRET` | output of `openssl rand -base64 32` |
   | `STORAGE_DRIVER` | `supabase` |
   | `SUPABASE_URL` | Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
   | `SUPABASE_BUCKET` | `product-images` |
   | `NEXT_PUBLIC_SITE_URL` | your final domain, e.g. `https://alrahmanenterprises.com` |

   `STORAGE_DRIVER` **must** be `supabase` on Vercel — uploads deliberately fail
   with a clear message otherwise, because Vercel's filesystem is read-only and
   photos would be lost. Locally, `local` writes to `public/uploads`.

4. Click **Deploy**.

### Step 4 — Connect the domain

In Vercel → **Project → Settings → Domains**, add the domain and follow the DNS
instructions shown (usually an `A` record to `76.76.21.21` and a `CNAME` for
`www`). Then set `NEXT_PUBLIC_SITE_URL` to that domain and redeploy so the
sitemap and social previews use the right address.

### Ongoing

Every push to the `main` branch redeploys automatically. Database changes go out
with `pnpm db:deploy`.

---

### A note on `connection_limit`

The pooled `DATABASE_URL` must allow more than one connection, e.g.
`?sslmode=require&pgbouncer=true&connection_limit=5&pool_timeout=30`.
`connection_limit=1` looks right for serverless, but `next build` prerenders
pages in parallel workers and will fail with *"Timed out fetching a new
connection from the connection pool"* against a remote database.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `SESSION_SECRET` | yes | ≥32 characters; signs the admin session cookie |
| `STORAGE_DRIVER` | yes | `local` in development, `supabase` in production |
| `SUPABASE_URL` | in production | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | in production | Server-side Supabase key |
| `SUPABASE_BUCKET` | in production | Storage bucket name (`product-images`) |
| `NEXT_PUBLIC_SITE_URL` | yes | Public site URL, used for SEO and sitemap |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seeding only | Used once by `pnpm db:seed` |

---

## Business details to update

All business information lives in **`src/lib/site.ts`**. Placeholders currently in
place, to be replaced when confirmed:

- **Email** — `contact@alrahmanenterprises.com` is a placeholder.
- **Showroom hours** — Mon–Sat 10:00–20:00, Sun 10:00–14:00 are placeholders.
- **Postal code** — 192101 is the general Anantnag PIN; confirm the exact one.
- **Map coordinates** — approximate; the Google Maps link is the real one.

Phone (7006509625), address and the Google Maps link are confirmed and live.

---

## Tests

With the app built and running on port 3411:

```bash
npx next build && npx next start -p 3411 &
pnpm test:smoke     # auth gating, upload API, public pages, SEO output
pnpm test:admin     # full browser run through the admin dashboard
```

`test:admin` uses Playwright (`npx playwright install chromium` once) and creates
then deletes its own test records.

<!-- deployed via Netlify continuous deployment -->
