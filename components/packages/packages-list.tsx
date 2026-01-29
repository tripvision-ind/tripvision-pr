"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
