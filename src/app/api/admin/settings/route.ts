import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  const settings = await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {
      shippingFlatPaise: body.shippingFlatPaise,
      freeShippingMinPaise: body.freeShippingMinPaise,
      lowStockThreshold: body.lowStockThreshold,
      whatsappNumber: body.whatsappNumber,
    },
    create: {
      id: "default",
      ...body,
    },
  });

  return NextResponse.json(settings);
}
