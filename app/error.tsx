"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCcw, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
              <AlertCircle className="size-12 text-red-500" />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We encountered an error while loading this page. Please try again
              or go back to the homepage.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button onClick={() => reset()} className="gap-2">
              <RefreshCcw className="size-4" />
              Try Again
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="size-4" />
                Go Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
