import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { PackagesList } from "@/components/packages/packages-list";
import { PackagesFilter } from "@/components/packages/packages-filter";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata({
  searchParams,
}: PackagesPageProps): Promise<Metadata> {
  const params = await searchParams;

  if (params.category === "domestic") {
    return {
      title: "Domestic Tour Packages | TripVision",
      description:
        "Explore the beauty and diversity of India with our carefully crafted domestic tour packages. Discover incredible destinations across India.",
    };
  }

  if (params.category === "international") {
    return {
      title: "International Tour Packages | TripVision",
      description:
        "Embark on international adventures with our exclusive travel packages to destinations worldwide. Experience cultures, cuisine, and breathtaking landscapes.",
    };
  }

  return {
    title: "Tour Packages | TripVision",
    description:
      "Discover our handpicked collection of domestic and international travel packages designed to create unforgettable memories.",
  };
}

interface PackagesPageProps {
  searchParams: Promise<{
    destination?: string;
    duration?: string;
    month?: string;
    category?: string;
    special?: string;
    page?: string;
    search?: string;
    currency?: string;
    priceRange?: string;
  }>;
}

async function getPackages(searchParams: {
  destination?: string;
  duration?: string;
  month?: string;
  category?: string;
  special?: string;
  page?: string;
  search?: string;
  currency?: string;
  priceRange?: string;
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };

  if (searchParams.category && searchParams.category !== "all") {
    where.category = searchParams.category.toUpperCase();
  }

  if (searchParams.special === "true") {
    where.isSpecial = true;
  }

  if (searchParams.destination && searchParams.destination !== "all") {
    where.destinations = {
      some: {
        destination: {
          slug: searchParams.destination,
        },
      },
    };
  }

  if (searchParams.duration && searchParams.duration !== "all") {
    const [min, max] = searchParams.duration.split("-").map(Number);
    if (max) {
      where.durationDays = { gte: min, lte: max };
    } else {
      where.durationDays = { gte: min };
    }
  }

  if (searchParams.search && searchParams.search !== "all") {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      {
        destinations: {
          some: {
            destination: {
              name: { contains: searchParams.search, mode: "insensitive" },
            },
          },
        },
      },
    ];
  }

  if (searchParams.priceRange && searchParams.priceRange !== "all") {
    const [min, max] = searchParams.priceRange.split("-").map(Number);

    if (searchParams.currency && searchParams.currency !== "all") {
      // Filter by specific currency prices
      where.prices = {
        some: {
          currency: { code: searchParams.currency },
          OR: [
            max ? { price: { gte: min, lte: max } } : { price: { gte: min } },
            max
              ? { discountedPrice: { not: null, gte: min, lte: max } }
              : { discountedPrice: { not: null, gte: min } },
          ],
        },
      };
    } else {
      // Filter by any currency prices or base price
      where.OR = where.OR || [];
      where.OR.push(
        // Packages that use startingPrice and it falls within range
        {
          AND: [
            { prices: { none: {} } }, // No package prices
            max
              ? { startingPrice: { gte: min, lte: max } }
              : { startingPrice: { gte: min } },
          ],
        },
      );
      where.OR.push(
        // Packages with package prices where at least one price falls within range
        {
          prices: {
            some: {
              OR: [
                max
                  ? { price: { gte: min, lte: max } }
                  : { price: { gte: min } },
                max
                  ? { discountedPrice: { not: null, gte: min, lte: max } }
                  : { discountedPrice: { not: null, gte: min } },
              ],
            },
          },
        },
      );
    }
  }
  const [packages, total, destinations, currencies] = await Promise.all([
    prisma.package.findMany({
      where,
      include: {
        destinations: {
          include: { destination: { select: { name: true, slug: true } } },
          take: 1,
        },
        prices: {
          include: { currency: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.package.count({ where }),
    prisma.destination.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.currency.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, symbol: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    packages: packages.map((p) => ({
      ...p,
      startingPrice: Number(p.startingPrice),
      discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
      prices: p.prices.map((price) => ({
        ...price,
        price: Number(price.price),
        discountedPrice: price.discountedPrice
          ? Number(price.discountedPrice)
          : null,
        currency: {
          ...price.currency,
          exchangeRate: Number(price.currency.exchangeRate),
        },
      })),
    })),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    destinations,
    currencies,
  };
}

export default async function PackagesPage({
  searchParams,
}: PackagesPageProps) {
  const params = await searchParams;
  const data = await getPackages(params);

  // Get title based on category
  const getTitle = () => {
    if (params.category === "domestic") return "Domestic Tour Packages";
    if (params.category === "international")
      return "International Tour Packages";
    return "Tour Packages";
  };

  const getSubtitle = () => {
    if (params.category === "domestic")
      return "Explore the beauty and diversity of India with our carefully crafted domestic tour packages.";
    if (params.category === "international")
      return "Embark on international adventures with our exclusive travel packages to destinations worldwide.";
    return "Discover our handpicked collection of travel packages designed to create unforgettable memories.";
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {getTitle()}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{getSubtitle()}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <aside className="w-full lg:w-72 shrink-0">
              <PackagesFilter
                destinations={data.destinations}
                currencies={data.currencies}
                currentFilters={params}
              />
            </aside>

            {/* Packages Grid */}
            <div className="flex-1">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-96 rounded-2xl" />
                    ))}
                  </div>
                }
              >
                <PackagesList
                  packages={data.packages}
                  total={data.total}
                  totalPages={data.totalPages}
                  currentPage={data.currentPage}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
