"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface PackageDate {
  id: string;
  startDate: string;
  endDate?: string | null;
  label?: string | null;
}

interface Package {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  duration: string;
  startingPrice: number;
  discountedPrice?: number | null;
  category: string;
  priceLabel?: string | null;
  destinations: {
    destination: {
      name: string;
      slug: string;
    };
  }[];
  prices: {
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
  dates?: PackageDate[];
}

interface PackagesListProps {
  packages: Package[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export function PackagesList({
  packages,
  total,
  totalPages,
  currentPage,
}: PackagesListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (packages.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-2">No packages found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters to find more packages.
        </p>
        <Button asChild variant="outline">
          <Link href="/packages">View All Packages</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {packages.length} of {total} packages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
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
                {pkg.discountedPrice && pkg.startingPrice > 0 && (
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

                {(() => {
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
                      packagePrice.discountedPrice < packagePrice.price) ||
                    (pkg.discountedPrice &&
                      pkg.discountedPrice < pkg.startingPrice);

                  const hasPrice = displayPrice > 0;

                  return hasPrice ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Starting from
                        </span>
                        <div className="flex items-center gap-2">
                          {hasDiscount ? (
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
                          )}
                        </div>
                        {pkg.priceLabel && (
                          <span className="text-xs text-muted-foreground">
                            {pkg.priceLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Available Dates */}
                {pkg.dates && pkg.dates.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mb-2">
                      <CalendarDays className="size-3.5" />
                      <span className="font-semibold">Available Dates</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.dates.slice(0, 3).map((d, i) => {
                        const start = new Date(d.startDate);
                        const end = d.endDate ? new Date(d.endDate) : null;
                        const fmt: Intl.DateTimeFormatOptions = {
                          day: "numeric",
                          month: "short",
                        };
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400"
                          >
                            <CalendarDays className="size-3 shrink-0" />
                            {start.toLocaleDateString("en-IN", fmt)}
                            {end &&
                              ` – ${end.toLocaleDateString("en-IN", fmt)}`}
                            {d.label && (
                              <span className="ml-0.5 text-amber-500 font-normal">
                                · {d.label}
                              </span>
                            )}
                          </span>
                        );
                      })}
                      {pkg.dates.length > 3 && (
                        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-500">
                          +{pkg.dates.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => goToPage(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
