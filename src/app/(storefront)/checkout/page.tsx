"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/cart-provider";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface ShippingInfo {
  subtotalInPaise: number;
  shippingInPaise: number;
  totalInPaise: number;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/addresses")
        .then((r) => r.json())
        .then((data) => {
          setAddresses(data);
          const defaultAddr = data.find((a: Address) => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        });
    }
  }, [session]);

  useEffect(() => {
    if (items.length > 0) {
      const subtotal = items.reduce(
        (sum, i) => sum + i.priceInPaise * i.quantity,
        0
      );
      fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtotalInPaise: subtotal }),
      })
        .then((r) => r.json())
        .then(setShipping);
    }
  }, [items]);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });
    if (res.ok) {
      const addr = await res.json();
      setAddresses((prev) => [...prev, addr]);
      setSelectedAddressId(addr.id);
      setShowNewAddress(false);
      toast({ title: "Address saved" });
    }
  }

  async function handleCheckout() {
    if (!selectedAddressId) {
      toast({
        title: "Select an address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      clearCart();

      if (data.paymentSessionId && data.cashfreeMode !== "mock") {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.onload = () => {
          const cashfree = (window as unknown as { Cashfree: (opts: { mode: string }) => { checkout: (opts: { paymentSessionId: string; redirectTarget: string }) => void } }).Cashfree({
            mode: data.cashfreeMode,
          });
          cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_self",
          });
        };
        document.body.appendChild(script);
      } else {
        router.push(`/orders/${data.orderId}?payment=success`);
      }
    } catch (err) {
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        {items.length === 0 ? (
          <>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Your Bag is Empty</h1>
            <p className="text-muted mb-8">Add items to your bag to proceed to checkout.</p>
            <Button size="lg" onClick={() => router.push("/shop")}>
              Shop Now
            </Button>
          </>
        ) : (
          <p className="text-muted">Loading checkout...</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-xl font-serif font-semibold mb-6">Delivery Address</h2>

          {addresses.length > 0 && (
            <div className="space-y-4 mb-6">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block cursor-pointer rounded-sm border p-5 transition-colors ${
                    selectedAddressId === addr.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 mr-3 h-4 w-4 border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-semibold text-foreground">{addr.name}</span>
                      <p className="mt-1 text-sm text-muted leading-relaxed">
                        {addr.line1}
                        {addr.line2 && `, ${addr.line2}`}
                        <br />
                        {addr.city}, {addr.state} — {addr.pincode}
                        <br />
                        {addr.phone}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {!showNewAddress ? (
            <Button
              variant="outline"
              onClick={() => setShowNewAddress(true)}
            >
              Add new address
            </Button>
          ) : (
            <div className="bg-accent/30 p-6 rounded-sm border border-border">
              <h3 className="font-serif font-semibold text-lg mb-4">New Address</h3>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      required
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    required
                    value={newAddress.line1}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, line1: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (optional)</Label>
                  <Input
                    id="line2"
                    value={newAddress.line2}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, line2: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      required
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      required
                      pattern="[0-9]{6}"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, pincode: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit">Save Address</Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowNewAddress(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-accent/30 p-6 rounded-sm border border-border">
            <h2 className="text-xl font-serif font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted">
                    {item.name} <span className="text-foreground font-medium">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-foreground">{formatINR(item.priceInPaise * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-3">
              {shipping && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium text-foreground">{formatINR(shipping.subtotalInPaise)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="font-medium text-foreground">
                      {shipping.shippingInPaise === 0
                        ? "Free"
                        : formatINR(shipping.shippingInPaise)}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between text-lg font-serif font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatINR(shipping.totalInPaise)}</span>
                  </div>
                </>
              )}
            </div>
            
            <Button
              className="mt-8 w-full uppercase tracking-wider font-semibold"
              size="lg"
              onClick={handleCheckout}
              disabled={loading || !selectedAddressId}
            >
              {loading ? "Processing..." : "Pay with Cashfree"}
            </Button>
            <p className="mt-4 text-center text-xs text-muted flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure payment via Cards & UPI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
