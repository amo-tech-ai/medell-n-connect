import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApartmentFilters } from "@/types/listings";
import { useIsMobile } from "@/hooks/use-mobile";
import { SlidersHorizontal } from "lucide-react";

interface ApartmentFiltersProps {
  filters: ApartmentFilters;
  onFiltersChange: (filters: ApartmentFilters) => void;
  neighborhoods: { name: string; count: number }[];
}

const BEDROOM_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3+" },
];

const PRICE_RANGE = { min: 0, max: 5000 };

export function ApartmentFiltersBar({
  filters,
  onFiltersChange,
  neighborhoods,
}: ApartmentFiltersProps) {
  const isMobile = useIsMobile();
  const [tempFilters, setTempFilters] = useState<ApartmentFilters>(filters);

  const activeFilterCount = [
    filters.neighborhoods?.length,
    filters.priceRange?.min || filters.priceRange?.max,
    filters.bedrooms?.length,
    filters.furnished !== undefined,
    filters.petFriendly,
    filters.wifiSpeedMin,
  ].filter(Boolean).length;

  const handleApply = () => {
    onFiltersChange(tempFilters);
  };

  const handleReset = () => {
    const reset: ApartmentFilters = { search: filters.search };
    setTempFilters(reset);
    onFiltersChange(reset);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Neighborhoods */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Neighborhood</Label>
        <div className="flex flex-wrap gap-2">
          {neighborhoods.map((n) => (
            <Badge
              key={n.name}
              variant={tempFilters.neighborhoods?.includes(n.name) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => {
                const current = tempFilters.neighborhoods || [];
                const updated = current.includes(n.name)
                  ? current.filter((x) => x !== n.name)
                  : [...current, n.name];
                setTempFilters({ ...tempFilters, neighborhoods: updated.length ? updated : undefined });
              }}
            >
              {n.name}
              <span className="ml-1 text-muted-foreground">({n.count})</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Monthly Price: ${tempFilters.priceRange?.min || PRICE_RANGE.min} - ${tempFilters.priceRange?.max || PRICE_RANGE.max}
        </Label>
        <Slider
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          step={100}
          value={[
            tempFilters.priceRange?.min || PRICE_RANGE.min,
            tempFilters.priceRange?.max || PRICE_RANGE.max,
          ]}
          onValueChange={([min, max]) =>
            setTempFilters({
              ...tempFilters,
              priceRange: { min, max },
            })
          }
          className="mt-2"
        />
      </div>

      {/* Bedrooms */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Bedrooms</Label>
        <div className="flex gap-2">
          {BEDROOM_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={tempFilters.bedrooms?.includes(opt.value) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const current = tempFilters.bedrooms || [];
                const updated = current.includes(opt.value)
                  ? current.filter((x) => x !== opt.value)
                  : [...current, opt.value];
                setTempFilters({ ...tempFilters, bedrooms: updated.length ? updated : undefined });
              }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="furnished" className="text-sm">Furnished</Label>
          <Switch
            id="furnished"
            checked={tempFilters.furnished === true}
            onCheckedChange={(checked) =>
              setTempFilters({ ...tempFilters, furnished: checked ? true : undefined })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="petFriendly" className="text-sm">Pet Friendly</Label>
          <Switch
            id="petFriendly"
            checked={tempFilters.petFriendly === true}
            onCheckedChange={(checked) =>
              setTempFilters({ ...tempFilters, petFriendly: checked ? true : undefined })
            }
          />
        </div>
      </div>

      {/* WiFi Speed */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Min WiFi Speed: {tempFilters.wifiSpeedMin || 0} Mbps
        </Label>
        <Slider
          min={0}
          max={200}
          step={10}
          value={[tempFilters.wifiSpeedMin || 0]}
          onValueChange={([value]) =>
            setTempFilters({ ...tempFilters, wifiSpeedMin: value > 0 ? value : undefined })
          }
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Filter Apartments</SheetTitle>
          </SheetHeader>
          <div className="py-6 overflow-y-auto max-h-[calc(85vh-140px)]">
            <FilterContent />
          </div>
          <SheetFooter className="flex-row gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Neighborhood Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Neighborhood
            {filters.neighborhoods?.length ? (
              <Badge variant="secondary" className="ml-1">
                {filters.neighborhoods.length}
              </Badge>
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-2">
            {neighborhoods.map((n) => (
              <div
                key={n.name}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted",
                  filters.neighborhoods?.includes(n.name) && "bg-primary/10"
                )}
                onClick={() => {
                  const current = filters.neighborhoods || [];
                  const updated = current.includes(n.name)
                    ? current.filter((x) => x !== n.name)
                    : [...current, n.name];
                  onFiltersChange({ ...filters, neighborhoods: updated.length ? updated : undefined });
                }}
              >
                <span>{n.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{n.count}</span>
                  {filters.neighborhoods?.includes(n.name) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Price Range Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Price
            {(filters.priceRange?.min || filters.priceRange?.max) && (
              <Badge variant="secondary" className="ml-1">1</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <Label className="text-sm font-medium mb-3 block">
            ${filters.priceRange?.min || 0} - ${filters.priceRange?.max || 5000}/mo
          </Label>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={[filters.priceRange?.min || 0, filters.priceRange?.max || 5000]}
            onValueChange={([min, max]) =>
              onFiltersChange({ ...filters, priceRange: { min, max } })
            }
          />
        </PopoverContent>
      </Popover>

      {/* Bedrooms */}
      <div className="flex gap-1">
        {BEDROOM_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={filters.bedrooms?.includes(opt.value) ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const current = filters.bedrooms || [];
              const updated = current.includes(opt.value)
                ? current.filter((x) => x !== opt.value)
                : [...current, opt.value];
              onFiltersChange({ ...filters, bedrooms: updated.length ? updated : undefined });
            }}
          >
            {opt.label} BR
          </Button>
        ))}
      </div>

      {/* More Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <SlidersHorizontal className="w-4 h-4" />
            More
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Furnished</Label>
              <Switch
                checked={filters.furnished === true}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, furnished: checked ? true : undefined })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Pet Friendly</Label>
              <Switch
                checked={filters.petFriendly === true}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, petFriendly: checked ? true : undefined })
                }
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
