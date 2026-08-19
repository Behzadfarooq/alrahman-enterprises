"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireSession, verifyCredentials } from "@/lib/auth";
import { deleteImage } from "@/lib/storage";
import { brandSchema, categorySchema, fieldErrors, loginSchema, productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

/** Refresh every public surface that can show product data. */
function revalidatePublic() {
  revalidatePath("/", "layout");
}

async function uniqueSlug(
  base: string,
  model: "product" | "brand" | "category",
  ignoreId?: string,
) {
  const root = slugify(base) || "item";
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    // @ts-expect-error — the three delegates share this query shape.
    const existing = await prisma[model].findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === ignoreId) return candidate;
  }
  return `${root}-${Date.now()}`;
}

const NEW_OPTION = "__new__";

/**
 * The product form lets the owner type a brand/category name instead of picking one.
 * Creates it on the fly and returns the id to store on the product.
 */
async function resolveRelation(
  formData: FormData,
  model: "brand" | "category",
  selectField: string,
  nameField: string,
): Promise<{ id: string | null; error?: string }> {
  const selected = String(formData.get(selectField) ?? "");
  if (selected !== NEW_OPTION) return { id: selected || null };

  const name = String(formData.get(nameField) ?? "").trim();
  if (!name) return { id: null, error: `Enter a name for the new ${model}.` };

  const where = { name: { equals: name, mode: "insensitive" as const } };
  const existing =
    model === "brand"
      ? await prisma.brand.findFirst({ where, select: { id: true } })
      : await prisma.category.findFirst({ where, select: { id: true } });
  if (existing) return { id: existing.id };

  const data = { name, slug: await uniqueSlug(name, model) };
  const created =
    model === "brand"
      ? await prisma.brand.create({ data, select: { id: true } })
      : await prisma.category.create({ data, select: { id: true } });
  return { id: created.id };
}

