import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import type { RestaurantFilters } from "@/types/restaurant";

interface RestaurantFiltersBarProps {
  filters: RestaurantFilters;
  onFiltersChange: (filters: RestaurantFilters) => void;
  cuisineTypes?: { name: string; count: number }[];
  dietaryOptions?: string[];
}

const PRICE_LEVELS = [
  { value: 1, label: "$" },
  { value: 2, label: "$$" },
  { value: 3, label: "$$$" },
  { value: 4, label: "$$$$" },
];

const AMBIANCE_OPTIONS = [
  "Romantic",
  "Casual",
  "Family-friendly",
  "Business",
  "Trendy",
  "Outdoor",
  "Live music",
];

export function RestaurantFiltersBar({
  filters,
  onFiltersChange,
  cuisineTypes = [],
  dietaryOptions = [],
}: RestaurantFiltersBarProps) {
  const isMobile = useIsMobile();

  const activeFilterCount =
    (filters.cuisines?.length || 0) +
    (filters.priceLevel?.length || 0) +
    (filters.dietaryOptions?.length || 0) +
    (filters.ambiance?.length || 0) +
    (filters.openNow ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search,
      page: 1,
    });
  };

  const toggleCuisine = (cuisine: string) => {
    const current = filters.cuisines || [];
    const updated = current.includes(cuisine)
      ? current.filter((c) => c !== cuisine)
      : [...current, cuisine];
    onFiltersChange({ ...filters, cuisines: updated, page: 1 });
  };

  const togglePriceLevel = (level: number) => {
    const current = filters.priceLevel || [];
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    onFiltersChange({ ...filters, priceLevel: updated, page: 1 });
  };

  const toggleDietaryOption = (option: string) => {
    const current = filters.dietaryOptions || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onFiltersChange({ ...filters, dietaryOptions: updated, page: 1 });
  };

  const toggleAmbiance = (ambiance: string) => {
    const current = filters.ambiance || [];
    const updated = current.includes(ambiance)
      ? current.filter((a) => a !== ambiance)
      : [...current, ambiance];
    onFiltersChange({ ...filters, ambiance: updated, page: 1 });
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Level */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Price Level</Label>
        <div className="flex gap-2">
          {PRICE_LEVELS.map((level) => (
            <Button
              key={level.value}
              variant={filters.priceLevel?.includes(level.value) ? "default" : "outline"}
              size="sm"
              onClick={() => togglePriceLevel(level.value)}
              className="flex-1"
            >
              {level.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Cuisine Types */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Cuisine</Label>
        <div className="grid grid-cols-2 gap-2">
          {cuisineTypes.slice(0, 10).map((cuisine) => (
            <div key={cuisine.name} className="flex items-center space-x-2">
              <Checkbox
                id={`cuisine-${cuisine.name}`}
                checked={filters.cuisines?.includes(cuisine.name)}
                onCheckedChange={() => toggleCuisine(cuisine.name)}
              />
              <label
                htmlFor={`cuisine-${cuisine.name}`}
                className="text-sm cursor-pointer flex-1"
              >
                {cuisine.name}
                <span className="text-muted-foreground ml-1">({cuisine.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Dietary Options */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Dietary Options</Label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((option) => (
            <Badge
              key={option}
              variant={filters.dietaryOptions?.includes(option) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDietaryOption(option)}
            >
              {option}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Ambiance */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Ambiance</Label>
        <div className="flex flex-wrap gap-2">
          {AMBIANCE_OPTIONS.map((ambiance) => (
            <Badge
              key={ambiance}
              variant={filters.ambiance?.includes(ambiance) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleAmbiance(ambiance)}
            >
              {ambiance}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Open Now */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="open-now"
          checked={filters.openNow || false}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, openNow: checked === true, page: 1 })
          }
        />
        <label htmlFor="open-now" className="text-sm cursor-pointer">
          Open now
        </label>
      </div>
    </div>
  );

  // Mobile: Full-screen sheet
  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Filters
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full py-4">
              <FiltersContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    );
  }

  // Desktop: Popover filters
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Cuisine Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Cuisine
            {filters.cuisines?.length ? (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 p-0 justify-center">
                {filters.cuisines.length}
              </Badge>
            ) : (
              <ChevronDown className="w-3 h-3 ml-1" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-2">
            {cuisineTypes.slice(0, 10).map((cuisine) => (
              <div key={cuisine.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`pop-cuisine-${cuisine.name}`}
                  checked={filters.cuisines?.includes(cuisine.name)}
                  onCheckedChange={() => toggleCuisine(cuisine.name)}
                />
                <label
                  htmlFor={`pop-cuisine-${cuisine.name}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {cuisine.name}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Price Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Price
            {filters.priceLevel?.length ? (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 p-0 justify-center">
                {filters.priceLevel.length}
              </Badge>
            ) : (
              <ChevronDown className="w-3 h-3 ml-1" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="start">
          <div className="flex gap-2">
            {PRICE_LEVELS.map((level) => (
              <Button
                key={level.value}
                variant={filters.priceLevel?.includes(level.value) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePriceLevel(level.value)}
                className="flex-1"
              >
                {level.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Dietary Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Dietary
            {filters.dietaryOptions?.length ? (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 p-0 justify-center">
                {filters.dietaryOptions.length}
              </Badge>
            ) : (
              <ChevronDown className="w-3 h-3 ml-1" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="start">
          <div className="space-y-2">
            {dietaryOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`pop-diet-${option}`}
                  checked={filters.dietaryOptions?.includes(option)}
                  onCheckedChange={() => toggleDietaryOption(option)}
                />
                <label htmlFor={`pop-diet-${option}`} className="text-sm cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Open Now Toggle */}
      <Button
        variant={filters.openNow ? "default" : "outline"}
        size="sm"
        onClick={() => onFiltersChange({ ...filters, openNow: !filters.openNow, page: 1 })}
      >
        Open now
      </Button>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="w-4 h-4 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  );
}
