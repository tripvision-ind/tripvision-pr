import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            packages: true,
          },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ destination });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      heroImage,
      shortDescription,
      country,
      region,
      isPopular,
      isDomestic,
      isFeatured,
      isActive,
      metaTitle,
      metaDescription,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    // Check if destination exists
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    });
    if (!existingDestination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    // Check if slug is taken by another destination
    if (slug !== existingDestination.slug) {
      const slugTaken = await prisma.destination.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: "A destination with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        heroImage: heroImage || "",
        shortDescription,
        country,
        region,
        isPopular: isPopular ?? false,
        isDomestic: isDomestic ?? true,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        metaTitle,
        metaDescription,
      },
      include: {
        _count: {
          select: {
            packages: true,
          },
        },
      },
    });

    return NextResponse.json({ destination });
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      { error: "Failed to update destination" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if destination exists
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            packages: true,
          },
        },
      },
    });

    if (!existingDestination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    // Check if destination has packages
    if (existingDestination._count.packages > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete destination with ${existingDestination._count.packages} associated packages. Please remove or reassign packages first.`,
        },
        { status: 400 },
      );
    }

    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 },
    );
  }
}
