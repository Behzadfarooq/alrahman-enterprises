import "server-only";
import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

export const productCard = {
  include: {
    brand: { select: { name: true, slug: true } },
    category: { select: { name: true, slug: true } },
    images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
  },
} satisfies Prisma.ProductDefaultArgs;

export type ProductCard = Prisma.ProductGetPayload<typeof productCard>;

export type ProductFilters = {
  q?: string;
  brand?: string;
  category?: string;
  stock?: string;
  sort?: string;
};

function orderFor(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ priceInr: "asc" }, { name: "asc" }];
    case "price-desc":
      return [{ priceInr: "desc" }, { name: "asc" }];
    case "name":
      return [{ name: "asc" }];
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }
}

export function buildProductWhere(f: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isPublished: true };
  if (f.brand) where.brand = { slug: f.brand };
  if (f.category) where.category = { slug: f.category };
  if (f.stock === "in") where.inStock = true;
  if (f.q) {
    const q = f.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { modelNumber: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  return where;
}

export const PAGE_SIZE = 12;

export async function listProducts(filters: ProductFilters, page = 1) {
  const where = buildProductWhere(filters);
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      ...productCard,
      orderBy: orderFor(filters.sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);
  return { items, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    ...productCard,
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export function getBrands() {
  return prisma.brand.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: { where: { isPublished: true } } } } },
  });
}

export function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: { where: { isPublished: true } } } } },
  });
}
