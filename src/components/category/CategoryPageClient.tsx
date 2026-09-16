"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ProductsList } from "@/components/products/ProductsList";
import { CategoriesSidebar } from "@/components/products/CategoriesSidebar";
import { Suspense } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent: { id: string; name: string; slug: string } | null;
  children: { id: string; name: string; slug: string; _count: { products: number } }[];
  _count: { products: number };
}

interface CategoryPageClientProps {
  initialCategory: Category;
}

export function CategoryPageClient({ initialCategory }: CategoryPageClientProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <div className="container py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li>/</li>
          <li><Link href="/categories" className="hover:underline">Categories</Link></li>
          <li>/</li>
          {initialCategory.parent && (
            <>
              <li><Link href={`/category/${initialCategory.parent.slug}`} className="hover:underline">{initialCategory.parent.name}</Link></li>
              <li>/</li>
            </>
          )}
          <li className="text-gray-900 dark:text-white" aria-current="page">{initialCategory.name}</li>
        </ol>
      </nav>

      <header className="mb-8">
        {initialCategory.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={initialCategory.image} alt="" className="w-full h-48 object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold">{initialCategory.name}</h1>
        {initialCategory.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{initialCategory.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{initialCategory._count.products} products</p>
      </header>

      {initialCategory.children.length > 0 && (
        <div className="mb-8 overflow-x-auto">
          <ul className="flex gap-4 min-w-max" role="list">
            {initialCategory.children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/category/${child.slug}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 whitespace-nowrap"
                >
                  {child.name}
                  <span className="text-xs text-gray-500">({child._count.products})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64 flex-shrink-0">
          <CategoriesSidebar initialCategories={initialCategory.children as any} />
        </aside>
        <main className="flex-1">
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}