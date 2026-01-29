import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { slugify } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the original package with all related data
    const originalPackage = await prisma.package.findUnique({
      where: { id },
      include: {
        destinations: true,
        itinerary: { orderBy: { day: "asc" } },
        hotels: true,
        meals: true,
        transfers: true,
        sightseeing: true,
        inclusions: true,
        exclusions: true,
        policies: true,
        activities: true,
        prices: { include: { currency: true } },
      },
    });

    if (!originalPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Generate unique slug for duplicate
    let newSlug = `${originalPackage.slug}-copy`;
    let counter = 1;
    while (await prisma.package.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${originalPackage.slug}-copy-${counter}`;
      counter++;
    }

    // Create duplicate package
    const duplicatePackage = await prisma.package.create({
      data: {
        title: `${originalPackage.title} (Copy)`,
        slug: newSlug,
        description: originalPackage.description,
        shortDescription: originalPackage.shortDescription,
        heroImage: originalPackage.heroImage,
        images: originalPackage.images,
        duration: originalPackage.duration,
        durationDays: originalPackage.durationDays,
        durationNights: originalPackage.durationNights,
        startingPrice: originalPackage.startingPrice,
        discountedPrice: originalPackage.discountedPrice,
        category: originalPackage.category,
        isSpecial: false, // Disable for duplicates
        isFeatured: false,
        isPopular: false,
        isActive: false, // Set to draft by default
        metaTitle: originalPackage.metaTitle,
        metaDescription: originalPackage.metaDescription,
        // Create related data
        destinations: {
          create: originalPackage.destinations.map((dest) => ({
            destinationId: dest.destinationId,
          })),
        },
        itinerary: {
          create: originalPackage.itinerary.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
            images: item.images,
          })),
        },
        hotels: {
          create: originalPackage.hotels.map((hotel) => ({
            name: hotel.name,
            location: hotel.location,
            starRating: hotel.starRating,
            nights: hotel.nights,
            description: hotel.description,
          })),
        },
        meals: {
          create: originalPackage.meals.map((meal) => ({
            type: meal.type,
            description: meal.description,
          })),
        },
        transfers: {
          create: originalPackage.transfers.map((transfer) => ({
            type: transfer.type,
            description: transfer.description,
          })),
        },
        sightseeing: {
          create: originalPackage.sightseeing.map((sight) => ({
            name: sight.name,
            description: sight.description,
          })),
        },
        inclusions: {
          create: originalPackage.inclusions.map((inc) => ({
            item: inc.item,
          })),
        },
        exclusions: {
          create: originalPackage.exclusions.map((exc) => ({
            item: exc.item,
          })),
        },
        policies: {
          create: originalPackage.policies.map((policy) => ({
            type: policy.type,
            title: policy.title,
            description: policy.description,
          })),
        },
        activities: {
          create: originalPackage.activities.map((activity) => ({
            name: activity.name,
            description: activity.description,
            price: activity.price,
            isOptional: activity.isOptional,
          })),
        },
        prices: {
          create: originalPackage.prices.map((price) => ({
            currencyId: price.currencyId,
            price: price.price,
            discountedPrice: price.discountedPrice,
          })),
        },
      },
      include: {
        destinations: true,
        itinerary: true,
        hotels: true,
        meals: true,
        transfers: true,
        sightseeing: true,
        inclusions: true,
        exclusions: true,
        policies: true,
        activities: true,
        prices: { include: { currency: true } },
      },
    });

    return NextResponse.json(
      { package: duplicatePackage, id: duplicatePackage.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error duplicating package:", error);
    return NextResponse.json(
      { error: "Failed to duplicate package" },
      { status: 500 },
    );
  }
}
