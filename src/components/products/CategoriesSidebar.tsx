"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
  children: Category[];
}

interface CategoriesSidebarProps {
  initialCategories?: Category[];
}

export function CategoriesSidebar({ initialCategories = [] }: CategoriesSidebarProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(!initialCategories.length);

  const toggleExpand = (slug: string) => {
    setExpanded((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const fetchCategories = async () => {
    if (initialCategories.length) return;
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <aside className="space-y-1">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <nav aria-label="Product categories">
        <ul className="space-y-1" role="list">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isExpanded={expanded.includes(category.slug)}
              onToggle={() => toggleExpand(category.slug)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function CategoryItem({
  category,
  isExpanded,
  onToggle,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasChildren = category.children.length > 0;
  const totalProducts = category._count.products + category.children.reduce((sum, c) => sum + c._count.products, 0);

  return (
    <li>
      <Link
        href={`/category/${category.slug}`}
        className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span>{category.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">({totalProducts})</span>
      </Link>
      {hasChildren && (
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-3 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          aria-expanded={isExpanded}
          aria-controls={`category-${category.slug}`}
        >
          <span>Subcategories</span>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      )}
      {hasChildren && isExpanded && (
        <ul id={`category-${category.slug}`} className="ml-4 mt-1 space-y-1" role="list">
          {category.children.map((child) => (
            <li key={child.id}>
              <Link
                href={`/category/${child.slug}`}
                className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <span>{child.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({child._count.products})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}