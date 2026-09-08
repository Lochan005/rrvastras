import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { trackingNumber } = await request.json();

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: "shipped",
      trackingNumber: trackingNumber || null,
    },
  });

  return NextResponse.json(order);
}
