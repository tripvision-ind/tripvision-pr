import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get unique sources
    const sources = await prisma.enquiry.findMany({
      select: { source: true },
      distinct: ["source"],
    });

    // Get unique statuses
    const statuses = await prisma.enquiry.findMany({
      select: { status: true },
      distinct: ["status"],
    });

    // Get destinations that have enquiries
    const destinations = await prisma.enquiry.findMany({
      select: { destination: true },
      distinct: ["destination"],
      where: { destination: { not: null } },
    });

    // Get packages that have enquiries
    const packages = await prisma.package.findMany({
      select: { id: true, title: true, slug: true },
      where: {
        enquiries: {
          some: {},
        },
      },
    });

    // Get travel date ranges (current year and next year)
    const currentYear = new Date().getFullYear();
    const dateRanges = [
      { label: "This Month", value: "this-month" },
      { label: "Next Month", value: "next-month" },
      { label: "This Quarter", value: "this-quarter" },
      { label: "Next Quarter", value: "next-quarter" },
      { label: `${currentYear}`, value: `${currentYear}` },
      { label: `${currentYear + 1}`, value: `${currentYear + 1}` },
    ];

    return NextResponse.json({
      sources: sources.map((s) => s.source),
      statuses: statuses.map((s) => s.status),
      destinations: destinations.map((d) => d.destination).filter(Boolean),
      packages,
      dateRanges,
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 },
    );
  }
}
