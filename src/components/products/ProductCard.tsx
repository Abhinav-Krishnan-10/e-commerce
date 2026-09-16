"use client";

import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string | null }[];
  category: { name: string; slug: string };
  variants: { id: string; name: string; price: number | null }[];
  _count: { reviews: number };
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, isLoading } = useCart();
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const hasVariants = product.variants.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasVariants) {
      addItem(product.id);
    }
  };

  return (
    <article className="group relative flex flex-col border rounded-lg overflow-hidden bg-white dark:bg-gray-900 transition-shadow hover:shadow-lg">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800"
        aria-label={`View ${product.name}`}
      >
        {product.images[0] ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
        )}

        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
            -{discount}%
          </span>
        )}

        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="rounded-full bg-white/90 p-2 text-gray-700 shadow-md hover:bg-white dark:bg-gray-800/90 dark:text-gray-300"
            aria-label="Add to wishlist"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {!hasVariants && (
          <div className="absolute bottom-2 left-2 right-2 translate-y-full opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/category/${product.category.slug}`} className="text-xs text-gray-500 hover:underline dark:text-gray-400">
          {product.category.name}
        </Link>
        <Link href={`/products/${product.slug}`} className="mt-1 font-medium line-clamp-2 hover:underline">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        {hasVariants && (
          <Link
            href={`/products/${product.slug}`}
            className="mt-3 w-full"
          >
            <Button variant="outline" className="w-full" size="sm">
              View Options
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}