"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  type CartItem,
  getCartFromStorage,
  saveCartToStorage,
  getCartCount,
  capLineQuantity,
} from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(getCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCartToStorage(items);
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        const nextQty = capLineQuantity(
          (existing?.quantity ?? 0) + quantity,
          item.stock
        );
        if (nextQty <= 0) return prev;
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId ? { ...i, quantity: nextQty } : i
          );
        }
        return [...prev, { ...item, quantity: nextQty }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.productId !== productId) return i;
          return { ...i, quantity: capLineQuantity(quantity, i.stock) };
        })
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        count: getCartCount(items),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
