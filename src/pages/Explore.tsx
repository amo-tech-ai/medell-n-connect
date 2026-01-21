import { useState, useMemo } from "react";
import { Search, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExploreCard } from "@/components/explore/ExploreCard";
import { ExploreCategoryTabs } from "@/components/explore/ExploreCategoryTabs";
import { ExploreMapView } from "@/components/explore/ExploreMapView";
import { NeighborhoodSelector } from "@/components/places/NeighborhoodSelector";
import { ContextBanner } from "@/components/places/ContextBanner";
import { useExplorePlaces, useExploreCounts } from "@/hooks/useExplorePlaces";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExploreCategory, ExplorePlaceResult } from "@/types/explore";

// Right panel content for Explore page
function ExploreRightPanelContent({ 
  places, 
  selectedPlace, 
  onPlaceSelect,
  counts,
}: { 
  places: ExplorePlaceResult[];
  selectedPlace: ExplorePlaceResult | null;
  onPlaceSelect: (place: ExplorePlaceResult | null) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="space-y-4">
      {/* Map Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Map View</h3>
        </div>
        <div className="rounded-xl overflow-hidden border border-border h-[300px]">
          <ExploreMapView
            places={places}
            selectedPlace={selectedPlace}
            onPlaceSelect={onPlaceSelect}
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="p-3 rounded-xl bg-secondary/50 border border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{counts?.all || places.length}</p>
            <p className="text-xs text-muted-foreground">Places found</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">4.5+</p>
            <p className="text-xs text-muted-foreground">Avg rating</p>
          </div>
        </div>
      </section>

      {/* AI Suggestions placeholder */}
      <section className="p-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">For You</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered recommendations based on your preferences coming soon.
        </p>
      </section>
    </div>
  );
}

// Category labels and routes for "See more" links
const categoryRoutes: Record<string, { label: string; route: string }> = {
  apartment: { label: "Stays", route: "/apartments" },
  car: { label: "Car Rentals", route: "/cars" },
  restaurant: { label: "Restaurants", route: "/restaurants" },
  event: { label: "Things to Do", route: "/events" },
};

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState<ExploreCategory>("all");
  const [neighborhood, setNeighborhood] = useState("El Poblado");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<ExplorePlaceResult | null>(null);

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

  return (
    <AppLayout
      rightPanelContent={
        <ExploreRightPanelContent 
          places={places}
          selectedPlace={selectedPlace}
          onPlaceSelect={setSelectedPlace}
          counts={counts}
        />
      }
    >
      <div className="min-h-screen">
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
              className="pl-10 bg-card border-border"
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
                      <ExploreCard key={place.id} place={place} />
                    ))}
                  </div>
                </section>
              ) : null
            )
          ) : (
            // Flat grid for specific category
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {places.map((place) => (
                <ExploreCard key={place.id} place={place} />
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
    </AppLayout>
  );
}
