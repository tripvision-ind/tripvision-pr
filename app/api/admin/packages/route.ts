import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        destinations: {
          include: { destination: { select: { name: true } } },
        },
        prices: {
          include: { currency: true },
        },
      },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
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
      title,
      slug,
      description,
      shortDescription,
      heroImage,
      images,
      duration,
      durationDays,
      durationNights,
      category,
      isSpecial,
      isFeatured,
      isPopular,
      isActive,
      metaTitle,
      metaDescription,
      destinationIds,
      itinerary,
      hotels,
      meals,
      transfers,
      sightseeing,
      inclusions,
      exclusions,
      policies,
      activities,
      prices,
    } = body;

    if (!title || !slug || !description || !duration) {
      return NextResponse.json(
        { error: "Title, slug, description, and duration are required" },
        { status: 400 },
      );
    }

    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A package with this slug already exists" },
        { status: 400 },
      );
    }

    // Get the starting price from prices array
    const startingPrice = prices?.length > 0 ? parseFloat(prices[0].price) : 0;
    const discountedPrice =
      prices?.length > 0 && prices[0].discountedPrice
        ? parseFloat(prices[0].discountedPrice)
        : null;

    const packageData = await prisma.package.create({
      data: {
        title,
        slug,
        description,
        shortDescription: shortDescription || null,
        heroImage: heroImage || "",
        images: images || [],
        duration,
        durationDays: durationDays || 1,
        durationNights: durationNights || 0,
        startingPrice,
        discountedPrice,
        category: category || "DOMESTIC",
        isSpecial: isSpecial ?? false,
        isFeatured: isFeatured ?? false,
        isPopular: isPopular ?? false,
        isActive: isActive ?? false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        // Create related data
        ...(destinationIds?.length > 0 && {
          destinations: {
            create: destinationIds.map((destId: string) => ({
              destinationId: destId,
            })),
          },
        }),
        ...(itinerary?.length > 0 && {
          itinerary: {
            create: itinerary.map(
              (item: {
                day: number;
                title: string;
                description: string;
                images: string[];
              }) => ({
                day: item.day,
                title: item.title,
                description: item.description,
                images: item.images || [],
              }),
            ),
          },
        }),
        ...(hotels?.length > 0 && {
          hotels: {
            create: hotels.map(
              (hotel: {
                name: string;
                location: string;
                starRating: number;
                nights: number;
                description?: string;
              }) => ({
                name: hotel.name,
                location: hotel.location,
                starRating: hotel.starRating,
                nights: hotel.nights,
                description: hotel.description || null,
              }),
            ),
          },
        }),
        ...(meals?.length > 0 && {
          meals: {
            create: meals.map(
              (meal: { type: string; description?: string }) => ({
                type: meal.type,
                description: meal.description || null,
              }),
            ),
          },
        }),
        ...(transfers?.length > 0 && {
          transfers: {
            create: transfers.map(
              (transfer: { type: string; description?: string }) => ({
                type: transfer.type,
                description: transfer.description || null,
              }),
            ),
          },
        }),
        ...(sightseeing?.length > 0 && {
          sightseeing: {
            create: sightseeing.map(
              (sight: { name: string; description?: string }) => ({
                name: sight.name,
                description: sight.description || null,
              }),
            ),
          },
        }),
        ...(inclusions?.length > 0 && {
          inclusions: {
            create: inclusions.map((item: string) => ({ item })),
          },
        }),
        ...(exclusions?.length > 0 && {
          exclusions: {
            create: exclusions.map((item: string) => ({ item })),
          },
        }),
        ...(policies?.length > 0 && {
          policies: {
            create: policies.map(
              (policy: {
                type: string;
                title: string;
                description: string;
              }) => ({
                type: policy.type,
                title: policy.title,
                description: policy.description,
              }),
            ),
          },
        }),
        ...(activities?.length > 0 && {
          activities: {
            create: activities.map(
              (activity: {
                name: string;
                description?: string;
                price?: string;
                isOptional: boolean;
              }) => ({
                name: activity.name,
                description: activity.description || null,
                price: activity.price ? parseFloat(activity.price) : null,
                isOptional: activity.isOptional ?? true,
              }),
            ),
          },
        }),
        ...(prices?.length > 0 && {
          prices: {
            create: prices
              .filter(
                (price: { currencyId: string; price: string }) => price.price,
              )
              .map(
                (price: {
                  currencyId: string;
                  price: string;
                  discountedPrice?: string;
                }) => ({
                  currencyId: price.currencyId,
                  price: parseFloat(price.price),
                  discountedPrice: price.discountedPrice
                    ? parseFloat(price.discountedPrice)
                    : null,
                }),
              ),
          },
        }),
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

    return NextResponse.json({ package: packageData }, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 },
    );
  }
}
