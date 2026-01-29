"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Quote, Search, Filter, Calendar, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials, formatDate } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  email?: string | null;
  avatar?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  location?: string | null;
  tripType?: string | null;
  createdAt: Date;
}

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentFilters: {
    rating?: string;
    tripType?: string;
  };
}

const tripTypes = [
  "Family Trip",
  "Honeymoon",
  "Solo Travel",
  "Friends Getaway",
  "Business Trip",
  "Adventure",
  "Pilgrimage",
  "Photography Tour",
  "Wildlife Safari",
  "Cultural Tour",
];

export function TestimonialsGrid({
  testimonials,
  total,
  totalPages,
  currentPage,
  currentFilters,
}: TestimonialsGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to first page when filtering
    params.delete("page");

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-card rounded-2xl p-6 border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Rating Filter */}
          <Select
            value={currentFilters.rating || "all"}
            onValueChange={(value) =>
              updateFilter("rating", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
            </SelectContent>
          </Select>

          {/* Trip Type Filter */}
          <Select
            value={currentFilters.tripType || "all"}
            onValueChange={(value) =>
              updateFilter("tripType", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by trip type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trip Types</SelectItem>
              {tripTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Customer Testimonials</h3>
          <p className="text-muted-foreground">
            Showing {testimonials.length} of {total.toLocaleString()} reviews
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No testimonials found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Title */}
                  {testimonial.title && (
                    <h4 className="font-semibold text-lg mb-3">
                      {testimonial.title}
                    </h4>
                  )}

                  {/* Content */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-6">
                    {testimonial.content}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-start gap-3">
                    <Avatar className="shrink-0">
                      <AvatarImage src={testimonial.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(testimonial.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {testimonial.tripType && (
                          <Badge variant="outline" className="text-xs">
                            {testimonial.tripType}
                          </Badge>
                        )}
                        {testimonial.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {testimonial.location}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(testimonial.createdAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;

              if (page < 1 || page > totalPages) return null;

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  size="icon"
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
