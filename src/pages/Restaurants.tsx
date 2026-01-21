import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, useThreePanelContext } from "@/components/explore/ThreePanelLayout";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { RestaurantFiltersBar } from "@/components/restaurants/RestaurantFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useRestaurants, useCuisineTypes, useDietaryOptions } from "@/hooks/useRestaurants";
import type { Restaurant, RestaurantFilters } from "@/types/restaurant";
import type { SelectedItem } from "@/context/ThreePanelContext";

function RestaurantsContent() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading, error } = useRestaurants(filters);
  const { data: cuisineTypes = [] } = useCuisineTypes();
  const { data: dietaryOptions = [] } = useDietaryOptions();
  const { openDetailPanel } = useThreePanelContext();

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedId(restaurant.id);
    const selectedItem: SelectedItem = {
      type: "restaurant",
      id: restaurant.id,
      data: restaurant,
    };
    openDetailPanel(selectedItem);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Restaurants</h1>
        <p className="text-muted-foreground mt-1">Discover the best dining in Medellín</p>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            className="pl-10"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <RestaurantFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          cuisineTypes={cuisineTypes}
          dietaryOptions={dietaryOptions}
        />
      </div>

      {isLoading ? (
        <ListingSkeleton count={6} />
      ) : error ? (
        <EmptyState
          title="Error loading restaurants"
          description="Something went wrong. Please try again."
          action={{ label: "Retry", onClick: () => window.location.reload() }}
        />
      ) : !data?.restaurants.length ? (
        <EmptyState
          title="No restaurants found"
          description="Try adjusting your filters to see more results."
          action={{ label: "Clear filters", onClick: () => setFilters({}) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.restaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              isSelected={selectedId === restaurant.id}
              onSelect={handleRestaurantSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Restaurants() {
  return (
    <ThreePanelLayout>
      <RestaurantsContent />
    </ThreePanelLayout>
  );
}
