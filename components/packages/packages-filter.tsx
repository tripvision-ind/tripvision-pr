"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DURATION_OPTIONS } from "@/lib/constants";
import { X } from "lucide-react";

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface PackagesFilterProps {
  destinations: Destination[];
  currencies: Currency[];
  currentFilters: {
    destination?: string;
    duration?: string;
    currency?: string;
    priceRange?: string;
  };
}

export function PackagesFilter({
  destinations,
  currencies,
  currentFilters,
}: PackagesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getPriceRangeOptions = (currencyCode?: string) => {
    const selectedCurrency = currencies.find((c) => c.code === currencyCode);
    const symbol = selectedCurrency?.symbol || "₹";

    return [
      { value: "0-25000", label: `Under ${symbol}25,000` },
      { value: "25000-50000", label: `${symbol}25,000 - ${symbol}50,000` },
      { value: "50000-100000", label: `${symbol}50,000 - ${symbol}1,00,000` },
      {
        value: "100000-200000",
        label: `${symbol}1,00,000 - ${symbol}2,00,000`,
      },
      {
        value: "200000-500000",
        label: `${symbol}2,00,000 - ${symbol}5,00,000`,
      },
      { value: "500000", label: `Above ${symbol}5,00,000` },
    ];
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
    router.replace(newUrl); // Use replace instead of push to avoid history issues
  };

  // Reset price range when currency changes
  useEffect(() => {
    if (currentFilters.currency && currentFilters.priceRange) {
      updateFilter("priceRange", null);
    }
  }, [currentFilters.currency]);

  const clearFilters = () => {
    const params = new URLSearchParams();
    router.replace(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    currentFilters.destination ||
    currentFilters.duration ||
    currentFilters.currency ||
    (currentFilters.currency && currentFilters.priceRange);

  return (
    <div className="bg-card rounded-2xl border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Filters</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="size-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Currency */}
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select
            value={currentFilters.currency || "all"}
            onValueChange={(value) =>
              updateFilter("currency", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Currencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              {currencies.map((currency) => (
                <SelectItem key={currency.id} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range - Only show when currency is selected */}
        {currentFilters.currency && (
          <div className="space-y-2">
            <Label>Price Range</Label>
            <Select
              value={currentFilters.priceRange || "all"}
              onValueChange={(value) =>
                updateFilter("priceRange", value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                {getPriceRangeOptions(currentFilters.currency).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Range Placeholder - Show when no currency selected */}
        {!currentFilters.currency && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Price Range</Label>
            <div className="w-full px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md border">
              Select a currency first
            </div>
          </div>
        )}

        {/* Destination */}
        <div className="space-y-2">
          <Label>Destination</Label>
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
          <Label>Duration</Label>
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
      </div>
    </div>
  );
}
