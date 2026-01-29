import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { TestimonialsHero } from "@/components/testimonials/testimonials-hero";
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid";
import { TestimonialsStats } from "@/components/testimonials/testimonials-stats";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials | TripVision - Real Travel Experiences",
  description:
    "Read authentic testimonials and reviews from our satisfied travelers. Discover why thousands of customers trust TripVision for their dream vacations.",
  keywords:
    "testimonials, travel reviews, customer feedback, TripVision reviews, authentic travel experiences",
};

async function getTestimonials(searchParams: {
  page?: string;
  rating?: string;
  tripType?: string;
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = { isApproved: true };

  if (searchParams.rating && searchParams.rating !== "all") {
    where.rating = { gte: parseInt(searchParams.rating) };
  }

  if (searchParams.tripType && searchParams.tripType !== "all") {
    where.tripType = { contains: searchParams.tripType, mode: "insensitive" };
  }

  const [testimonials, total, stats] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { isApproved: true },
      _count: { rating: true },
    }),
  ]);

  const avgRating = await prisma.review.aggregate({
    where: { isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    testimonials,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    stats: {
      totalReviews: avgRating._count.rating || 0,
      averageRating: avgRating._avg.rating || 0,
      ratingDistribution: stats.reduce(
        (acc, curr) => {
          acc[curr.rating] = curr._count.rating;
          return acc;
        },
        {} as Record<number, number>,
      ),
    },
  };
}

interface TestimonialsPageProps {
  searchParams: Promise<{
    page?: string;
    rating?: string;
    tripType?: string;
  }>;
}

export default async function TestimonialsPage({
  searchParams,
}: TestimonialsPageProps) {
  const params = await searchParams;
  const data = await getTestimonials(params);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <TestimonialsHero stats={data.stats} />

      {/* Stats Section */}
      <TestimonialsStats stats={data.stats} />

      {/* Testimonials Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            }
          >
            <TestimonialsGrid
              testimonials={data.testimonials}
              total={data.total}
              totalPages={data.totalPages}
              currentPage={data.currentPage}
              currentFilters={params}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
