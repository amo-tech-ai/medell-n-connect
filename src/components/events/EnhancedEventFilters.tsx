import { useState } from "react";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { Calendar, List, Grid3X3, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { EventFilters } from "@/types/event";

interface EnhancedEventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  resultCount?: number;
  viewMode?: "grid" | "list" | "calendar";
  onViewModeChange?: (mode: "grid" | "list" | "calendar") => void;
}

const eventCategories = [
  { value: "all", label: "All Events" },
  { value: "music", label: "Music & Concerts" },
  { value: "food", label: "Food & Drink" },
  { value: "tech", label: "Tech & Networking" },
  { value: "art", label: "Art & Culture" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "nightlife", label: "Nightlife" },
  { value: "workshop", label: "Workshops" },
  { value: "festival", label: "Festivals" },
];

const neighborhoods = [
  "All Areas",
  "El Poblado",
  "Laureles",
  "Envigado",
  "Belén",
  "La Candelaria",
  "Sabaneta",
];

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "free", label: "Free" },
  { value: "under50", label: "Under $50K COP" },
  { value: "50to100", label: "$50K - $100K COP" },
  { value: "over100", label: "Over $100K COP" },
];

const datePresets = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "thisWeek", label: "This Week" },
  { value: "thisWeekend", label: "This Weekend" },
  { value: "nextWeek", label: "Next Week" },
  { value: "custom", label: "Custom Date" },
];

export function EnhancedEventFilters({
  filters,
  onFiltersChange,
  resultCount,
  viewMode = "grid",
  onViewModeChange,
}: EnhancedEventFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [datePreset, setDatePreset] = useState<string>("all");

  const handleDatePreset = (preset: string) => {
    setDatePreset(preset);
    const today = new Date();

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    switch (preset) {
      case "today":
        startDate = today;
        endDate = today;
        break;
      case "tomorrow":
        startDate = addDays(today, 1);
        endDate = addDays(today, 1);
        break;
      case "thisWeek":
        startDate = today;
        endDate = endOfWeek(today);
        break;
      case "thisWeekend":
        startDate = addDays(startOfWeek(today), 5); // Saturday
        endDate = addDays(startOfWeek(today), 6); // Sunday
        break;
      case "nextWeek":
        startDate = addDays(startOfWeek(today), 7);
        endDate = addDays(startOfWeek(today), 13);
        break;
      default:
        startDate = undefined;
        endDate = undefined;
    }

    onFiltersChange({
      ...filters,
      dateRange: startDate
        ? { start: format(startDate, "yyyy-MM-dd"), end: format(endDate!, "yyyy-MM-dd") }
        : undefined,
    });
  };

  const activeFiltersCount = [
    filters.category && filters.category !== "all",
    filters.neighborhood && filters.neighborhood !== "All Areas",
    filters.priceRange && filters.priceRange !== "all",
    filters.dateRange,
    filters.search,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({});
    setDatePreset("all");
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={filters.search || ""}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange?.("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange?.("list")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "calendar" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange?.("calendar")}
          >
            <Calendar className="w-4 h-4" />
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="relative"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Date Presets */}
      <div className="flex gap-2 flex-wrap">
        {datePresets.map((preset) => (
          <Button
            key={preset.value}
            variant={datePreset === preset.value ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => handleDatePreset(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 border rounded-xl bg-muted/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, category: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Neighborhood */}
            <Select
              value={filters.neighborhood || "All Areas"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  neighborhood: value === "All Areas" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Neighborhood" />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select
              value={filters.priceRange || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, priceRange: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Results Count */}
      {resultCount !== undefined && (
        <p className="text-sm text-muted-foreground">
          {resultCount} event{resultCount !== 1 ? "s" : ""} found
        </p>
      )}
    </div>
  );
}
