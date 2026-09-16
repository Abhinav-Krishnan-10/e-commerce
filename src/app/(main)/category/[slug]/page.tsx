import { notFound } from "next/navigation";
import { CategoryPageClient } from "@/components/category/CategoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound();
  }

  const { category } = await res.json();

  return <CategoryPageClient initialCategory={category} />;
}