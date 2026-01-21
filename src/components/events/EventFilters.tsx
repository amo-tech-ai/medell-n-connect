import { Search, X, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EVENT_TYPES, type EventFilters as EventFiltersType } from "@/types/event";
import { format } from "date-fns";

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
  resultCount?: number;
}

export function EventFilters({
  filters,
  onFiltersChange,
  resultCount,
}: EventFiltersProps) {
  const updateFilter = <K extends keyof EventFiltersType>(
    key: K,
    value: EventFiltersType[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof EventFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof EventFiltersType] !== undefined
  ).length;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value || undefined)}
          className="pl-10"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        {/* Event Type */}
        <Select
          value={filters.eventType || "all"}
          onValueChange={(value) =>
            updateFilter("eventType", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal",
                !filters.dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {filters.dateFrom
                ? format(new Date(filters.dateFrom), "MMM d, yyyy")
                : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
              onSelect={(date) =>
                updateFilter("dateFrom", date?.toISOString() || undefined)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal",
                !filters.dateTo && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {filters.dateTo
                ? format(new Date(filters.dateTo), "MMM d, yyyy")
                : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
              onSelect={(date) =>
                updateFilter("dateTo", date?.toISOString() || undefined)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Free Events Toggle */}
        <div className="flex items-center space-x-2 px-3 py-2 border rounded-md">
          <Switch
            id="free-events"
            checked={filters.isFree || false}
            onCheckedChange={(checked) =>
              updateFilter("isFree", checked || undefined)
            }
          />
          <Label htmlFor="free-events" className="text-sm cursor-pointer">
            Free Only
          </Label>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters & Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.eventType && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => clearFilter("eventType")}
            >
              {EVENT_TYPES.find((t) => t.value === filters.eventType)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.dateFrom && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => clearFilter("dateFrom")}
            >
              From: {format(new Date(filters.dateFrom), "MMM d")}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.dateTo && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => clearFilter("dateTo")}
            >
              To: {format(new Date(filters.dateTo), "MMM d")}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.isFree && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => clearFilter("isFree")}
            >
              Free Events
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>

        {resultCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            {resultCount} event{resultCount !== 1 ? "s" : ""} found
          </p>
        )}
      </div>
    </div>
  );
}
