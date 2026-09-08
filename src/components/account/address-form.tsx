"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toaster";

const fieldClass =
  "mt-1 h-12 w-full rounded bg-surface-container-lowest px-space-md font-body-sm text-body-sm text-on-surface shadow-sm outline-none focus:ring-1 focus:ring-primary";

const labelClass =
  "font-label-eyebrow text-label-eyebrow tracking-wider text-outline uppercase";

export function AddressForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({ title: "Address saved" });
      router.refresh();
      setForm({
        name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch {
      toast({ title: "Error saving address", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-space-md space-y-space-md">
      <div>
        <label htmlFor="addr-name" className={labelClass}>
          Full Name
        </label>
        <input
          id="addr-name"
          required
          className={fieldClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="addr-phone" className={labelClass}>
          Phone
        </label>
        <input
          id="addr-phone"
          required
          className={fieldClass}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="addr-line1" className={labelClass}>
          Address Line 1
        </label>
        <input
          id="addr-line1"
          required
          className={fieldClass}
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="addr-line2" className={labelClass}>
          Address Line 2 (optional)
        </label>
        <input
          id="addr-line2"
          className={fieldClass}
          value={form.line2}
          onChange={(e) => setForm({ ...form, line2: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-space-md">
        <div>
          <label htmlFor="addr-city" className={labelClass}>
            City
          </label>
          <input
            id="addr-city"
            required
            className={fieldClass}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="addr-state" className={labelClass}>
            State
          </label>
          <input
            id="addr-state"
            required
            className={fieldClass}
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label htmlFor="addr-pincode" className={labelClass}>
          Pincode
        </label>
        <input
          id="addr-pincode"
          required
          pattern="[0-9]{6}"
          className={fieldClass}
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-on-primary uppercase disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}
