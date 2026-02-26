"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Users, MessageCircle, TrendingUp } from "lucide-react";

interface TestimonialsHeroProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  };
}

export function TestimonialsHero({ stats }: TestimonialsHeroProps) {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1920&q=80"
        alt="Traveler Stories"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
          >
            <MessageCircle className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Traveler Stories
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Discover authentic experiences from thousands of travelers who
            trusted us to create their dream vacations. Read their stories, see
            their ratings, and join our community of happy explorers.
          </motion.p>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {stats.totalReviews.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Happy Travelers</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {(
                (Object.values(stats.ratingDistribution).reduce(
                  (acc, curr) => acc + curr,
                  0,
                ) /
                  stats.totalReviews) *
                100
              ).toFixed(0)}
              %
            </div>
            <div className="text-gray-400 text-sm">Satisfaction</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {stats.ratingDistribution[5] || 0}
            </div>
            <div className="text-gray-400 text-sm">5-Star Reviews</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
