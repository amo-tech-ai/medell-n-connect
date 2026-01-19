import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceCard } from "@/components/places/PlaceCard";
import { CategoryFilter } from "@/components/places/CategoryFilter";
import { MapView } from "@/components/places/MapView";
import { NeighborhoodSelector } from "@/components/places/NeighborhoodSelector";
import { ContextBanner } from "@/components/places/ContextBanner";
import { mockPlaces, Place, PlaceCategory } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const filterCategories = [
  { id: "all", label: "All" },
  { id: "restaurants", label: "Restaurants" },
  { id: "apartments", label: "Stays" },
  { id: "events", label: "Things to Do" },
  { id: "cars", label: "Cars" },
];

// Right panel content for Explore page
function ExploreRightPanelContent({ 
  places, 
  selectedPlace, 
  onPlaceSelect 
}: { 
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place | null) => void;
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
          <MapView
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
            <p className="text-2xl font-bold text-primary">{places.length}</p>
            <p className="text-xs text-muted-foreground">Places found</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">4.5+</p>
            <p className="text-xs text-muted-foreground">Avg rating</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [neighborhood, setNeighborhood] = useState("El Poblado");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const matchesCategory = activeCategory === "all" || place.type === activeCategory;
      const matchesNeighborhood =
        neighborhood === "All Neighborhoods" || place.neighborhood === neighborhood;
      const matchesSearch =
        searchQuery === "" ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesNeighborhood && matchesSearch;
    });
  }, [activeCategory, neighborhood, searchQuery]);

  const groupedPlaces = useMemo(() => {
    const groups: Record<PlaceCategory, Place[]> = {
      restaurants: [],
      apartments: [],
      events: [],
      cars: [],
    };

    filteredPlaces.forEach((place) => {
      groups[place.type].push(place);
    });

    return groups;
  }, [filteredPlaces]);

  const categoryLabels: Record<PlaceCategory, string> = {
    restaurants: "Restaurants",
    apartments: "Stays",
    events: "Things to Do",
    cars: "Car Rentals",
  };

  return (
    <AppLayout
      rightPanelContent={
        <ExploreRightPanelContent 
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onPlaceSelect={setSelectedPlace}
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
            <Button variant="outline" size="icon" className="lg:hidden">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
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

          {/* Category Filters */}
          <CategoryFilter
            categories={filterCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Content */}
        <div className="px-4 lg:px-6 py-6 space-y-8">
          {/* Context Banner */}
          <ContextBanner neighborhood={neighborhood} />

          {/* Places by Category */}
          {activeCategory === "all" ? (
            Object.entries(groupedPlaces).map(([category, places]) =>
              places.length > 0 ? (
                <section key={category}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      {categoryLabels[category as PlaceCategory]}
                    </h2>
                    <button className="text-sm text-primary hover:underline">
                      See more
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {places.slice(0, 4).map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))}
                  </div>
                </section>
              ) : null
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}

          {filteredPlaces.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No places found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
