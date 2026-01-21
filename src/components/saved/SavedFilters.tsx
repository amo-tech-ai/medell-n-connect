import { cn } from "@/lib/utils";
import type { LocationType } from "@/types/saved";

interface SavedFiltersProps {
  activeFilter: LocationType;
  onFilterChange: (filter: LocationType) => void;
  counts?: Record<string, number>;
}

const filters: { id: LocationType; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📍" },
  { id: "apartment", label: "Stays", emoji: "🏠" },
  { id: "car", label: "Cars", emoji: "🚗" },
  { id: "restaurant", label: "Restaurants", emoji: "🍽️" },
  { id: "event", label: "Events", emoji: "🎉" },
];

export function SavedFilters({ activeFilter, onFilterChange, counts }: SavedFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const count = filter.id === "all" 
          ? Object.values(counts || {}).reduce((a, b) => a + b, 0)
          : counts?.[filter.id] || 0;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-foreground hover:bg-muted"
            )}
          >
            <span>{filter.emoji}</span>
            <span>{filter.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeFilter === filter.id
                    ? "bg-primary-foreground/20"
                    : "bg-foreground/10"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
