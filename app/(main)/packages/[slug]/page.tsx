import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { PackageDetails } from "@/components/packages/package-details";
import { PackageEnquiryForm } from "@/components/packages/package-enquiry-form";
import { PackageActions } from "@/components/packages/package-actions";
import { formatPrice } from "@/lib/utils";
import { Clock, MapPin, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

async function getPackage(slug: string) {
  const pkg = await prisma.package.findUnique({
    where: { slug, isActive: true },
    include: {
      itinerary: { orderBy: { day: "asc" } },
      hotels: true,
      meals: true,
      transfers: true,
      sightseeing: true,
      inclusions: true,
      exclusions: true,
      policies: true,
      activities: true,
      destinations: {
        include: { destination: true },
      },
      prices: {
        include: { currency: true },
      },
    },
  });

  if (!pkg) return null;

  return {
    ...pkg,
    startingPrice: Number(pkg.startingPrice),
    discountedPrice: pkg.discountedPrice ? Number(pkg.discountedPrice) : null,
    activities: pkg.activities.map((a) => ({
      ...a,
      price: a.price ? Number(a.price) : null,
    })),
    prices: pkg.prices.map((p) => ({
      ...p,
      price: Number(p.price),
      discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
      currency: {
        ...p.currency,
        exchangeRate: Number(p.currency.exchangeRate),
      },
    })),
  };
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    return { title: "Package Not Found" };
  }

  return {
    title: pkg.metaTitle || pkg.title,
    description: pkg.metaDescription || pkg.shortDescription || pkg.description,
  };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    notFound();
  }

  const destinationNames = pkg.destinations
    .map((d) => d.destination.name)
    .join(", ");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[400px] lg:h-[500px]">
        <Image
          src={pkg.heroImage || "/placeholder-package.jpg"}
          alt={pkg.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Header with Package Actions - Top Right */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10">
          <PackageActions pkg={pkg} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="container mx-auto">
            <Badge className="mb-4">{pkg.category}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {pkg.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {destinationNames}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <PackageDetails pkg={pkg} />
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-96 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="bg-card rounded-2xl border p-6">
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">
                      Starting from
                    </span>
                    <div className="flex items-center gap-3">
                      {(() => {
                        // Use package prices if available, otherwise fall back to startingPrice
                        const packagePrice = pkg.prices?.[0];
                        const displayPrice =
                          packagePrice?.discountedPrice ||
                          packagePrice?.price ||
                          pkg.discountedPrice ||
                          pkg.startingPrice;
                        const originalPrice =
                          packagePrice?.price || pkg.startingPrice;
                        const currency = packagePrice?.currency || {
                          code: "INR",
                          symbol: "₹",
                        };

                        const hasDiscount =
                          (packagePrice?.discountedPrice &&
                            packagePrice.discountedPrice <
                              packagePrice.price) ||
                          (pkg.discountedPrice &&
                            pkg.discountedPrice < pkg.startingPrice);

                        return hasDiscount ? (
                          <>
                            <span className="text-3xl font-bold text-primary">
                              {formatPrice(
                                displayPrice,
                                currency.code,
                                currency.symbol,
                              )}
                            </span>
                            <span className="text-lg text-muted-foreground line-through">
                              {formatPrice(
                                originalPrice,
                                currency.code,
                                currency.symbol,
                              )}
                            </span>
                            <Badge variant="destructive">
                              {Math.round(
                                ((originalPrice - displayPrice) /
                                  originalPrice) *
                                  100,
                              )}
                              % OFF
                            </Badge>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-primary">
                            {formatPrice(
                              displayPrice,
                              currency.code,
                              currency.symbol,
                            )}
                          </span>
                        );
                      })()}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      per person
                    </span>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-medium text-sm">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Group Size
                        </p>
                        <p className="font-medium text-sm">2-15 People</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enquiry Form */}
                <PackageEnquiryForm
                  packageId={pkg.id}
                  packageTitle={pkg.title}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
