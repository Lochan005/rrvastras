export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceInPaise: number;
  imageUrl: string;
  imageAlt: string;
  quantity: number;
  stock: number;
}

export const CART_STORAGE_KEY = "rrvastras-cart";

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceInPaise * item.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
