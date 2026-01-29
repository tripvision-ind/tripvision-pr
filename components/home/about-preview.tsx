"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, ABOUT } from "@/lib/constants";

const HIGHLIGHTS = [
  "Customized travel packages tailored to your needs",
  "Expert local guides with in-depth knowledge",
  "24/7 customer support during your trip",
  "Best price guarantee with no hidden costs",
  "Safe and secure booking process",
  "Hassle-free visa assistance",
];

export function AboutPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80"
                  alt="Travel adventure"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Image */}
              <div className="absolute -bottom-8 -right-8 md:-right-12 w-48 md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-background">
                <Image
                  src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80"
                  alt="Happy travelers"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Experience Badge */}
              <div className="absolute -top-4 -left-4 md:-left-8 bg-primary text-primary-foreground px-6 py-4 rounded-2xl shadow-lg">
                <div className="text-3xl md:text-4xl font-bold">
                  {BRAND.experience}
                </div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              About {BRAND.name}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your Trusted Partner for{" "}
              <span className="text-primary">Unforgettable Journeys</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              {ABOUT.short}
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {HIGHLIGHTS.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="size-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
