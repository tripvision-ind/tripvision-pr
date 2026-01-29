"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Users,
  Shield,
  Award,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { DURATION_OPTIONS, MONTH_OPTIONS, BRAND } from "@/lib/constants";

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    title: "Explore the Majestic",
    highlight: "Himalayas",
    subtitle: "Experience breathtaking mountain peaks and serene valleys",
    location: "Kashmir, India",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80",
    title: "Discover the Magic of",
    highlight: "Dubai",
    subtitle: "Luxury meets adventure in the city of dreams",
    location: "United Arab Emirates",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    title: "Paradise Awaits in",
    highlight: "Maldives",
    subtitle: "Crystal clear waters and pristine white beaches",
    location: "Maldives Islands",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80",
    title: "Ancient Wonders of",
    highlight: "Kerala",
    subtitle: "God's own country with backwaters and tea gardens",
    location: "Kerala, India",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
    title: "Tropical Beauty of",
    highlight: "Bali",
    subtitle: "Temples, rice terraces, and vibrant culture",
    location: "Bali, Indonesia",
  },
];

// Fallback destinations if API fails
const FALLBACK_DESTINATIONS = [
  "Kashmir",
  "Goa",
  "Kerala",
  "Rajasthan",
  "Dubai",
  "Thailand",
  "Maldives",
  "Bali",
];

interface Destination {
  id: string;
  name: string;
  slug: string;
}

export function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [month, setMonth] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);

  // Fetch destinations from API
  useEffect(() => {
    setMounted(true);
    async function fetchDestinations() {
      try {
        const response = await fetch("/api/destinations");
        if (response.ok) {
          const data = await response.json();
          setDestinations(data);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setIsLoadingDestinations(false);
      }
    }
    fetchDestinations();
  }, []);

  const destinationOptions =
    destinations.length > 0
      ? destinations.map((d) => ({ value: d.slug, label: d.name }))
      : FALLBACK_DESTINATIONS.map((d) => ({
          value: d.toLowerCase(),
          label: d,
        }));

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (duration) params.set("duration", duration);
    if (month) params.set("month", month);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[100svh] md:min-h-[90vh] lg:min-h-[85vh] flex flex-col">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 py-8 md:py-0">
          <div className="max-w-6xl mx-auto">
            {/* Hero Text */}
            <div className="text-center mb-8 md:mb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-sm mb-6"
                  >
                    <MapPin className="size-4 text-primary" />
                    {HERO_SLIDES[currentSlide].location}
                  </motion.div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
                    {HERO_SLIDES[currentSlide].title}
                    <br />
                    <span className="text-primary">
                      {HERO_SLIDES[currentSlide].highlight}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6">
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Trust Badges - Mobile */}
              <div className="flex flex-wrap justify-center gap-4 mb-8 md:hidden">
                {[
                  { icon: Award, text: "30+ Years" },
                  { icon: Users, text: "50K+ Travelers" },
                  { icon: Shield, text: "100% Safe" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-white/80 text-xs"
                  >
                    <item.icon className="size-4 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                {/* Destination - Searchable Combobox */}
                <div className="space-y-1.5">
                  <label className="text-white text-xs font-medium flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    Where to?
                  </label>
                  <Popover
                    open={destinationOpen}
                    onOpenChange={setDestinationOpen}
                  >
                    <PopoverTrigger asChild>
                      <button
                        role="combobox"
                        aria-expanded={destinationOpen}
                        className="w-full h-12 flex items-center justify-between px-4 bg-white/10 border border-white/20 text-white rounded-xl text-sm hover:bg-white/15 transition-colors"
                      >
                        {destination
                          ? destinationOptions.find(
                              (d) => d.value === destination,
                            )?.label
                          : "Select destination"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search destination..." />
                        <CommandList>
                          <CommandEmpty>No destination found.</CommandEmpty>
                          <CommandGroup>
                            {destinationOptions.map((dest) => (
                              <CommandItem
                                key={dest.value}
                                value={dest.label}
                                onSelect={() => {
                                  setDestination(dest.value);
                                  setDestinationOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    destination === dest.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {dest.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-white text-xs font-medium flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    Duration
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="w-full !h-12 px-4 bg-white/10 border-white/20 text-white rounded-xl text-sm [&>span]:text-white">
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Month */}
                <div className="space-y-1.5">
                  <label className="text-white text-xs font-medium flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary" />
                    Travel Month
                  </label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-full !h-12 px-4 bg-white/10 border-white/20 text-white rounded-xl text-sm [&>span]:text-white">
                      <SelectValue placeholder="When?" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="w-full h-12 text-sm font-semibold rounded-xl shadow-lg shadow-primary/30"
                  >
                    <Search className="size-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              {mounted && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-white/60 text-xs mb-2">Popular:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {destinationOptions.slice(0, 6).map((dest) => (
                      <button
                        key={dest.value}
                        onClick={() => setDestination(dest.value)}
                        className={cn(
                          "px-2.5 py-1 text-xs rounded-full border transition-all",
                          destination === dest.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-white/5 text-white/80 border-white/20 hover:bg-white/10",
                        )}
                      >
                        {dest.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="relative z-10 pb-6 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === currentSlide
                      ? "w-8 bg-primary"
                      : "w-1.5 bg-white/40 hover:bg-white/60",
                  )}
                />
              ))}
            </div>

            {/* Slide Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  prevSlide();
                  setIsAutoPlaying(false);
                }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={cn(
                  "p-2 rounded-full backdrop-blur-sm text-white transition-colors",
                  isAutoPlaying
                    ? "bg-primary/80 hover:bg-primary"
                    : "bg-white/10 hover:bg-white/20",
                )}
              >
                <Play
                  className={cn("size-5", isAutoPlaying && "fill-current")}
                />
              </button>
              <button
                onClick={() => {
                  nextSlide();
                  setIsAutoPlaying(false);
                }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Desktop Stats */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { value: "30+", label: "Years" },
                { value: "50K+", label: "Travelers" },
                { value: "500+", label: "Tours" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
