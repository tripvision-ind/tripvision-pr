import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

async function getDestination(slug: string) {
  return prisma.destination.findUnique({
    where: { slug, isActive: true },
    include: {
      packages: {
        where: { package: { isActive: true } },
        include: {
          package: {
            include: {
              destinations: {
                include: { destination: { select: { name: true } } },
                take: 1,
              },
              prices: {
                include: { currency: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestination(slug);

  if (!dest) return { title: "Destination Not Found" };

  return {
    title: dest.metaTitle || dest.name,
    description:
      dest.metaDescription || dest.shortDescription || dest.description,
  };
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;
  const dest = await getDestination(slug);

  if (!dest) notFound();

  const packages = dest.packages.map((p) => ({
    ...p.package,
    startingPrice: Number(p.package.startingPrice),
    discountedPrice: p.package.discountedPrice
      ? Number(p.package.discountedPrice)
      : null,
    prices: p.package.prices.map((price) => ({
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
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[400px] lg:h-[500px]">
        <Image
          src={dest.heroImage || "/placeholder-destination.jpg"}
          alt={dest.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-primary mb-4">
              <MapPin className="size-5" />
              <span className="text-lg">{dest.country}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {dest.name}
            </h1>
            {dest.shortDescription && (
              <p className="text-xl text-gray-200 max-w-2xl">
                {dest.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">About {dest.name}</h2>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: dest.description }}
            />
          </div>
        </div>
      </section>

      {/* Gallery */}
      {dest.images.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dest.images.map((image, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${dest.name} - ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold">
                  Packages to {dest.name}
                </h2>
                <p className="text-muted-foreground">
                  {packages.length} packages available
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/packages?destination=${dest.slug}`}>
                  View All
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.slice(0, 6).map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.heroImage || "/placeholder-package.jpg"}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {pkg.discountedPrice && (
                      <Badge className="absolute top-4 left-4 bg-destructive text-white">
                        {Math.round(
                          ((pkg.startingPrice - pkg.discountedPrice) /
                            pkg.startingPrice) *
                            100,
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {pkg.duration}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          From
                        </span>
                        <div className="flex items-center gap-2">
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
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(
                                    displayPrice,
                                    currency.code,
                                    currency.symbol,
                                  )}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(
                                    originalPrice,
                                    currency.code,
                                    currency.symbol,
                                  )}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(
                                  displayPrice,
                                  currency.code,
                                  currency.symbol,
                                )}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
