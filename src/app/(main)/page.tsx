import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";

export default function HomePage() {
  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over $100" },
    { icon: Shield, title: "Secure Payment", description: "100% secure checkout" },
    { icon: RotateCcw, title: "Easy Returns", description: "30-day return policy" },
    { icon: ShoppingBag, title: "Best Prices", description: "Guaranteed low prices" },
  ];

  const categories = [
    { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop", count: 150 },
    { name: "Clothing", slug: "clothing", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop", count: 200 },
    { name: "Home & Garden", slug: "home-garden", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", count: 120 },
    { name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop", count: 80 },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-transparent py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Discover Amazing <span className="text-primary">Products</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Shop the latest trends at unbeatable prices. Fast shipping, easy returns, and exceptional customer service.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline">Browse Categories</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading" className="sr-only">Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900" aria-labelledby="categories-heading">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 id="categories-heading" className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
              View All Categories
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src={category.image}
                  alt=""
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm opacity-80">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" aria-labelledby="newsletter-heading">
        <div className="container">
          <div className="mx-auto max-w-md text-center">
            <h2 id="newsletter-heading" className="text-2xl font-bold">Stay Updated</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter for exclusive deals and new arrivals.
            </p>
            <form className="mt-6 flex gap-2" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Email address"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}