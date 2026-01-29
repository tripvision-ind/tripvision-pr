"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Hotel,
  Utensils,
  Car,
  Camera,
  Check,
  X,
  FileText,
  Sparkles,
  Star,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PackageDetailsProps {
  pkg: {
    description: string;
    itinerary: {
      id: string;
      day: number;
      title: string;
      description: string;
      images: string[];
    }[];
    hotels: {
      id: string;
      name: string;
      location: string;
      starRating: number | null;
      nights: number;
      description: string | null;
    }[];
    meals: {
      id: string;
      type: string;
      description: string | null;
    }[];
    transfers: {
      id: string;
      type: string;
      description: string | null;
    }[];
    sightseeing: {
      id: string;
      name: string;
      description: string | null;
    }[];
    inclusions: {
      id: string;
      item: string;
    }[];
    exclusions: {
      id: string;
      item: string;
    }[];
    policies: {
      id: string;
      type: string;
      title: string;
      description: string;
    }[];
    activities: {
      id: string;
      name: string;
      description: string | null;
      price: number | null;
      isOptional: boolean;
    }[];
    prices: {
      id: string;
      price: number;
      discountedPrice?: number | null;
      currency: {
        id: string;
        code: string;
        name: string;
        symbol: string;
        exchangeRate: number;
      };
    }[];
  };
}

export function PackageDetails({ pkg }: PackageDetailsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1 mb-6">
        <TabsTrigger value="overview" className="shrink-0">
          Overview
        </TabsTrigger>
        <TabsTrigger value="itinerary" className="shrink-0">
          Itinerary
        </TabsTrigger>
        <TabsTrigger value="hotels" className="shrink-0">
          Hotels
        </TabsTrigger>
        <TabsTrigger value="inclusions" className="shrink-0">
          Inclusions
        </TabsTrigger>
        <TabsTrigger value="policies" className="shrink-0">
          Policies
        </TabsTrigger>
        {pkg.activities.length > 0 && (
          <TabsTrigger value="activities" className="shrink-0">
            Activities
          </TabsTrigger>
        )}
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview" className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">About This Package</h2>
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: pkg.description }}
          />
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meals */}
          {pkg.meals.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="size-5 text-primary" />
                <h3 className="font-semibold">Meals Included</h3>
              </div>
              <ul className="space-y-2">
                {pkg.meals.map((meal) => (
                  <li key={meal.id} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-green-500" />
                    {meal.type.replace("_", " ")}
                    {meal.description && (
                      <span className="text-muted-foreground">
                        - {meal.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transfers */}
          {pkg.transfers.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Car className="size-5 text-primary" />
                <h3 className="font-semibold">Transfers</h3>
              </div>
              <ul className="space-y-2">
                {pkg.transfers.map((transfer) => (
                  <li
                    key={transfer.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="size-4 text-green-500" />
                    {transfer.type}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sightseeing */}
          {pkg.sightseeing.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="size-5 text-primary" />
                <h3 className="font-semibold">Sightseeing</h3>
              </div>
              <ul className="space-y-2">
                {pkg.sightseeing.slice(0, 5).map((sight) => (
                  <li
                    key={sight.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="size-4 text-green-500" />
                    {sight.name}
                  </li>
                ))}
                {pkg.sightseeing.length > 5 && (
                  <li className="text-sm text-primary">
                    +{pkg.sightseeing.length - 5} more attractions
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Itinerary */}
      <TabsContent value="itinerary">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <CalendarDays className="size-6 text-primary" />
          Day-wise Itinerary
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {pkg.itinerary.map((day) => (
            <AccordionItem key={day.id} value={day.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <span className="shrink-0 size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {day.day}
                  </span>
                  <span className="font-semibold">{day.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-14 space-y-4">
                  <p className="text-muted-foreground">{day.description}</p>
                  {day.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {day.images.map((image, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`Day ${day.day} - ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      {/* Hotels */}
      <TabsContent value="hotels">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Hotel className="size-6 text-primary" />
          Hotel Accommodations
        </h2>
        <div className="grid gap-4">
          {pkg.hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-card border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{hotel.name}</h3>
                  {hotel.starRating && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-3.5 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {hotel.location}
                </p>
                {hotel.description && (
                  <p className="text-sm mt-2">{hotel.description}</p>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0">
                {hotel.nights} {hotel.nights === 1 ? "Night" : "Nights"}
              </Badge>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Inclusions & Exclusions */}
      <TabsContent value="inclusions">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Inclusions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600">
              <Check className="size-5" />
              Inclusions
            </h2>
            <ul className="space-y-3">
              {pkg.inclusions.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{item.item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
              <X className="size-5" />
              Exclusions
            </h2>
            <ul className="space-y-3">
              {pkg.exclusions.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <X className="size-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{item.item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TabsContent>

      {/* Policies */}
      <TabsContent value="policies">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="size-6 text-primary" />
          Policies
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {pkg.policies.map((policy) => (
            <AccordionItem key={policy.id} value={policy.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{policy.type}</Badge>
                  <span className="font-semibold">{policy.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: policy.description }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      {/* Optional Activities */}
      {pkg.activities.length > 0 && (
        <TabsContent value="activities">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Sparkles className="size-6 text-primary" />
            Optional Activities
          </h2>
          <div className="grid gap-4">
            {pkg.activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-card border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold mb-1">{activity.name}</h3>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                </div>
                {activity.price && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      {(() => {
                        const packagePrice = pkg.prices?.[0];
                        const currency = packagePrice?.currency || {
                          code: "INR",
                          symbol: "₹",
                        };
                        return formatPrice(
                          activity.price,
                          currency.code,
                          currency.symbol,
                        );
                      })()}
                    </span>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
