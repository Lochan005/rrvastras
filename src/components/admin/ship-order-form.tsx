"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";

interface ShipOrderFormProps {
  orderId: string;
}

export function ShipOrderForm({ orderId }: ShipOrderFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber: trackingNumber || null }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({ title: "Order marked as shipped" });
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-white p-6"
    >
      <h2 className="font-medium">Mark as Shipped</h2>
      <div className="mt-4">
        <Label htmlFor="tracking">Tracking Number (optional)</Label>
        <Input
          id="tracking"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          className="mt-1"
        />
      </div>
      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? "Updating..." : "Mark as Shipped"}
      </Button>
    </form>
  );
}
