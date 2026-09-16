"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice, calculateDiscount } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string | null }[];
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group relative flex flex-col border rounded-lg overflow-hidden bg-white dark:bg-gray-900 transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
              )}
              {calculateDiscount(product.price, product.compareAtPrice) > 0 && (
                <span className="absolute top-2 left-2 z-10 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                  -{calculateDiscount(product.price, product.compareAtPrice)}%
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-medium line-clamp-2 group-hover:underline">{product.name}</h3>
              <div className="mt-auto flex items-center gap-2">
                <span className="font-semibold">{formatPrice(product.price)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}