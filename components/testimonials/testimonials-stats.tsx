"use client";

import { motion } from "framer-motion";
import { Star, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TestimonialsStatsProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  };
}

export function TestimonialsStats({ stats }: TestimonialsStatsProps) {
  const ratingPercentages = Object.entries(stats.ratingDistribution)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage:
        stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0,
    }));

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Review Insights
            </h2>
            <p className="text-muted-foreground">
              See what our customers are saying with detailed rating breakdown
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rating Summary */}
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Overall Rating
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(stats.averageRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Based on {stats.totalReviews.toLocaleString()} reviews
                </p>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Rating Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratingPercentages.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <div className="text-sm text-muted-foreground w-20 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
