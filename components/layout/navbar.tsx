"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Plane,
  Globe,
  BookOpen,
  Info,
  MessageCircle,
  HelpCircle,
  Briefcase,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND, CONTACT } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: Globe },
  {
    label: "India Holidays",
    href: "/packages?category=domestic",
    icon: MapPin,
  },
  {
    label: "International",
    href: "/packages?category=international",
    icon: Plane,
  },
  { label: "Destinations", href: "/destinations", icon: MapPin },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: MessageCircle },
  { label: "Testimonials", href: "/testimonials", icon: Star },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
];

function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if link is active - using searchParams for accurate detection
  const isLinkActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";

    const [basePath, query] = href.split("?");

    // If no query params in link
    if (!query) {
      return pathname === basePath || pathname.startsWith(basePath + "/");
    }

    // If link has query params (like category=domestic)
    const linkParams = new URLSearchParams(query);
    const currentCategory = searchParams.get("category");
    const linkCategory = linkParams.get("category");

    // For /packages routes with category
    if (basePath === "/packages" && pathname === "/packages") {
      return currentCategory === linkCategory;
    }

    return false;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const mainLinks = NAV_LINKS.slice(0, 7);
  const moreLinks = NAV_LINKS.slice(7);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-gray-950/95 backdrop-blur-lg shadow-md"
          : "bg-gray-950",
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Bigger, No Tagline */}
          <Link href="/" className="flex items-center shrink-0 relative z-[60]">
            <div className="relative h-12 w-32 lg:h-14 lg:w-40">
              <Image
                src="/vision.png"
                alt={BRAND.name}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {moreLinks.length > 0 && (
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1 transition-all duration-200">
                  More
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-xl border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <div className="py-2">
                    {moreLinks.map((link) => {
                      const isActive = isLinkActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-gray-300 hover:text-white hover:bg-white/10",
                          )}
                        >
                          <link.icon className="size-4" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${CONTACT.primaryPhone}`}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Phone className="size-4" />
              <span className="hidden xl:inline">{CONTACT.primaryPhone}</span>
            </a>
            <Button
              asChild
              size="lg"
              className="font-semibold rounded-xl shadow-lg shadow-primary/25"
            >
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={cn(
              "lg:hidden relative z-[100] p-2 rounded-lg text-white hover:bg-white/10 transition-colors",
              isOpen && "opacity-0 pointer-events-none",
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="size-6" />
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-gray-950 z-[95] lg:hidden shadow-2xl border-l border-gray-800"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div className="relative h-10 w-28">
                    <Image
                      src="/vision.png"
                      alt={BRAND.name}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="flex flex-col h-[calc(100%-73px)]">
                <nav className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-1">
                    {NAV_LINKS.map((link, index) => {
                      const isActive = isLinkActive(link.href);
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                              isActive
                                ? "text-primary bg-primary/10"
                                : "text-white hover:bg-white/10",
                            )}
                          >
                            <link.icon className="size-5" />
                            {link.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="p-4 space-y-3 border-t border-gray-800">
                  <a
                    href={`tel:${CONTACT.primaryPhone}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 text-white font-medium"
                  >
                    <Phone className="size-5" />
                    Call: {CONTACT.primaryPhone}
                  </a>
                  <Button
                    asChild
                    size="lg"
                    className="w-full font-semibold rounded-xl"
                  >
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      Get Free Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

// Export wrapped with Suspense for static page generation
export function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  );
}

// Simple fallback navbar during loading
function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-950">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative h-12 w-32 lg:h-14 lg:w-40">
              <Image
                src="/vision.png"
                alt={BRAND.name}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.slice(0, 7).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="font-semibold rounded-xl shadow-lg shadow-primary/25"
            >
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
          <div className="lg:hidden p-2">
            <Menu className="size-6 text-white" />
          </div>
        </nav>
      </div>
    </header>
  );
}
