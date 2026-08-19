import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui";
import { discountPercent, formatPrice } from "@/lib/utils";
import type { ProductCard as ProductCardData } from "@/lib/queries";

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const price = formatPrice(product.priceInr);
  const off = discountPercent(product.priceInr, product.mrpInr);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-50/60">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-brand-400">
            No image yet
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off !== null && <Badge tone="accent">{off}% off</Badge>}
          {product.isFeatured && <Badge tone="neutral">Featured</Badge>}
        </div>
        {!product.inStock && (
          <div className="absolute right-3 top-3">
            <Badge tone="danger">Out of stock</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-500">
          {product.brand?.name ?? "Unbranded"}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-display text-sm font-bold leading-snug text-brand-950 sm:text-[15px]">
          {product.name}
        </h3>
        {product.modelNumber && (
          <p className="mt-1 text-xs text-brand-500">Model {product.modelNumber}</p>
        )}

        <div className="mt-auto pt-3.5">
          {price ? (
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-extrabold text-brand-900">{price}</span>
              {product.mrpInr && product.mrpInr > (product.priceInr ?? 0) && (
                <span className="text-xs text-brand-400 line-through">{formatPrice(product.mrpInr)}</span>
              )}
            </div>
          ) : (
            <span className="text-sm font-semibold text-brand-700">Price on enquiry</span>
          )}
          {product.promoText && (
            <p className="mt-1.5 line-clamp-1 text-xs font-medium text-accent-700">{product.promoText}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
