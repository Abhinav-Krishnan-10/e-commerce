import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { RelatedProducts } from "@/components/products/RelatedProducts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound();
  }

  const { product, relatedProducts } = await res.json();

  return (
    <div className="container py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li>/</li>
          <li><a href="/products" className="hover:underline">Products</a></li>
          <li>/</li>
          {product.category && (
            <>
              <li><a href={`/category/${product.category.slug}`} className="hover:underline">{product.category.name}</a></li>
              <li>/</li>
            </>
          )}
          <li className="text-gray-900 dark:text-white truncate max-w-[200px]" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}