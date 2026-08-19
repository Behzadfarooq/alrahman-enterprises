export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number | null | undefined) {
  if (value == null) return null;
  return inr.format(value);
}

export function discountPercent(price?: number | null, mrp?: number | null) {
  if (!price || !mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}
