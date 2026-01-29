import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currency = await prisma.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      return NextResponse.json(
        { error: "Currency not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ currency });
  } catch (error) {
    console.error("Error fetching currency:", error);
    return NextResponse.json(
      { error: "Failed to fetch currency" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { code, name, symbol, exchangeRate, isDefault, isActive } = body;

    // If setting as default, remove default from others
    if (isDefault) {
      await prisma.currency.updateMany({
        where: { isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    const currency = await prisma.currency.update({
      where: { id },
      data: {
        code: code?.toUpperCase(),
        name,
        symbol,
        exchangeRate,
        isDefault,
        isActive,
      },
    });

    return NextResponse.json({ currency });
  } catch (error) {
    console.error("Error updating currency:", error);
    return NextResponse.json(
      { error: "Failed to update currency" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if currency is being used in any packages
    const packagesUsingCurrency = await prisma.packagePrice.count({
      where: { currencyId: id },
    });

    if (packagesUsingCurrency > 0) {
      return NextResponse.json(
        { error: "Cannot delete currency that is being used by packages" },
        { status: 400 },
      );
    }

    await prisma.currency.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting currency:", error);
    return NextResponse.json(
      { error: "Failed to delete currency" },
      { status: 500 },
    );
  }
}
