import { Heart, Star, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExplorePlaceResult } from "@/types/explore";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";

import apartmentPlaceholder from "@/assets/apartment-1.jpg";
import carPlaceholder from "@/assets/car-1.jpg";
import restaurantPlaceholder from "@/assets/restaurant-1.jpg";
import eventPlaceholder from "@/assets/event-1.jpg";

interface ExploreCardProps {
  place: ExplorePlaceResult;
  variant?: "default" | "compact";
  isSelected?: boolean;
  onSelect?: () => void;
}

const placeholders: Record<string, string> = {
  apartment: apartmentPlaceholder,
  car: carPlaceholder,
  restaurant: restaurantPlaceholder,
  event: eventPlaceholder,
};

const typeLabels: Record<string, string> = {
  apartment: "STAYS",
  car: "CARS",
  restaurant: "RESTAURANTS",
  event: "EVENTS",
};

const typeColors: Record<string, string> = {
  apartment: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  car: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  restaurant: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  event: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

// Generate AI summary based on type
function getAiSummary(place: ExplorePlaceResult): string {
  const summaries: Record<string, string[]> = {
    restaurant: [
      "Must-visit for molecular gastronomy lovers.",
      "Perfect for a date night. Reserve patio seating.",
      "Local favorite with authentic flavors.",
      "Great ambiance and craft cocktails.",
    ],
    apartment: [
      "Ideal for remote workers with fast WiFi.",
      "Stunning city views from private balcony.",
      "Walking distance to top attractions.",
      "Quiet neighborhood, perfect for relaxation.",
    ],
    car: [
      "Perfect for exploring the countryside.",
      "Fuel-efficient for city driving.",
      "Spacious trunk for luggage.",
      "Great value with unlimited mileage.",
    ],
    event: [
      "Don't miss this unique experience!",
      "Popular among locals and visitors.",
      "Book early - tickets sell fast!",
      "Perfect addition to your itinerary.",
    ],
  };
  
  const typeSummaries = summaries[place.type] || summaries.restaurant;
  // Use place id to consistently pick a summary
  const index = place.id.charCodeAt(0) % typeSummaries.length;
  return typeSummaries[index];
}

export function ExploreCard({ place, variant = "default", isSelected = false, onSelect }: ExploreCardProps) {
  const { data: isSaved = false } = useIsSaved(place.id, place.type);
  const toggleSave = useToggleSave();

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave.mutate({
      locationId: place.id,
      locationType: place.type,
      isSaved,
    });
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const image = place.image || placeholders[place.type];
  const aiSummary = getAiSummary(place);

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer",
        variant === "compact" && "flex",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "default" ? "aspect-[4/3]" : "w-32 h-32 flex-shrink-0"
        )}
      >
        <img
          src={image}
          alt={place.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Type Badge */}
        <Badge
          variant="outline"
          className={cn(
            "absolute top-3 left-3 text-xs font-medium border",
            typeColors[place.type]
          )}
        >
          {typeLabels[place.type]}
        </Badge>

        {/* Save Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background",
            isSaved && "opacity-100 bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={handleSaveClick}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
        </Button>

        {/* Image dots indicator */}
        {variant === "default" && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  i === 0 ? "bg-card" : "bg-card/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("p-4", variant === "compact" && "flex-1 py-3")}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {place.title}
          </h3>
          {place.rating && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{place.price}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {place.neighborhood}
          </span>
        </div>

        {/* AI Summary */}
        {variant === "default" && (
          <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{aiSummary}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
