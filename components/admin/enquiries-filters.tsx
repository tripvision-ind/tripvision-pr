"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  X,
  Search,
  Calendar as CalendarIcon,
  MapPin,
  Package,
  Tag,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterOptions {
  sources: string[];
  statuses: string[];
  destinations: string[];
  packages: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
  dateRanges: Array<{
    label: string;
    value: string;
  }>;
}

interface Filters {
  search: string;
  source: string;
  status: string;
  destination: string;
  packageId: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  dateRange: string;
}

interface AdminEnquiriesFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
}

export function AdminEnquiriesFilters({
  onFiltersChange,
  onReset,
}: AdminEnquiriesFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null,
  );
  const [filters, setFilters] = useState<Filters>({
    search: "",
    source: "all",
    status: "all",
    destination: "all",
    packageId: "all",
    dateFrom: undefined,
    dateTo: undefined,
    dateRange: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch("/api/admin/enquiries/filters");
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data);
      }
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    }
  };

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      source: "all",
      status: "all",
      destination: "all",
      packageId: "all",
      dateFrom: undefined,
      dateTo: undefined,
      dateRange: "",
    });
    onReset();
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "dateFrom" || key === "dateTo") {
        return value instanceof Date;
      }
      if (
        key === "source" ||
        key === "status" ||
        key === "destination" ||
        key === "packageId"
      ) {
        return value && value !== "" && value !== "all";
      }
      return value && value !== "";
    }).length;
  };

  const statusConfig = {
    NEW: { label: "New", color: "bg-blue-100 text-blue-800" },
    CONTACTED: { label: "Contacted", color: "bg-yellow-100 text-yellow-800" },
    IN_PROGRESS: {
      label: "In Progress",
      color: "bg-purple-100 text-purple-800",
    },
    CONVERTED: { label: "Converted", color: "bg-green-100 text-green-800" },
    CLOSED: { label: "Closed", color: "bg-gray-100 text-gray-800" },
  };

  const sourceConfig = {
    GENERAL: { label: "General", color: "bg-slate-100 text-slate-800" },
    PACKAGE: { label: "Package", color: "bg-emerald-100 text-emerald-800" },
    QUICK_ENQUIRY: {
      label: "Quick Enquiry",
      color: "bg-orange-100 text-orange-800",
    },
    CONTACT_PAGE: { label: "Contact Page", color: "bg-cyan-100 text-cyan-800" },
    HOMEPAGE: { label: "Homepage", color: "bg-pink-100 text-pink-800" },
  };

  if (!filterOptions) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-1" />
              {isExpanded ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-4", !isExpanded && "hidden")}>
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Label>
          <Input
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Source Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Source
            </Label>
            <Select
              value={filters.source}
              onValueChange={(value) => updateFilter("source", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {filterOptions.sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          sourceConfig[
                            source as keyof typeof sourceConfig
                          ]?.color.split(" ")[0] || "bg-gray-500",
                        )}
                      />
                      {sourceConfig[source as keyof typeof sourceConfig]
                        ?.label || source}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterOptions.statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          statusConfig[
                            status as keyof typeof statusConfig
                          ]?.color.split(" ")[0] || "bg-gray-500",
                        )}
                      />
                      {statusConfig[status as keyof typeof statusConfig]
                        ?.label || status}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination
            </Label>
            <Select
              value={filters.destination}
              onValueChange={(value) => updateFilter("destination", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {filterOptions.destinations.map((destination) => (
                  <SelectItem key={destination} value={destination}>
                    {destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Package Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Package
            </Label>
            <Select
              value={filters.packageId}
              onValueChange={(value) => updateFilter("packageId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Packages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {filterOptions.packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Date From
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom
                    ? format(filters.dateFrom, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => updateFilter("dateFrom", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo
                    ? format(filters.dateTo, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => updateFilter("dateTo", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Date Range</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => updateFilter("dateRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Range</SelectItem>
                {filterOptions.dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
