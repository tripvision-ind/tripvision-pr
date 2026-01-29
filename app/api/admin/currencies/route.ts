import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const currencies = await prisma.currency.findMany({
      orderBy: { code: "asc" },
    });

    return NextResponse.json({ currencies });
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, name, symbol, exchangeRate, isDefault, isActive } = body;

    if (!code || !name || !symbol) {
      return NextResponse.json(
        { error: "Code, name, and symbol are required" },
        { status: 400 },
      );
    }

    // Check if code already exists
    const existing = await prisma.currency.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { error: "Currency with this code already exists" },
        { status: 400 },
      );
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await prisma.currency.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const currency = await prisma.currency.create({
      data: {
        code: code.toUpperCase(),
        name,
        symbol,
        exchangeRate: exchangeRate || 1,
        isDefault: isDefault || false,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ currency }, { status: 201 });
  } catch (error) {
    console.error("Error creating currency:", error);
    return NextResponse.json(
      { error: "Failed to create currency" },
      { status: 500 },
    );
  }
}
