import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

import {
  HeroSection,
  PopularDestinations,
  SpecialPackages,
  BlogsSection,
  ReviewsSection,
  CTASection,
  WhyChooseUs,
  StatsSection,
  AboutPreview,
  FeaturedPackages,
  TrustBadges,
  TourTypes,
} from "@/components/home";
import { ReviewForm } from "@/components/reviews/review-form";

async function getHomeData() {
  try {
    const [destinations, specialPackages, featuredPackages, blogs, reviews] =
      await Promise.all([
        prisma.destination.findMany({
          where: { isActive: true, isPopular: true },
          include: { _count: { select: { packages: true } } },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
        prisma.package.findMany({
          where: { isActive: true, isSpecial: true },
          include: {
            destinations: {
              include: { destination: { select: { name: true } } },
              take: 1,
            },
            prices: {
              include: { currency: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
        prisma.package.findMany({
          where: { isActive: true, isFeatured: true },
          include: {
            destinations: {
              include: { destination: { select: { name: true } } },
              take: 1,
            },
            prices: {
              include: { currency: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
        prisma.blog.findMany({
          where: { isPublished: true, isFeatured: true },
          orderBy: { publishedAt: "desc" },
          take: 3,
        }),
        prisma.review.findMany({
          where: { isApproved: true, isFeatured: true },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
      ]);

    return {
      destinations,
      specialPackages: specialPackages.map((p) => ({
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
      featuredPackages: featuredPackages.map((p) => ({
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
      blogs,
      reviews,
    };
  } catch {
    return {
      destinations: [],
      specialPackages: [],
      featuredPackages: [],
      blogs: [],
      reviews: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      {/* Hero Section with Image Carousel & Search */}
      <HeroSection />

      {/* Trust Badges / Partners */}
      <TrustBadges />

      {/* Popular Destinations */}
      <PopularDestinations
        title="Popular Destinations"
        subtitle="Explore our most sought-after travel destinations"
        destinations={data.destinations}
      />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Featured Packages */}
      <FeaturedPackages packages={data.featuredPackages} />

      {/* Stats Section */}
      <StatsSection />

      {/* Tour Types */}
      <TourTypes />

      {/* Special Offers */}
      <SpecialPackages
        title="Special Offers"
        subtitle="Limited time deals on handpicked experiences"
        packages={data.specialPackages}
        type="special"
      />

      {/* About Preview */}
      <AboutPreview />

      {/* Reviews */}
      <ReviewsSection
        title="What Our Travelers Say"
        subtitle="Real experiences from real travelers"
        reviews={data.reviews}
      />

      {/* Review Form */}
      <ReviewForm />

      {/* Blog Section */}
      <BlogsSection
        title="Travel Stories & Tips"
        subtitle="Explore our collection of travel blogs and guides"
        blogs={data.blogs}
      />

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
