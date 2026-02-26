"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Users,
  Award,
  HeartHandshake,
  Clock,
  Headphones,
  MapPin,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: HeartHandshake,
    title: "Professional & Personalised Service",
    description:
      "Tailored itineraries crafted to match your unique preferences, travel style, and budget requirements.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Award,
    title: "India's Leading Travel Agency",
    description:
      "A trusted name in Indian travel with decades of expertise booking dream vacations across the country.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Wallet,
    title: "Best Holiday Deals, Always",
    description:
      "Competitive pricing, exclusive deals, and the best value packages — no hidden costs, ever.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Book with complete confidence. Our platform ensures safe, encrypted, and hassle-free payment processing.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description:
      "Round-the-clock assistance before, during, and after your trip for complete peace of mind.",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: Users,
    title: "Expert Local Guides",
    description:
      "Knowledgeable guides who bring destinations to life with authentic local stories and experiences.",
    color: "bg-orange-500/10 text-orange-500",
  },
];

export function WhyChooseUs() {
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
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Travel with <span className="text-primary">Confidence</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              We're committed to making your travel dreams come true with
              exceptional service, expert planning, and unforgettable
              experiences.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-background rounded-2xl p-6 h-full border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={cn(
                      "size-14 rounded-xl flex items-center justify-center mb-4",
                      feature.color,
                    )}
                  >
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