/* ------------------------------------------------------------------ auth */

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { message: "Incorrect email or password. Please try again." };

  await createSession(user);
  const next = String(formData.get("next") || "");
  redirect(next.startsWith("/admin") ? next : "/admin/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* -------------------------------------------------------------- products */

const imagesSchema = z
  .array(z.object({ url: z.string().min(1), alt: z.string().optional() }))
  .max(10);

function readProductForm(formData: FormData) {
  const specLabels = formData.getAll("specLabel").map(String);
  const specValues = formData.getAll("specValue").map(String);
  const specs = specLabels
    .map((label, i) => ({ label: label.trim(), value: (specValues[i] ?? "").trim() }))
    .filter((s) => s.label && s.value);

  return productSchema.safeParse({
    name: formData.get("name") ?? "",
    brandId: formData.get("brandId") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    modelNumber: formData.get("modelNumber") ?? "",
    description: formData.get("description") ?? "",
    promoText: formData.get("promoText") ?? "",
    priceInr: formData.get("priceInr") ?? "",
    mrpInr: formData.get("mrpInr") ?? "",
    inStock: formData.get("inStock") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
    specs,
  });
}

function readImages(formData: FormData) {
  try {
    const raw = String(formData.get("images") ?? "[]");
    return imagesSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const brand = await resolveRelation(formData, "brand", "brandId", "newBrandName");
  const category = await resolveRelation(formData, "category", "categoryId", "newCategoryName");
  if (brand.error || category.error) {
    return {
      errors: {
        ...(brand.error ? { newBrandName: brand.error } : {}),
        ...(category.error ? { newCategoryName: category.error } : {}),
      },
      message: "Please fix the highlighted fields.",
    };
  }
  formData.set("brandId", brand.id ?? "");
  formData.set("categoryId", category.id ?? "");

  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  }
  const data = parsed.data;
  const images = readImages(formData);
  const id = String(formData.get("id") ?? "");

  const brandName = data.brandId
    ? (await prisma.brand.findUnique({ where: { id: data.brandId }, select: { name: true } }))?.name
    : undefined;

  let productId = id;

  if (id) {
    const slug = await uniqueSlug(`${data.name} ${data.modelNumber ?? ""}`.trim(), "product", id);
    await prisma.product.update({ where: { id }, data: { ...data, slug } });

    // Replace the image set, cleaning up files that are no longer referenced.
    const previous = await prisma.productImage.findMany({ where: { productId: id } });
    const keptUrls = new Set(images.map((i) => i.url));
    await prisma.productImage.deleteMany({ where: { productId: id } });
    for (const old of previous) {
      if (!keptUrls.has(old.url)) await deleteImage(old.url);
    }
  } else {
    const slug = await uniqueSlug(`${data.name} ${data.modelNumber ?? ""}`.trim(), "product");
    const created = await prisma.product.create({ data: { ...data, slug } });
    productId = created.id;
  }

  if (images.length > 0) {
    await prisma.productImage.createMany({
      data: images.map((img, i) => ({
        productId,
        url: img.url,
        alt: img.alt || `${data.name}${brandName ? ` by ${brandName}` : ""}`,
        sortOrder: i,
      })),
    });
  }

  revalidatePublic();
  redirect(`/admin/products?saved=${encodeURIComponent(data.name)}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const images = await prisma.productImage.findMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  for (const img of images) await deleteImage(img.url);

  revalidatePublic();
  revalidatePath("/admin/products");
}

export async function toggleStockAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id }, select: { inStock: true } });
  if (!product) return;

  await prisma.product.update({ where: { id }, data: { inStock: !product.inStock } });
  revalidatePublic();
  revalidatePath("/admin/products");
}

export async function toggleFeaturedAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id }, select: { isFeatured: true } });
  if (!product) return;

  await prisma.product.update({ where: { id }, data: { isFeatured: !product.isFeatured } });
  revalidatePublic();
  revalidatePath("/admin/products");
}

/* ---------------------------------------------------------------- brands */

export async function saveBrandAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = brandSchema.safeParse({
    name: formData.get("name") ?? "",
    about: formData.get("about") ?? "",
    sortOrder: formData.get("sortOrder") || 0,
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const id = String(formData.get("id") ?? "");
  const duplicate = await prisma.brand.findFirst({
    where: { name: { equals: parsed.data.name, mode: "insensitive" }, NOT: id ? { id } : undefined },
  });
  if (duplicate) return { errors: { name: "A brand with this name already exists." } };

  const slug = await uniqueSlug(parsed.data.name, "brand", id || undefined);
  if (id) await prisma.brand.update({ where: { id }, data: { ...parsed.data, slug } });
  else await prisma.brand.create({ data: { ...parsed.data, slug } });

  revalidatePublic();
  revalidatePath("/admin/brands");
  return { ok: true, message: id ? "Brand updated." : `"${parsed.data.name}" added.` };
}

export async function deleteBrandAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  // Products keep existing; their brand becomes empty (onDelete: SetNull).
  await prisma.brand.delete({ where: { id } });
  revalidatePublic();
  revalidatePath("/admin/brands");
}

/* ------------------------------------------------------------ categories */

export async function saveCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();
  const parsed = categorySchema.safeParse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? "",
    sortOrder: formData.get("sortOrder") || 0,
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const id = String(formData.get("id") ?? "");
  const duplicate = await prisma.category.findFirst({
    where: { name: { equals: parsed.data.name, mode: "insensitive" }, NOT: id ? { id } : undefined },
  });
  if (duplicate) return { errors: { name: "A category with this name already exists." } };

  const slug = await uniqueSlug(parsed.data.name, "category", id || undefined);
  const imageUrl = String(formData.get("imageUrl") ?? "") || null;

  if (id) {
    await prisma.category.update({
      where: { id },
      data: { ...parsed.data, slug, ...(imageUrl ? { imageUrl } : {}) },
    });
  } else {
    await prisma.category.create({ data: { ...parsed.data, slug, imageUrl } });
  }

  revalidatePublic();
  revalidatePath("/admin/categories");
  return { ok: true, message: id ? "Category updated." : `"${parsed.data.name}" added.` };
}

export async function deleteCategoryAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidatePublic();
  revalidatePath("/admin/categories");
}
