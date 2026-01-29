"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DURATION_OPTIONS } from "@/lib/constants";
import {
  X,
  Filter,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface FilterOptions {
  destinations: Destination[];
  categories: string[];
  durationOptions: Array<{ label: string; value: string }>;
  priceRanges: Array<{ label: string; value: string }>;
  priceRange: { min: number; max: number };
}

interface PackagesFilterProps {
  destinations: Destination[];
  currentFilters: {
    destination?: string;
    duration?: string;
    category?: string;
    search?: string;
    priceRange?: string;
  };
}

export function PackagesFilter({
  destinations,
  currentFilters,
}: PackagesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState(currentFilters.search || "");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/packages/filters");
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data);
      }
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "" && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Always delete page when filtering
    params.delete("page");

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", localSearch.trim() || null);
  };

  const clearFilters = () => {
    setLocalSearch("");
    router.replace(pathname);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.values(currentFilters).filter(Boolean).length;
  }, [currentFilters]);

  const hasFilters = activeFiltersCount > 0;

  if (loading) {
    return (
      <Card className="sticky top-24">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8"
            >
              <Filter className="h-3 w-3 mr-1" />
              {isExpanded ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-5", !isExpanded && "hidden")}>
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Packages
          </Label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              placeholder="Search by title, destination..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1 w-full"
            />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          {currentFilters.search && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Searching for:</span>
              <Badge variant="outline">{currentFilters.search}</Badge>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Category
          </Label>
          <Select
            value={currentFilters.category || "all"}
            onValueChange={(value) =>
              updateFilter("category", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="DOMESTIC">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Domestic
                </div>
              </SelectItem>
              <SelectItem value="INTERNATIONAL">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  International
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Destination
          </Label>
          <Select
            value={currentFilters.destination || "all"}
            onValueChange={(value) =>
              updateFilter("destination", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Destinations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              {destinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.slug}>
                  {dest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Duration
          </Label>
          <Select
            value={currentFilters.duration || "all"}
            onValueChange={(value) =>
              updateFilter("duration", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Duration</SelectItem>
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        {filterOptions && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Range
            </Label>
            <Select
              value={currentFilters.priceRange || "all"}
              onValueChange={(value) =>
                updateFilter("priceRange", value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                {filterOptions.priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasFilters && (
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {currentFilters.category && (
                  <Badge variant="secondary" className="text-xs">
                    Category: {currentFilters.category}
                    <button
                      onClick={() => updateFilter("category", null)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {currentFilters.destination && (
                  <Badge variant="secondary" className="text-xs">
                    Destination:{" "}
                    {
                      destinations.find(
                        (d) => d.slug === currentFilters.destination,
                      )?.name
                    }
                    <button
                      onClick={() => updateFilter("destination", null)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {currentFilters.duration && (
                  <Badge variant="secondary" className="text-xs">
                    Duration:{" "}
                    {
                      DURATION_OPTIONS.find(
                        (d) => d.value === currentFilters.duration,
                      )?.label
                    }
                    <button
                      onClick={() => updateFilter("duration", null)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {currentFilters.priceRange && filterOptions && (
                  <Badge variant="secondary" className="text-xs">
                    Price:{" "}
                    {
                      filterOptions.priceRanges.find(
                        (p) => p.value === currentFilters.priceRange,
                      )?.label
                    }
                    <button
                      onClick={() => updateFilter("priceRange", null)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {currentFilters.search && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {currentFilters.search}
                    <button
                      onClick={() => {
                        setLocalSearch("");
                        updateFilter("search", null);
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
