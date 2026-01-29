"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Users, MapPin, Star, Award } from "lucide-react";

const STATS = [
  {
    icon: Award,
    value: 30,
    suffix: "+",
    label: "Years Experience",
    description: "Decades of travel expertise",
  },
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Happy Travelers",
    description: "Satisfied customers worldwide",
  },
  {
    icon: MapPin,
    value: 100,
    suffix: "+",
    label: "Destinations",
    description: "Places to explore",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    label: "Average Rating",
    description: "Based on customer reviews",
  },
];

function AnimatedCounter({
  value,
  suffix,
  isInView,
}: {
  value: number;
  suffix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isInView]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
    }
    return num.toString();
  };

  return (
    <span>
      {value % 1 !== 0 ? count.toFixed(1) : formatNumber(count)}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-primary/20 relative overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center size-16 md:size-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <stat.icon className="size-8 md:size-10 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </div>
              <div className="text-white font-medium mb-1">{stat.label}</div>
              <div className="text-white/60 text-sm hidden md:block">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
