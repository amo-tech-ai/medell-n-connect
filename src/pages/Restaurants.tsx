import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, usePanelContext } from "@/components/layout/ThreePanelLayout";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { RestaurantFiltersBar } from "@/components/restaurants/RestaurantFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { RestaurantDetailPanel } from "@/components/panels/RestaurantDetailPanel";
import { useRestaurants, useCuisineTypes, useDietaryOptions } from "@/hooks/useRestaurants";
import type { Restaurant, RestaurantFilters } from "@/types/restaurant";

function RestaurantsDefaultRightPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">4.5</div>
            <div className="text-xs text-muted-foreground">Avg. Rating</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">$$</div>
            <div className="text-xs text-muted-foreground">Avg. Price</div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Tonight's Picks</h3>
        <p className="text-sm text-muted-foreground">AI-powered recommendations coming soon</p>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Popular Cuisines</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>Colombian</span><span className="text-muted-foreground">Traditional</span></li>
          <li className="flex justify-between"><span>Italian</span><span className="text-muted-foreground">Popular</span></li>
          <li className="flex justify-between"><span>Japanese</span><span className="text-muted-foreground">Trending</span></li>
        </ul>
      </div>
    </div>
  );
}

function RestaurantsContent() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const { data, isLoading, error } = useRestaurants(filters);
  const { data: cuisineTypes = [] } = useCuisineTypes();
  const { data: dietaryOptions = [] } = useDietaryOptions();
  const { setRightPanelContent } = usePanelContext();

  const handleRestaurantSelect = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setRightPanelContent(<RestaurantDetailPanel restaurant={restaurant} />);
  }, [setRightPanelContent]);

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
    <ThreePanelLayout rightPanelContent={<RestaurantsDefaultRightPanel />}>
      <RestaurantsContent />
    </ThreePanelLayout>
  );
}
