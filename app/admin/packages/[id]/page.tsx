"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload, MultiImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Hotel,
  Utensils,
  Car,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  images: string[];
}

interface HotelStay {
  name: string;
  location: string;
  starRating: number;
  nights: number;
  description: string;
}

interface Meal {
  type: string;
  description: string;
}

interface Transfer {
  type: string;
  description: string;
}

interface Sightseeing {
  name: string;
  description: string;
}

interface Policy {
  type: string;
  title: string;
  description: string;
}

interface Activity {
  name: string;
  description: string;
  price: string;
  isOptional: boolean;
}

interface PackagePrice {
  currencyId: string;
  price: string;
  discountedPrice: string;
}

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "ALL_MEALS"];
const POLICY_TYPES = ["CANCELLATION", "BOOKING", "PAYMENT", "GENERAL"];

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const packageId = id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    heroImage: "",
    images: [] as string[],
    duration: "",
    durationDays: 1,
    durationNights: 0,
    category: "DOMESTIC",
    isSpecial: false,
    isFeatured: false,
    isPopular: false,
    isActive: false,
    metaTitle: "",
    metaDescription: "",
    destinationIds: [] as string[],
  });

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [hotels, setHotels] = useState<HotelStay[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [sightseeing, setSightseeing] = useState<Sightseeing[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([""]);
  const [exclusions, setExclusions] = useState<string[]>([""]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [prices, setPrices] = useState<PackagePrice[]>([]);

  useEffect(() => {
    // Fetch destinations and currencies
    Promise.all([
      fetch("/api/admin/destinations").then((res) => res.json()),
      fetch("/api/admin/currencies").then((res) => res.json()),
      fetch(`/api/admin/packages/${packageId}`).then((res) => res.json()),
    ])
      .then(([destData, currData, pkgData]) => {
        setDestinations(destData.destinations || []);
        setCurrencies(currData.currencies || []);

        // Populate form with existing package data
        const pkg = pkgData.package;
        if (pkg) {
          setFormData({
            title: pkg.title,
            slug: pkg.slug,
            description: pkg.description,
            shortDescription: pkg.shortDescription || "",
            heroImage: pkg.heroImage || "",
            images: pkg.images || [],
            duration: pkg.duration,
            durationDays: pkg.durationDays,
            durationNights: pkg.durationNights,
            category: pkg.category,
            isSpecial: pkg.isSpecial,
            isFeatured: pkg.isFeatured,
            isPopular: pkg.isPopular,
            isActive: pkg.isActive,
            metaTitle: pkg.metaTitle || "",
            metaDescription: pkg.metaDescription || "",
            destinationIds: pkg.destinations.map((d: any) => d.destinationId),
          });

          setItinerary(pkg.itinerary || []);
          setHotels(pkg.hotels || []);
          setMeals(pkg.meals || []);
          setTransfers(pkg.transfers || []);
          setSightseeing(pkg.sightseeing || []);
          setInclusions(pkg.inclusions.map((i: any) => i.item) || [""]);
          setExclusions(pkg.exclusions.map((e: any) => e.item) || [""]);
          setPolicies(pkg.policies || []);
          setActivities(
            pkg.activities.map((a: any) => ({
              ...a,
              price: a.price ? String(a.price) : "",
            })) || [],
          );
          setPrices(
            pkg.prices.map((p: any) => ({
              currencyId: p.currencyId,
              price: String(p.price),
              discountedPrice: p.discountedPrice
                ? String(p.discountedPrice)
                : "",
            })) || [],
          );
        }
        setIsFetching(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load package data");
        setIsFetching(false);
      });
  }, [packageId]);

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: slugify(title) });
  };

  const updateDuration = (days: number, nights: number) => {
    setFormData({
      ...formData,
      durationDays: days,
      durationNights: nights,
      duration: `${days} Days / ${nights} Nights`,
    });
  };

  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: "", description: "", images: [] },
    ]);
  };

  const removeItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.day = i + 1));
    setItinerary(updated);
  };

  const updateItinerary = (
    index: number,
    field: keyof ItineraryDay,
    value: string | string[],
  ) => {
    const updated = [...itinerary];
    if (field === "images") {
      updated[index].images = value as string[];
    } else if (field === "day") {
      updated[index].day = parseInt(value as string);
    } else {
      updated[index][field] = value as string;
    }
    setItinerary(updated);
  };

  const addHotel = () =>
    setHotels([
      ...hotels,
      { name: "", location: "", starRating: 3, nights: 1, description: "" },
    ]);
  const removeHotel = (index: number) =>
    setHotels(hotels.filter((_, i) => i !== index));
  const updateHotel = (
    index: number,
    field: keyof HotelStay,
    value: string | number,
  ) => {
    const updated = [...hotels];
    if (field === "starRating" || field === "nights") {
      updated[index][field] = value as number;
    } else {
      updated[index][field] = value as string;
    }
    setHotels(updated);
  };

  const addMeal = () =>
    setMeals([...meals, { type: "BREAKFAST", description: "" }]);
  const removeMeal = (index: number) =>
    setMeals(meals.filter((_, i) => i !== index));

  const addTransfer = () =>
    setTransfers([...transfers, { type: "", description: "" }]);
  const removeTransfer = (index: number) =>
    setTransfers(transfers.filter((_, i) => i !== index));

  const addSightseeing = () =>
    setSightseeing([...sightseeing, { name: "", description: "" }]);
  const removeSightseeing = (index: number) =>
    setSightseeing(sightseeing.filter((_, i) => i !== index));

  const addInclusion = () => setInclusions([...inclusions, ""]);
  const removeInclusion = (index: number) =>
    setInclusions(inclusions.filter((_, i) => i !== index));
  const updateInclusion = (index: number, value: string) => {
    const updated = [...inclusions];
    updated[index] = value;
    setInclusions(updated);
  };

  const addExclusion = () => setExclusions([...exclusions, ""]);
  const removeExclusion = (index: number) =>
    setExclusions(exclusions.filter((_, i) => i !== index));
  const updateExclusion = (index: number, value: string) => {
    const updated = [...exclusions];
    updated[index] = value;
    setExclusions(updated);
  };

  const addPolicy = () =>
    setPolicies([
      ...policies,
      { type: "CANCELLATION", title: "", description: "" },
    ]);
  const removePolicy = (index: number) =>
    setPolicies(policies.filter((_, i) => i !== index));

  const addActivity = () =>
    setActivities([
      ...activities,
      { name: "", description: "", price: "", isOptional: true },
    ]);
  const removeActivity = (index: number) =>
    setActivities(activities.filter((_, i) => i !== index));

  const addPrice = () => {
    const usedCurrencies = prices.map((p) => p.currencyId);
    const availableCurrency = currencies.find(
      (c) => !usedCurrencies.includes(c.id),
    );
    if (availableCurrency) {
      setPrices([
        ...prices,
        { currencyId: availableCurrency.id, price: "", discountedPrice: "" },
      ]);
    } else {
      toast.error("All currencies have been added");
    }
  };

  const removePrice = (index: number) => {
    if (prices.length > 1) setPrices(prices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          itinerary,
          hotels,
          meals,
          transfers,
          sightseeing,
          inclusions: inclusions.filter(Boolean),
          exclusions: exclusions.filter(Boolean),
          policies,
          activities,
          prices: prices.filter((p) => p.price),
        }),
      });

      if (response.ok) {
        toast.success("Package updated successfully!");
        router.push("/admin/packages");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update package");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminShell>
      {isFetching ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/packages">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Package</h1>
              <p className="text-muted-foreground">
                Update package information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="accommodation">Stay</TabsTrigger>
                <TabsTrigger value="inclusions">Inc/Exc</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Package Title *</Label>
                            <Input
                              id="title"
                              placeholder="e.g., Kashmir Paradise Tour"
                              value={formData.title}
                              onChange={(e) =>
                                handleTitleChange(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                              id="slug"
                              placeholder="kashmir-paradise-tour"
                              value={formData.slug}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  slug: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Short Description</Label>
                          <Textarea
                            placeholder="Brief one-line description"
                            rows={2}
                            value={formData.shortDescription}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shortDescription: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Full Description *</Label>
                          <Textarea
                            placeholder="Detailed package description..."
                            rows={5}
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Days</Label>
                            <Input
                              type="number"
                              min="1"
                              value={formData.durationDays}
                              onChange={(e) =>
                                updateDuration(
                                  parseInt(e.target.value) || 1,
                                  formData.durationNights,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Nights</Label>
                            <Input
                              type="number"
                              min="0"
                              value={formData.durationNights}
                              onChange={(e) =>
                                updateDuration(
                                  formData.durationDays,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) =>
                                setFormData({ ...formData, category: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DOMESTIC">
                                  Domestic
                                </SelectItem>
                                <SelectItem value="INTERNATIONAL">
                                  International
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Images</CardTitle>
                        <CardDescription>
                          Upload hero image and gallery
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Hero Image *</Label>
                          <ImageUpload
                            value={formData.heroImage}
                            onChange={(url) =>
                              setFormData({ ...formData, heroImage: url })
                            }
                            onRemove={() =>
                              setFormData({ ...formData, heroImage: "" })
                            }
                            folder="packages"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gallery Images</Label>
                          <MultiImageUpload
                            values={formData.images}
                            onChange={(urls) =>
                              setFormData({ ...formData, images: urls })
                            }
                            folder="packages"
                            maxImages={10}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>SEO</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Meta Title</Label>
                          <Input
                            placeholder="SEO title"
                            value={formData.metaTitle}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                metaTitle: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Meta Description</Label>
                          <Textarea
                            placeholder="SEO description"
                            rows={3}
                            value={formData.metaDescription}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                metaDescription: e.target.value,
                              })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Publish</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Active</Label>
                          <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isActive: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Featured</Label>
                          <Switch
                            checked={formData.isFeatured}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isFeatured: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Popular</Label>
                          <Switch
                            checked={formData.isPopular}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isPopular: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Special Offer</Label>
                          <Switch
                            checked={formData.isSpecial}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isSpecial: checked })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Destinations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {destinations.map((dest) => (
                            <label
                              key={dest.id}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.destinationIds.includes(
                                  dest.id,
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      destinationIds: [
                                        ...formData.destinationIds,
                                        dest.id,
                                      ],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      destinationIds:
                                        formData.destinationIds.filter(
                                          (id) => id !== dest.id,
                                        ),
                                    });
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{dest.name}</span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Day-wise Itinerary</CardTitle>
                      <CardDescription>
                        Add detailed day-by-day plan
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={addItineraryDay}>
                      <Plus className="size-4 mr-2" />
                      Add Day
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="space-y-4">
                      {itinerary.map((day, index) => (
                        <AccordionItem
                          key={index}
                          value={`day-${index}`}
                          className="border rounded-lg px-4"
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                              <GripVertical className="size-4 text-muted-foreground" />
                              <span className="font-semibold">
                                Day {day.day}
                              </span>
                              {day.title && (
                                <span className="text-muted-foreground">
                                  - {day.title}
                                </span>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Day Title *</Label>
                              <Input
                                placeholder="e.g., Arrival in Srinagar"
                                value={day.title}
                                onChange={(e) =>
                                  updateItinerary(
                                    index,
                                    "title",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description *</Label>
                              <Textarea
                                placeholder="Detailed day description..."
                                rows={4}
                                value={day.description}
                                onChange={(e) =>
                                  updateItinerary(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Day Images</Label>
                              <MultiImageUpload
                                values={day.images}
                                onChange={(urls) =>
                                  updateItinerary(index, "images", urls)
                                }
                                folder="packages/itinerary"
                                maxImages={4}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeItineraryDay(index)}
                            >
                              <Trash2 className="size-4 mr-2" />
                              Remove Day
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    {itinerary.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No itinerary days added yet.</p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={addItineraryDay}
                        >
                          <Plus className="size-4 mr-2" />
                          Add First Day
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accommodation" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Hotel className="size-5" />
                          Hotels
                        </CardTitle>
                      </div>
                      <Button type="button" size="sm" onClick={addHotel}>
                        <Plus className="size-4 mr-2" />
                        Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {hotels.map((hotel, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">
                              Hotel {index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHotel(index)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Hotel Name"
                            value={hotel.name}
                            onChange={(e) =>
                              updateHotel(index, "name", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Location"
                            value={hotel.location}
                            onChange={(e) =>
                              updateHotel(index, "location", e.target.value)
                            }
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={String(hotel.starRating)}
                              onValueChange={(v) =>
                                updateHotel(index, "starRating", parseInt(v))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Stars" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <SelectItem key={s} value={String(s)}>
                                    {s} Star
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              placeholder="Nights"
                              min="1"
                              value={hotel.nights}
                              onChange={(e) =>
                                updateHotel(
                                  index,
                                  "nights",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                      {hotels.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No hotels added
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Utensils className="size-5" />
                          Meals
                        </CardTitle>
                      </div>
                      <Button type="button" size="sm" onClick={addMeal}>
                        <Plus className="size-4 mr-2" />
                        Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {meals.map((meal, index) => (
                        <div key={index} className="flex gap-2">
                          <Select
                            value={meal.type}
                            onValueChange={(v) => {
                              const updated = [...meals];
                              updated[index].type = v;
                              setMeals(updated);
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MEAL_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Description (optional)"
                            value={meal.description}
                            onChange={(e) => {
                              const updated = [...meals];
                              updated[index].description = e.target.value;
                              setMeals(updated);
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMeal(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                      {meals.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No meals added
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Car className="size-5" />
                          Transfers
                        </CardTitle>
                      </div>
                      <Button type="button" size="sm" onClick={addTransfer}>
                        <Plus className="size-4 mr-2" />
                        Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {transfers.map((transfer, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Type (e.g., Airport Transfer)"
                            value={transfer.type}
                            onChange={(e) => {
                              const updated = [...transfers];
                              updated[index].type = e.target.value;
                              setTransfers(updated);
                            }}
                            className="w-48"
                          />
                          <Input
                            placeholder="Description"
                            value={transfer.description}
                            onChange={(e) => {
                              const updated = [...transfers];
                              updated[index].description = e.target.value;
                              setTransfers(updated);
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTransfer(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                      {transfers.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No transfers added
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="size-5" />
                          Sightseeing
                        </CardTitle>
                      </div>
                      <Button type="button" size="sm" onClick={addSightseeing}>
                        <Plus className="size-4 mr-2" />
                        Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sightseeing.map((sight, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Place name"
                            value={sight.name}
                            onChange={(e) => {
                              const updated = [...sightseeing];
                              updated[index].name = e.target.value;
                              setSightseeing(updated);
                            }}
                            className="w-48"
                          />
                          <Input
                            placeholder="Description"
                            value={sight.description}
                            onChange={(e) => {
                              const updated = [...sightseeing];
                              updated[index].description = e.target.value;
                              setSightseeing(updated);
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSightseeing(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                      {sightseeing.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No sightseeing added
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="inclusions" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="size-5 text-green-500" />
                          Inclusions
                        </CardTitle>
                      </div>
                      <Button type="button" size="sm" onClick={addInclusion}>
                        <Plus className="size-4 mr-2" />
                        Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {inclusions.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="What's included..."
                            value={item}
                            onChange={(e) =>
                              updateInclusion(index, e.target.value)
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInclusion(index)}
                            disabled={inclusions.length === 1}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <XCircle className="size-5 text-red-500" />
                          Exclusions
                        </CardTitle>
                      </div>
                      <Button type="button" size="sm" onClick={addExclusion}>
                        <Plus className="size-4 mr-2" />
                        Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {exclusions.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="What's not included..."
                            value={item}
                            onChange={(e) =>
                              updateExclusion(index, e.target.value)
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExclusion(index)}
                            disabled={exclusions.length === 1}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="size-5" />
                        Extra Activities (Optional Add-ons)
                      </CardTitle>
                    </div>
                    <Button type="button" size="sm" onClick={addActivity}>
                      <Plus className="size-4 mr-2" />
                      Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activities.map((activity, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            Activity {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Activity name"
                            value={activity.name}
                            onChange={(e) => {
                              const updated = [...activities];
                              updated[index].name = e.target.value;
                              setActivities(updated);
                            }}
                          />
                          <Input
                            placeholder="Price (optional)"
                            value={activity.price}
                            onChange={(e) => {
                              const updated = [...activities];
                              updated[index].price = e.target.value;
                              setActivities(updated);
                            }}
                          />
                        </div>
                        <Textarea
                          placeholder="Description"
                          rows={2}
                          value={activity.description}
                          onChange={(e) => {
                            const updated = [...activities];
                            updated[index].description = e.target.value;
                            setActivities(updated);
                          }}
                        />
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No extra activities added
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="size-5" />
                        Policies
                      </CardTitle>
                      <CardDescription>
                        Add cancellation, booking, and payment policies
                      </CardDescription>
                    </div>
                    <Button type="button" size="sm" onClick={addPolicy}>
                      <Plus className="size-4 mr-2" />
                      Add Policy
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {policies.map((policy, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <Select
                            value={policy.type}
                            onValueChange={(v) => {
                              const updated = [...policies];
                              updated[index].type = v;
                              setPolicies(updated);
                            }}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {POLICY_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t} Policy
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePolicy(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Policy title"
                          value={policy.title}
                          onChange={(e) => {
                            const updated = [...policies];
                            updated[index].title = e.target.value;
                            setPolicies(updated);
                          }}
                        />
                        <Textarea
                          placeholder="Policy details..."
                          rows={3}
                          value={policy.description}
                          onChange={(e) => {
                            const updated = [...policies];
                            updated[index].description = e.target.value;
                            setPolicies(updated);
                          }}
                        />
                      </div>
                    ))}
                    {policies.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No policies added
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Pricing</CardTitle>
                      <CardDescription>
                        Set prices in different currencies
                      </CardDescription>
                    </div>
                    {prices.length < currencies.length && (
                      <Button type="button" size="sm" onClick={addPrice}>
                        <Plus className="size-4 mr-2" />
                        Add Currency
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prices.map((price, index) => {
                      const currency = currencies.find(
                        (c) => c.id === price.currencyId,
                      );
                      return (
                        <div
                          key={index}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <Select
                              value={price.currencyId}
                              onValueChange={(v) => {
                                const updated = [...prices];
                                updated[index].currencyId = v;
                                setPrices(updated);
                              }}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((c) => (
                                  <SelectItem
                                    key={c.id}
                                    value={c.id}
                                    disabled={prices.some(
                                      (p, i) =>
                                        i !== index && p.currencyId === c.id,
                                    )}
                                  >
                                    {c.code} - {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePrice(index)}
                              disabled={prices.length === 1}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Starting Price *</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  {currency?.symbol}
                                </span>
                                <Input
                                  type="number"
                                  placeholder="25000"
                                  className="pl-8"
                                  value={price.price}
                                  onChange={(e) => {
                                    const updated = [...prices];
                                    updated[index].price = e.target.value;
                                    setPrices(updated);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Discounted Price</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  {currency?.symbol}
                                </span>
                                <Input
                                  type="number"
                                  placeholder="22000"
                                  className="pl-8"
                                  value={price.discountedPrice}
                                  onChange={(e) => {
                                    const updated = [...prices];
                                    updated[index].discountedPrice =
                                      e.target.value;
                                    setPrices(updated);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {prices.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Add at least one currency to set pricing
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="sticky bottom-4 mt-6 flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="size-5" />
                    Update Package
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
