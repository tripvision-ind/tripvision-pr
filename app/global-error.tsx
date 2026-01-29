"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCcw, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1 }}
              className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-red-500 blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-500 blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
                    <AlertTriangle className="size-16 md:size-20 text-red-500" />
                  </div>
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
                  Something Went Wrong
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  We&apos;re sorry, but something unexpected happened. Our team
                  has been notified and is working on a fix.
                </p>
                {error.digest && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Error ID: {error.digest}
                  </p>
                )}
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button onClick={() => reset()} size="lg" className="gap-2">
                  <RefreshCcw className="size-4" />
                  Try Again
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/">
                    <Home className="size-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="gap-2">
                  <Link href="/contact">
                    <Mail className="size-4" />
                    Contact Support
                  </Link>
                </Button>
              </motion.div>

              {/* Help text */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
              >
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                  If the problem persists, please contact us at:
                </p>
                <Link
                  href="mailto:support@tripvision.com"
                  className="text-primary hover:underline font-medium"
                >
                  support@tripvision.com
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
