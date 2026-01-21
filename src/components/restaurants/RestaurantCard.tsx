import { Heart, Star, MapPin, Clock, Leaf, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useContext, createContext } from "react";
import type { Restaurant } from "@/types/restaurant";
import { useAuth } from "@/hooks/useAuth";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import restaurantPlaceholder from "@/assets/restaurant-1.jpg";
import { RestaurantDetailPanel } from "@/components/panels/RestaurantDetailPanel";

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: "default" | "compact";
  onSelect?: (restaurant: Restaurant) => void;
}

const priceLevelDisplay = (level: number) => "$".repeat(level);

const dietaryIcons: Record<string, string> = {
  vegan: "🌱",
  vegetarian: "🥬",
  "gluten-free": "🌾",
  "dairy-free": "🥛",
  halal: "☪️",
  kosher: "✡️",
};

export function RestaurantCard({ restaurant, variant = "default", onSelect }: RestaurantCardProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(restaurant.id, "restaurant");
  const toggleSave = useToggleSave();
  const [imageError, setImageError] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleSave.mutate({
      locationId: restaurant.id,
      locationType: "restaurant",
      isSaved,
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(restaurant);
    }
    // If no onSelect, let the Link handle navigation
  };

  const mainImage = !imageError && (restaurant.primary_image_url || restaurant.images?.[0]?.url)
    ? restaurant.primary_image_url || restaurant.images?.[0]?.url
    : restaurantPlaceholder;

  const CardWrapper = onSelect ? 'div' : Link;
  const cardProps = onSelect 
    ? { onClick: handleCardClick, className: cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer",
        variant === "compact" && "flex"
      )}
    : { to: `/restaurants/${restaurant.id}`, className: cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300",
        variant === "compact" && "flex"
      )};

  return (
    <CardWrapper {...cardProps as any}>
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "default" ? "aspect-[4/3]" : "w-32 h-32 flex-shrink-0"
        )}
      >
        <img
          src={mainImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {restaurant.is_open_now && (
            <Badge className="bg-green-500 text-white text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Open Now
            </Badge>
          )}
          {restaurant.is_verified && (
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
              <Check className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Save button */}
        <Button
          variant="save"
          size="icon"
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
            isSaved && "opacity-100 bg-primary text-primary-foreground border-primary"
          )}
          onClick={handleSave}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
        </Button>

        {/* Dietary badges */}
        {variant === "default" && restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {restaurant.dietary_options.slice(0, 3).map((option) => (
              <Badge key={option} variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
                {dietaryIcons[option.toLowerCase()] || <Leaf className="w-3 h-3" />}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("p-4", variant === "compact" && "flex-1 py-3")}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          {restaurant.rating && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {priceLevelDisplay(restaurant.price_level)}
          </span>
          <span>•</span>
          <span className="truncate">
            {restaurant.cuisine_types?.slice(0, 2).join(", ")}
          </span>
        </div>

        {/* Location */}
        {variant === "default" && restaurant.address && (
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{restaurant.city || restaurant.address}</span>
          </div>
        )}

        {/* Tags */}
        {variant === "default" && restaurant.tags && restaurant.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {restaurant.tags.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                +{restaurant.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
