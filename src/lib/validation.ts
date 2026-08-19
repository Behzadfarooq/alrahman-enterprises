import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

/** Rupee amount typed into a form: "" -> null, "24,990" -> 24990 */
const rupees = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v.replace(/[,₹\s]/g, "") : ""))
  .refine((v) => v === "" || /^\d{1,9}$/.test(v), "Enter a whole number in rupees, e.g. 24990")
  .transform((v) => (v === "" ? null : Number(v)));

export const specsSchema = z
  .array(z.object({ label: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(200) }))
  .max(30);

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Product name is required").max(140),
    brandId: z.string().trim().optional().transform((v) => (v ? v : null)),
    categoryId: z.string().trim().optional().transform((v) => (v ? v : null)),
    modelNumber: optionalText(80),
    description: optionalText(4000),
    promoText: optionalText(120),
    priceInr: rupees,
    mrpInr: rupees,
    inStock: z.coerce.boolean(),
    isFeatured: z.coerce.boolean(),
    isPublished: z.coerce.boolean(),
    specs: specsSchema,
  })
  .refine((d) => !(d.priceInr && d.mrpInr) || d.mrpInr >= d.priceInr, {
    message: "MRP cannot be lower than the selling price",
    path: ["mrpInr"],
  });

export const brandSchema = z.object({
  name: z.string().trim().min(1, "Brand name is required").max(60),
  about: optionalText(500),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(60),
  description: optionalText(500),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type SpecList = z.infer<typeof specsSchema>;

/** Flattens Zod issues into { field: message } for rendering next to inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
