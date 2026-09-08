import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, phone, line1, line2, city, state, pincode, isDefault } = body;

  const count = await prisma.address.count({
    where: { userId: session.user.id },
  });

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      name,
      phone,
      line1,
      line2: line2 || null,
      city,
      state,
      pincode,
      isDefault: isDefault ?? count === 0,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
