"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StoreSettings } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";

interface SettingsFormProps {
  settings: StoreSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingFlatPaise: (settings.shippingFlatPaise / 100).toString(),
    freeShippingMinPaise: (settings.freeShippingMinPaise / 100).toString(),
    lowStockThreshold: settings.lowStockThreshold.toString(),
    whatsappNumber: settings.whatsappNumber,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingFlatPaise: Math.round(parseFloat(form.shippingFlatPaise) * 100),
          freeShippingMinPaise: Math.round(
            parseFloat(form.freeShippingMinPaise) * 100
          ),
          lowStockThreshold: parseInt(form.lowStockThreshold, 10),
          whatsappNumber: form.whatsappNumber,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      toast({ title: "Settings updated" });
      router.refresh();
    } catch {
      toast({ title: "Error saving settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
      <div>
        <Label htmlFor="shipping">Flat Shipping Charge (₹)</Label>
        <Input
          id="shipping"
          type="number"
          required
          min="0"
          value={form.shippingFlatPaise}
          onChange={(e) =>
            setForm({ ...form, shippingFlatPaise: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="freeShipping">Free Shipping Above (₹)</Label>
        <Input
          id="freeShipping"
          type="number"
          required
          min="0"
          value={form.freeShippingMinPaise}
          onChange={(e) =>
            setForm({ ...form, freeShippingMinPaise: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="lowStock">Low Stock Threshold</Label>
        <Input
          id="lowStock"
          type="number"
          required
          min="1"
          value={form.lowStockThreshold}
          onChange={(e) =>
            setForm({ ...form, lowStockThreshold: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="whatsapp">WhatsApp Number</Label>
        <Input
          id="whatsapp"
          required
          placeholder="919876543210"
          value={form.whatsappNumber}
          onChange={(e) =>
            setForm({ ...form, whatsappNumber: e.target.value })
          }
        />
        <p className="mt-1 text-xs text-muted">
          Include country code without + (e.g. 919876543210)
        </p>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
