"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Star, ArrowRight, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { formatPrice } from "@/lib/utils";

interface Package {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  duration: string;
  startingPrice: number;
  discountedPrice?: number | null;
  category: string;
  destinations?: { destination: { name: string } }[];
  isSpecial?: boolean;
  prices?: {
    id: string;
    price: number;
    discountedPrice?: number | null;
    currency: {
      id: string;
      code: string;
      name: string;
      symbol: string;
      exchangeRate: number;
    };
  }[];
}

interface FeaturedPackagesProps {
  packages: Package[];
}

export function FeaturedPackages({ packages }: FeaturedPackagesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (packages.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div ref={ref}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12"
          >
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Featured Tours
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Most Popular <span className="text-primary">Tour Packages</span>
              </h2>
            </div>
            <Button asChild variant="outline" className="w-fit">
              <Link href="/packages">
                View All Packages
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {packages.slice(0, 6).map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/packages/${pkg.slug}`} className="group block">
                  <div className="bg-background rounded-2xl overflow-hidden border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={pkg.heroImage}
                        alt={pkg.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {pkg.isSpecial && (
                          <Badge className="bg-primary text-primary-foreground">
                            Special Offer
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-foreground"
                        >
                          {pkg.category === "DOMESTIC"
                            ? "India"
                            : "International"}
                        </Badge>
                      </div>

                      {/* Rating */}
                      {/* <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full text-sm">
                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">4.8</span>
                      </div> */}

                      {/* Price */}
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-baseline gap-2">
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

                            return (
                              <>
                                <span className="text-white text-2xl font-bold">
                                  {formatPrice(
                                    displayPrice,
                                    currency.code,
                                    currency.symbol,
                                  )}
                                </span>
                                {hasDiscount && (
                                  <span className="text-white/70 text-sm line-through">
                                    {formatPrice(
                                      originalPrice,
                                      currency.code,
                                      currency.symbol,
                                    )}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <span className="text-white/80 text-sm">
                          per person
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {pkg.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-4" />
                          <span>{pkg.duration}</span>
                        </div>
                        {pkg.destinations && pkg.destinations.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-4" />
                            <span className="line-clamp-1">
                              {pkg.destinations
                                .slice(0, 2)
                                .map((d) => d.destination.name)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
