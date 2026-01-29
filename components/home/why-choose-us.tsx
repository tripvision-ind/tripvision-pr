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
    icon: Shield,
    title: "100% Safe Travel",
    description:
      "Your safety is our priority. All our tours are thoroughly vetted and insured.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Award,
    title: "30+ Years Experience",
    description:
      "Three decades of expertise in crafting unforgettable travel experiences.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Expert Tour Guides",
    description:
      "Knowledgeable local guides who bring destinations to life with stories.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Service",
    description:
      "Customized itineraries tailored to your preferences and travel style.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Clock,
    title: "Flexible Booking",
    description:
      "Easy booking process with flexible cancellation and rescheduling options.",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Round-the-clock assistance before, during, and after your trip.",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: MapPin,
    title: "Handpicked Destinations",
    description:
      "Carefully selected locations offering the best experiences and value.",
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    icon: Wallet,
    title: "Best Price Guarantee",
    description:
      "Competitive pricing with no hidden costs. Get the best value for your trip.",
    color: "bg-indigo-500/10 text-indigo-500",
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
