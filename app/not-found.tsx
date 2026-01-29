"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <span className="text-[150px] md:text-[200px] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
                404
              </span>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-primary text-primary-foreground p-4 rounded-full">
                  <Compass className="size-12 md:size-16" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Oops! Lost in Paradise?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              The destination you&apos;re looking for seems to have wandered off
              the map. Let us help you find your way back.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/destinations">
                <MapPin className="size-4" />
                Explore Destinations
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="gap-2">
              <Link href="/contact">
                <Search className="size-4" />
                Contact Us
              </Link>
            </Button>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Popular destinations to explore:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                "Kashmir",
                "Kerala",
                "Goa",
                "Dubai",
                "Thailand",
                "Maldives",
              ].map((dest) => (
                <Link
                  key={dest}
                  href={`/destinations/${dest.toLowerCase()}`}
                  className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
                >
                  {dest}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
