import { forwardRef, useState } from "react";
import { Heart, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Place } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  place: Place;
  variant?: "default" | "compact";
}

export const PlaceCard = forwardRef<HTMLAnchorElement, PlaceCardProps>(
  function PlaceCard({ place, variant = "default" }, ref) {
    const [isSaved, setIsSaved] = useState(place.saved ?? false);

    const categoryLabels: Record<string, string> = {
      apartments: "STAYS",
      restaurants: "RESTAURANTS",
      events: "EVENTS",
      cars: "CARS",
    };

    return (
      <Link
        ref={ref}
      to={`/${place.type}/${place.id}`}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300",
        variant === "compact" && "flex"
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
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-xs font-medium"
        >
          {categoryLabels[place.type]}
        </Badge>
        <Button
          variant="save"
          size="icon"
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
            isSaved && "opacity-100 bg-primary text-primary-foreground border-primary"
          )}
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
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
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium">{place.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span className="font-medium">{place.price}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {place.distance}
          </span>
        </div>

        {variant === "default" && place.tags.length > 0 && (
          <div className="mt-3 flex items-center gap-1 text-sm text-primary">
            <span className="text-accent">✨</span>
            <span className="line-clamp-1">{place.tags.slice(0, 2).join(" • ")}</span>
          </div>
          )}
        </div>
      </Link>
    );
  }
);
