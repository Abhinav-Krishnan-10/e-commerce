import { Suspense } from "react";
import { ProductsList } from "@/components/products/ProductsList";
import { CategoriesSidebar } from "@/components/products/CategoriesSidebar";

export default function ProductsPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Discover our complete collection</p>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64 flex-shrink-0">
          <CategoriesSidebar />
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