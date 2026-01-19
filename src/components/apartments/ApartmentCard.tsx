import { Heart, Star, MapPin, Wifi, Bed, Bath, Car, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Apartment } from "@/types/listings";
import { useAuth } from "@/hooks/useAuth";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import apartmentPlaceholder from "@/assets/apartment-1.jpg";

interface ApartmentCardProps {
  apartment: Apartment;
  variant?: "default" | "compact";
}

export function ApartmentCard({ apartment, variant = "default" }: ApartmentCardProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(apartment.id, "apartment");
  const toggleSave = useToggleSave();
  const [imageError, setImageError] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // Could redirect to login
      return;
    }
    toggleSave.mutate({
      locationId: apartment.id,
      locationType: "apartment",
      isSaved,
    });
  };

  const mainImage = !imageError && apartment.images?.[0] ? apartment.images[0] : apartmentPlaceholder;
  const priceDisplay = apartment.price_monthly
    ? `$${apartment.price_monthly.toLocaleString()}/mo`
    : apartment.price_weekly
    ? `$${apartment.price_weekly.toLocaleString()}/wk`
    : apartment.price_daily
    ? `$${apartment.price_daily.toLocaleString()}/day`
    : "Contact for price";

  return (
    <Link
      to={`/apartments/${apartment.id}`}
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
          src={mainImage}
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {apartment.featured && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Featured
            </Badge>
          )}
          {apartment.verified && (
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

        {/* Image indicator */}
        {variant === "default" && apartment.images && apartment.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {apartment.images.slice(0, 5).map((_, i) => (
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
            {apartment.title}
          </h3>
          {apartment.rating && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium">{apartment.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{priceDisplay}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {apartment.neighborhood}
          </span>
        </div>

        {/* Property details */}
        {variant === "default" && (
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            {apartment.bedrooms && (
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {apartment.bedrooms} bed
              </span>
            )}
            {apartment.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {apartment.bathrooms} bath
              </span>
            )}
            {apartment.wifi_speed && (
              <span className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                {apartment.wifi_speed} Mbps
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {variant === "default" && apartment.amenities && apartment.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {apartment.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs font-normal">
                {amenity}
              </Badge>
            ))}
            {apartment.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                +{apartment.amenities.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
