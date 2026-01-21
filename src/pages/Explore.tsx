import { useState, useMemo } from "react";
import { Search, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ThreePanelLayout, useThreePanelContext } from "@/components/explore/ThreePanelLayout";
import { ExploreCard } from "@/components/explore/ExploreCard";
import { ExploreCategoryTabs } from "@/components/explore/ExploreCategoryTabs";
import { ExploreMapView } from "@/components/explore/ExploreMapView";
import { NeighborhoodSelector } from "@/components/places/NeighborhoodSelector";
import { ContextBanner } from "@/components/places/ContextBanner";
import { useExplorePlaces, useExploreCounts } from "@/hooks/useExplorePlaces";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExploreCategory, ExplorePlaceResult } from "@/types/explore";
import type { SelectedItem } from "@/context/ThreePanelContext";

// Category labels and routes for "See more" links
const categoryRoutes: Record<string, { label: string; route: string }> = {
  apartment: { label: "Stays", route: "/apartments" },
  car: { label: "Car Rentals", route: "/cars" },
  restaurant: { label: "Restaurants", route: "/restaurants" },
  event: { label: "Things to Do", route: "/events" },
};

// Inner content component that uses panel context
function ExploreContent() {
  const [activeCategory, setActiveCategory] = useState<ExploreCategory>("all");
  const [neighborhood, setNeighborhood] = useState("El Poblado");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const { openDetailPanel } = useThreePanelContext();

  // Supabase queries
  const { data: places = [], isLoading } = useExplorePlaces({
    category: activeCategory,
    neighborhood,
    searchQuery,
  });

  const { data: counts } = useExploreCounts({
    neighborhood,
    searchQuery,
  });

  // Group places by type for "All" view
  const groupedPlaces = useMemo(() => {
    const groups: Record<string, ExplorePlaceResult[]> = {
      restaurant: [],
      apartment: [],
      event: [],
      car: [],
    };

    places.forEach((place) => {
      groups[place.type].push(place);
    });

    return groups;
  }, [places]);

  // Handle place selection - opens the right detail panel
  const handlePlaceSelect = (place: ExplorePlaceResult) => {
    setSelectedPlaceId(place.id);
    
    // Create selected item for the panel
    const selectedItem: SelectedItem = {
      type: place.type as SelectedItem["type"],
      id: place.id,
      data: place.rawData || place, // Use rawData for full entity, fallback to place
    };
    
    openDetailPanel(selectedItem);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-20 px-4 lg:px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <NeighborhoodSelector
            selected={neighborhood}
            onSelect={setNeighborhood}
          />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search places, vibes, or cravings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border rounded-full h-12"
          />
        </div>

        {/* Category Tabs with counts */}
        <ExploreCategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          counts={counts}
        />
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 py-6 space-y-8">
        {/* Context Banner */}
        <ContextBanner neighborhood={neighborhood} />

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : activeCategory === "all" ? (
          // Grouped view for "All" category
          Object.entries(groupedPlaces).map(([type, typePlaces]) =>
            typePlaces.length > 0 ? (
              <section key={type}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    {categoryRoutes[type]?.label}
                  </h2>
                  <Link 
                    to={categoryRoutes[type]?.route || "#"} 
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    See more
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {typePlaces.slice(0, 4).map((place) => (
                    <ExploreCard 
                      key={place.id} 
                      place={place} 
                      isSelected={selectedPlaceId === place.id}
                      onSelect={() => handlePlaceSelect(place)}
                    />
                  ))}
                </div>
              </section>
            ) : null
          )
        ) : (
          // Flat grid for specific category
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places.map((place) => (
              <ExploreCard 
                key={place.id} 
                place={place}
                isSelected={selectedPlaceId === place.id}
                onSelect={() => handlePlaceSelect(place)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && places.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No places found</h2>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Explore() {
  return (
    <ThreePanelLayout>
      <ExploreContent />
    </ThreePanelLayout>
  );
}
