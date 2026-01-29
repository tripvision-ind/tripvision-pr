"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TOUR_TYPES = [
  {
    title: "Group Tours",
    description: "Join fellow travelers for shared adventures",
    image:
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80",
    href: "/packages?type=group",
    count: "50+ Tours",
  },
  {
    title: "Family Tours",
    description: "Create lasting memories with your loved ones",
    image:
      "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=600&q=80",
    href: "/packages?type=family",
    count: "30+ Tours",
  },
  {
    title: "Honeymoon",
    description: "Romantic getaways for newlyweds",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=80",
    href: "/packages?type=honeymoon",
    count: "40+ Tours",
  },
  {
    title: "Adventure",
    description: "Thrilling experiences for adrenaline seekers",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    href: "/packages?type=adventure",
    count: "25+ Tours",
  },
  {
    title: "Corporate",
    description: "Team building and business retreats",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
    href: "/packages?type=corporate",
    count: "20+ Tours",
  },
  {
    title: "Pilgrimage",
    description: "Spiritual journeys to sacred destinations",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
    href: "/packages?type=pilgrimage",
    count: "35+ Tours",
  },
];

export function TourTypes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div ref={ref}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Tour Categories
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Find Your Perfect{" "}
              <span className="text-primary">Travel Style</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Whether you're seeking adventure, relaxation, or cultural
              immersion, we have the perfect tour package for every type of
              traveler.
            </p>
          </motion.div>

          {/* Tour Types Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {TOUR_TYPES.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={type.href} className="group block h-full">
                  <div className="relative aspect-[4/3] md:aspect-[3/2] rounded-2xl overflow-hidden">
                    <Image
                      src={type.image}
                      alt={type.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                      <span className="text-primary text-xs md:text-sm font-medium mb-1">
                        {type.count}
                      </span>
                      <h3 className="text-white text-lg md:text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-white/70 text-xs md:text-sm hidden md:block">
                        {type.description}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute top-4 right-4 size-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="size-5 text-white" />
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
