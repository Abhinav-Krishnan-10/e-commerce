"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string | null; position: number }[];
  category: { name: string; slug: string };
  variants: { id: string; name: string; price: number | null; stock: number; attributes: Record<string, string> }[];
  avgRating: number;
  reviewCount: number;
  trackInventory: boolean;
}

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading } = useCart();

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const currentVariant = product.variants.find((v) => v.id === selectedVariant);
  const displayPrice = currentVariant?.price ?? product.price;
  const displayCompareAt = product.compareAtPrice;
  const inStock = currentVariant ? currentVariant.stock > 0 : product.trackInventory !== false;

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("Product is out of stock");
      return;
    }
    addItem(product.id, selectedVariant || undefined, quantity);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!inStock) {
      toast.error("Product is out of stock");
      return;
    }
    addItem(product.id, selectedVariant || undefined, quantity).then(() => {
      window.location.href = "/checkout";
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
          {product.images[selectedImage] ? (
            <Image
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].alt || product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
          )}
          {discount > 0 && (
            <span className="absolute top-4 left-4 z-10 rounded bg-red-500 px-3 py-1 text-sm font-medium text-white">
              -{discount}%
            </span>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === selectedImage ? "border-primary" : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                aria-label={`View image ${index + 1}`}
                aria-current={index === selectedImage ? "true" : "false"}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <Link href={`/category/${product.category.slug}`} className="text-sm text-gray-500 hover:underline dark:text-gray-400">
            {product.category.name}
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.avgRating.toFixed(1)}</span>
              <span className="text-gray-500 dark:text-gray-400">({product.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="border-t border-b py-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(displayPrice)}</span>
            {displayCompareAt && displayCompareAt > displayPrice && (
              <span className="text-xl text-gray-500 line-through">{formatPrice(displayCompareAt)}</span>
            )}
          </div>
          {product.shortDesc && <p className="mt-2 text-gray-600 dark:text-gray-400">{product.shortDesc}</p>}
        </div>

        <div className="prose max-w-none text-gray-600 dark:text-gray-400">
          <p>{product.description}</p>
        </div>

        {product.variants.length > 0 && (
          <fieldset className="space-y-3">
            <legend className="font-medium">Select Variant</legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedVariant === variant.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : variant.stock === 0
                      ? "border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700"
                      : "border-gray-300 hover:border-primary dark:border-gray-600"
                  }`}
                  disabled={variant.stock === 0}
                  aria-pressed={selectedVariant === variant.id}
                >
                  {variant.name}
                  {variant.price !== null && variant.price !== product.price && (
                    <span className="ml-1 text-xs">({formatPrice(variant.price)})</span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex items-center gap-4 border-t pt-6">
          <label htmlFor="quantity" className="font-medium">Quantity:</label>
          <div className="flex items-center border rounded">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Decrease quantity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={currentVariant?.stock || 99}
              className="w-16 text-center border-x focus:outline-none"
              aria-label="Quantity"
            />
            <button
              onClick={() => setQuantity((prev) => Math.min(currentVariant?.stock || 99, prev + 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Increase quantity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {currentVariant?.stock !== undefined && currentVariant.stock > 0 && currentVariant.stock < 10 && (
            <span className="text-sm text-orange-600 dark:text-orange-400">Only {currentVariant.stock} left!</span>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !inStock}
            className="flex-1"
            size="lg"
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button
            onClick={handleBuyNow}
            disabled={isLoading || !inStock}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Buy Now
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Truck className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Free Shipping</p>
              <p className="text-sm text-gray-500">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Secure Payment</p>
              <p className="text-sm text-gray-500">100% protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <RotateCcw className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Easy Returns</p>
              <p className="text-sm text-gray-500">30-day policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}