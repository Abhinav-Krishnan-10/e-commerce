"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { X, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string; alt: string | null }[];
    variants: { id: string; name: string; price: number | null }[];
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartSidebarProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = async (productId: string, variantId?: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      await fetchCart();
      toast.success("Added to cart");
      openCart();
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return removeItem(itemId);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      await fetchCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
      await fetchCart();
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear cart");
      setItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = fetchCart;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
      <CartSidebar />
    </CartContext.Provider>
  );
}

function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, isLoading, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:max-w-md">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className="relative flex-1 flex flex-col bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Shopping Cart ({itemCount})</h2>
          <button onClick={closeCart} className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && items.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-4" role="list" aria-label="Cart items">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4" aria-label={`${item.product.name} - Quantity: ${item.quantity}`}>
                  <Link href={`/products/${item.product.slug}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0].url} alt={item.product.images[0].alt || item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">
                        <Link href={`/products/${item.product.slug}`} className="hover:underline">
                          {item.product.name}
                        </Link>
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.variantId && item.product.variants.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.product.variants.find((v) => v.id === item.variantId)?.name || "Variant"}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-medium">{formatPrice(item.product.price)}</span>
                      <div className="flex items-center gap-2 border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Shipping</span>
              <span className="font-medium">{subtotal >= 100 ? "Free" : formatPrice(9.99)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Tax</span>
              <span className="font-medium">{formatPrice(subtotal * 0.08)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal + (subtotal >= 100 ? 0 : 9.99) + subtotal * 0.08)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full" size="lg" disabled={isLoading}>
                Proceed to Checkout
              </Button>
            </Link>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Shipping, taxes, and discounts calculated at checkout.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}