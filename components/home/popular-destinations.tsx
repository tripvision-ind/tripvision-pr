"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Destination {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  country: string;
  shortDescription?: string | null;
  _count?: {
    packages: number;
  };
}

interface PopularDestinationsProps {
  title?: string;
  subtitle?: string;
  destinations: Destination[];
}

export function PopularDestinations({
  title = "Popular Destinations",
  subtitle = "Explore our most sought-after travel destinations",
  destinations,
}: PopularDestinationsProps) {
  if (destinations.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.slice(0, 8).map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/destinations/${destination.slug}`}
                className="group block relative rounded-2xl overflow-hidden aspect-[4/5]"
              >
                {/* Image */}
                <Image
                  src={destination.heroImage || "/placeholder-destination.jpg"}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-1 text-primary text-sm mb-2">
                    <MapPin className="size-3.5" />
                    {destination.country}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {destination.name}
                  </h3>
                  {destination._count && (
                    <p className="text-gray-300 text-sm">
                      {destination._count.packages} packages available
                    </p>
                  )}
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 size-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="size-5 text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/destinations">
              View All Destinations
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
