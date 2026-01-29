"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABOUT } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/cta-pattern.svg')] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
              Start Your Journey
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Create Your
            <span className="text-primary"> Dream Vacation?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            {ABOUT.cta}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="font-semibold">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-brand-dark"
            >
              <Link href="/packages">Explore Packages</Link>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-12 border-t border-white/10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "100%", label: "Secure Booking" },
                { value: "24/7", label: "Customer Support" },
                { value: "Best", label: "Price Guarantee" },
                { value: "Free", label: "Cancellation" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {item.value}
                  </div>
                  <div className="text-gray-400 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
