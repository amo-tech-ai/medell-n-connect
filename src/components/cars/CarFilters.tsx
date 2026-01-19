import { useState } from "react";
import { Check, ChevronDown, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { CarFilters } from "@/types/listings";
import { useIsMobile } from "@/hooks/use-mobile";
import { SlidersHorizontal } from "lucide-react";

interface CarFiltersProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  vehicleTypes: { type: string; count: number }[];
}

const TRANSMISSION_OPTIONS = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
];

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  sedan: "Sedan",
  suv: "SUV",
  compact: "Compact",
  van: "Van",
  luxury: "Luxury",
  pickup: "Pickup",
  convertible: "Convertible",
  minivan: "Minivan",
};

const PRICE_RANGE = { min: 0, max: 500 };

export function CarFiltersBar({
  filters,
  onFiltersChange,
  vehicleTypes,
}: CarFiltersProps) {
  const isMobile = useIsMobile();
  const [tempFilters, setTempFilters] = useState<CarFilters>(filters);

  const activeFilterCount = [
    filters.vehicleTypes?.length,
    filters.transmission?.length,
    filters.priceRange?.min || filters.priceRange?.max,
    filters.unlimitedMileage,
    filters.insuranceIncluded,
  ].filter(Boolean).length;

  const handleApply = () => {
    onFiltersChange(tempFilters);
  };

  const handleReset = () => {
    const reset: CarFilters = { search: filters.search };
    setTempFilters(reset);
    onFiltersChange(reset);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Vehicle Types */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Vehicle Type</Label>
        <div className="flex flex-wrap gap-2">
          {vehicleTypes.map((v) => (
            <Badge
              key={v.type}
              variant={tempFilters.vehicleTypes?.includes(v.type) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => {
                const current = tempFilters.vehicleTypes || [];
                const updated = current.includes(v.type)
                  ? current.filter((x) => x !== v.type)
                  : [...current, v.type];
                setTempFilters({ ...tempFilters, vehicleTypes: updated.length ? updated : undefined });
              }}
            >
              {VEHICLE_TYPE_LABELS[v.type] || v.type}
              <span className="ml-1 text-muted-foreground">({v.count})</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Transmission</Label>
        <div className="flex gap-2">
          {TRANSMISSION_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={tempFilters.transmission?.includes(opt.value) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const current = tempFilters.transmission || [];
                const updated = current.includes(opt.value)
                  ? current.filter((x) => x !== opt.value)
                  : [...current, opt.value];
                setTempFilters({ ...tempFilters, transmission: updated.length ? updated : undefined });
              }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Daily Price: ${tempFilters.priceRange?.min || PRICE_RANGE.min} - ${tempFilters.priceRange?.max || PRICE_RANGE.max}
        </Label>
        <Slider
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          step={10}
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

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="unlimitedMileage" className="text-sm">Unlimited Mileage</Label>
          <Switch
            id="unlimitedMileage"
            checked={tempFilters.unlimitedMileage === true}
            onCheckedChange={(checked) =>
              setTempFilters({ ...tempFilters, unlimitedMileage: checked ? true : undefined })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="insuranceIncluded" className="text-sm">Insurance Included</Label>
          <Switch
            id="insuranceIncluded"
            checked={tempFilters.insuranceIncluded === true}
            onCheckedChange={(checked) =>
              setTempFilters({ ...tempFilters, insuranceIncluded: checked ? true : undefined })
            }
          />
        </div>
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
            <SheetTitle>Filter Cars</SheetTitle>
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
      {/* Vehicle Type Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Vehicle Type
            {filters.vehicleTypes?.length ? (
              <Badge variant="secondary" className="ml-1">
                {filters.vehicleTypes.length}
              </Badge>
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-2">
            {vehicleTypes.map((v) => (
              <div
                key={v.type}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted",
                  filters.vehicleTypes?.includes(v.type) && "bg-primary/10"
                )}
                onClick={() => {
                  const current = filters.vehicleTypes || [];
                  const updated = current.includes(v.type)
                    ? current.filter((x) => x !== v.type)
                    : [...current, v.type];
                  onFiltersChange({ ...filters, vehicleTypes: updated.length ? updated : undefined });
                }}
              >
                <span>{VEHICLE_TYPE_LABELS[v.type] || v.type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{v.count}</span>
                  {filters.vehicleTypes?.includes(v.type) && (
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
            ${filters.priceRange?.min || 0} - ${filters.priceRange?.max || 500}/day
          </Label>
          <Slider
            min={0}
            max={500}
            step={10}
            value={[filters.priceRange?.min || 0, filters.priceRange?.max || 500]}
            onValueChange={([min, max]) =>
              onFiltersChange({ ...filters, priceRange: { min, max } })
            }
          />
        </PopoverContent>
      </Popover>

      {/* Transmission */}
      <div className="flex gap-1">
        {TRANSMISSION_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={filters.transmission?.includes(opt.value) ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const current = filters.transmission || [];
              const updated = current.includes(opt.value)
                ? current.filter((x) => x !== opt.value)
                : [...current, opt.value];
              onFiltersChange({ ...filters, transmission: updated.length ? updated : undefined });
            }}
          >
            {opt.label}
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
              <Label>Unlimited Mileage</Label>
              <Switch
                checked={filters.unlimitedMileage === true}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, unlimitedMileage: checked ? true : undefined })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Insurance Included</Label>
              <Switch
                checked={filters.insuranceIncluded === true}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, insuranceIncluded: checked ? true : undefined })
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
