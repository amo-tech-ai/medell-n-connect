import { cn } from "@/lib/utils";
import type { ExploreCategory } from "@/types/explore";

interface ExploreCategoryTabsProps {
  activeCategory: ExploreCategory;
  onCategoryChange: (category: ExploreCategory) => void;
  counts?: Record<string, number>;
}

const categories: { id: ExploreCategory; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "🌎" },
  { id: "restaurants", label: "Restaurants", emoji: "🍽️" },
  { id: "events", label: "Things to Do", emoji: "🎉" },
  { id: "stays", label: "Stays", emoji: "🏠" },
  { id: "cars", label: "Cars", emoji: "🚗" },
];

export function ExploreCategoryTabs({
  activeCategory,
  onCategoryChange,
  counts,
}: ExploreCategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const count = counts?.[category.id];
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-foreground hover:bg-muted"
            )}
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-primary-foreground/20" : "bg-foreground/10"
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
