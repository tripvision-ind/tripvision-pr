import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get active destinations
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });

    // Get package categories
    const categories = await prisma.package.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { isActive: true },
    });

    // Get duration ranges from existing packages
    const durations = await prisma.package.findMany({
      select: { durationDays: true },
      distinct: ["durationDays"],
      where: { isActive: true },
      orderBy: { durationDays: "asc" },
    });

    // Create duration options
    const durationOptions = [
      { label: "1-3 Days", value: "1-3" },
      { label: "4-6 Days", value: "4-6" },
      { label: "7-10 Days", value: "7-10" },
      { label: "11-15 Days", value: "11-15" },
      { label: "15+ Days", value: "15+" },
    ];

    // Get price ranges
    const packages = await prisma.package.findMany({
      select: { startingPrice: true },
      where: { isActive: true },
    });

    const prices = packages
      .map((p) => Number(p.startingPrice))
      .sort((a, b) => a - b);
    const minPrice = prices[0] || 0;
    const maxPrice = prices[prices.length - 1] || 100000;

    const priceRanges = [
      { label: "Under ₹10,000", value: "0-10000" },
      { label: "₹10,000 - ₹25,000", value: "10000-25000" },
      { label: "₹25,000 - ₹50,000", value: "25000-50000" },
      { label: "₹50,000 - ₹1,00,000", value: "50000-100000" },
      { label: "Above ₹1,00,000", value: "100000+" },
    ];

    return NextResponse.json({
      destinations,
      categories: categories.map((c) => c.category),
      durationOptions,
      priceRanges,
      priceRange: { min: minPrice, max: maxPrice },
    });
  } catch (error) {
    console.error("Error fetching package filter options:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 },
    );
  }
}
