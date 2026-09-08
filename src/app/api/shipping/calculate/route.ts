import { getStoreSettings, calculateShipping } from "@/lib/store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { subtotalInPaise } = await request.json();
  const settings = await getStoreSettings();
  const shippingInPaise = calculateShipping(subtotalInPaise, settings);

  return NextResponse.json({
    subtotalInPaise,
    shippingInPaise,
    totalInPaise: subtotalInPaise + shippingInPaise,
  });
}
