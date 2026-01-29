"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const PARTNERS = [
  {
    name: "IATA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/IATA_logo.svg/2560px-IATA_logo.svg.png",
  },
  {
    name: "Ministry of Tourism",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ministry_of_Tourism_logo.svg/1200px-Ministry_of_Tourism_logo.svg.png",
  },
  {
    name: "TAAI",
    logo: "https://www.taai.in/images/logo.png",
  },
  {
    name: "TAFI",
    logo: "https://www.tafi.in/images/tafi-logo.png",
  },
  {
    name: "Incredible India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Incredible_India_logo.svg/2560px-Incredible_India_logo.svg.png",
  },
];

const PAYMENT_PARTNERS = [
  { name: "Visa", logo: "/partners/visa.svg" },
  { name: "Mastercard", logo: "/partners/mastercard.svg" },
  { name: "UPI", logo: "/partners/upi.svg" },
];

export function TrustBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 md:py-16 border-y bg-muted/30">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-muted-foreground text-sm md:text-base">
            Trusted by thousands • Recognized by industry leaders
          </p>
        </motion.div>

        {/* Logos Scroll */}
        <div className="relative overflow-hidden">
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {/* Placeholder partner logos - using text as fallback */}
            {[
              "IATA Certified",
              "Ministry of Tourism",
              "TAAI Member",
              "TAFI Approved",
              "Incredible India",
            ].map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-center px-6 py-3 bg-background rounded-lg border"
              >
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
