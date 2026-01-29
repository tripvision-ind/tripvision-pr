import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    return NextResponse.json({ destinations });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      country,
      heroImage,
      description,
      shortDescription,
      isDomestic,
      isActive,
      isFeatured,
      metaTitle,
      metaDescription,
    } = body;

    if (!name || !slug || !country || !description) {
      return NextResponse.json(
        { error: "Name, slug, country, and description are required" },
        { status: 400 },
      );
    }

    const existing = await prisma.destination.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A destination with this slug already exists" },
        { status: 400 },
      );
    }

    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        country,
        heroImage: heroImage || "",
        description,
        shortDescription,
        isDomestic: isDomestic ?? true,
        isActive: isActive ?? false,
        isFeatured: isFeatured ?? false,
        metaTitle,
        metaDescription,
      },
    });

    return NextResponse.json({ destination }, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 },
    );
  }
}
