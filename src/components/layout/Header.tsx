"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold" aria-label="Home">
            Ecommerce
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Categories
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>{session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/account/profile" className="block px-4 py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
                <Link href="/account/orders" className="block px-4 py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <ShoppingBag className="mr-2 h-4 w-4" /> Orders
                </Link>
                <Link href="/account/addresses" className="block px-4 py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Addresses
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="block px-4 py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                  </Link>
                )}
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 dark:border-gray-800">
          <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
            <Link href="/products" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link href="/categories" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
              Categories
            </Link>
            {session ? (
              <>
                <Link href="/account/profile" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/account/orders" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Orders
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-lg font-medium text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href="/login">
                  <Button className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}