"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  avatar?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  location?: string | null;
  tripType?: string | null;
}

interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
  reviews: Review[];
}

export function ReviewsSection({
  title = "What Our Travelers Say",
  subtitle = "Real experiences from real travelers",
  reviews,
}: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <Quote className="size-8 text-primary/20 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Title */}
              {review.title && (
                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
              )}

              {/* Content */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">
                {review.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={review.avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(review.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {review.tripType && <span>{review.tripType}</span>}
                    {review.tripType && review.location && <span> • </span>}
                    {review.location && <span>{review.location}</span>}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
