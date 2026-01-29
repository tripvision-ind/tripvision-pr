"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  destinations: {
    destination: {
      name: string;
    };
  }[];
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

interface SpecialPackagesProps {
  title?: string;
  subtitle?: string;
  packages: Package[];
  type?: "special" | "domestic" | "international";
}

export function SpecialPackages({
  title = "Special Packages",
  subtitle = "Handpicked deals for unforgettable experiences",
  packages,
  type = "special",
}: SpecialPackagesProps) {
  if (packages.length === 0) return null;

  const viewAllHref =
    type === "domestic"
      ? "/packages/domestic"
      : type === "international"
        ? "/packages/international"
        : "/packages?special=true";

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={viewAllHref}>
              View All
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.slice(0, 6).map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/packages/${pkg.slug}`}
                className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
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
                  <Badge variant="secondary" className="absolute top-4 right-4">
                    {pkg.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {pkg.duration}
                    </span>
                    {pkg.destinations[0] && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        {pkg.destinations[0].destination.name}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Starting from
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
                    {/* <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="size-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div> */}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
