import { prisma } from "@/lib/db";
import type { StoreSettings } from "@prisma/client";

const DEFAULT_SETTINGS: StoreSettings = {
  id: "default",
  shippingFlatPaise: 15000,
  freeShippingMinPaise: 500000,
  lowStockThreshold: 5,
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210",
};

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "default" },
      });
    }

    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function calculateShipping(
  subtotalInPaise: number,
  settings: { shippingFlatPaise: number; freeShippingMinPaise: number }
): number {
  if (subtotalInPaise >= settings.freeShippingMinPaise) {
    return 0;
  }
  return settings.shippingFlatPaise;
}

export function getStockStatus(
  stock: number,
  lowStockThreshold: number
): "out_of_stock" | "low_stock" | "in_stock" {
  if (stock <= 0) return "out_of_stock";
  if (stock <= lowStockThreshold) return "low_stock";
  return "in_stock";
}
