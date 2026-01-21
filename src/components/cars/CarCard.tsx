import { Heart, Star, Car as CarIcon, Fuel, Users, Settings2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Car } from "@/types/listings";
import { useAuth } from "@/hooks/useAuth";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import carPlaceholder from "@/assets/car-1.jpg";

interface CarCardProps {
  car: Car;
  variant?: "default" | "compact";
  onSelect?: (car: Car) => void;
}

export function CarCard({ car, variant = "default", onSelect }: CarCardProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(car.id, "car");
  const toggleSave = useToggleSave();
  const [imageError, setImageError] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleSave.mutate({
      locationId: car.id,
      locationType: "car",
      isSaved,
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(car);
    }
  };

  const mainImage = !imageError && car.images?.[0] ? car.images[0] : carPlaceholder;
  const title = `${car.year || ""} ${car.make} ${car.model}`.trim();
  
  const priceDisplay = `$${car.price_daily}/day`;
  const weeklyPrice = car.price_weekly ? `$${car.price_weekly}/wk` : null;

  const vehicleTypeLabels: Record<string, string> = {
    sedan: "Sedan",
    suv: "SUV",
    compact: "Compact",
    van: "Van",
    luxury: "Luxury",
    pickup: "Pickup",
    convertible: "Convertible",
    minivan: "Minivan",
  };

  const CardWrapper = onSelect ? 'div' : Link;
  const cardProps = onSelect 
    ? { onClick: handleCardClick, className: cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer",
        variant === "compact" && "flex"
      )}
    : { to: `/cars/${car.id}`, className: cn(
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
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.featured && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Featured
            </Badge>
          )}
          {car.vehicle_type && (
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
              {vehicleTypeLabels[car.vehicle_type] || car.vehicle_type}
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
        {variant === "default" && car.images && car.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {car.images.slice(0, 5).map((_, i) => (
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
            {title}
          </h3>
          {car.rating && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium">{car.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm">
          <span className="font-semibold text-foreground">{priceDisplay}</span>
          {weeklyPrice && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{weeklyPrice}</span>
            </>
          )}
        </div>

        {/* Vehicle specs */}
        {variant === "default" && (
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            {car.seats && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {car.seats}
              </span>
            )}
            {car.transmission && (
              <span className="flex items-center gap-1">
                <Settings2 className="w-4 h-4" />
                {car.transmission === "automatic" ? "Auto" : "Manual"}
              </span>
            )}
            {car.fuel_type && (
              <span className="flex items-center gap-1">
                <Fuel className="w-4 h-4" />
                {car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1)}
              </span>
            )}
          </div>
        )}

        {/* Features */}
        {variant === "default" && (
          <div className="mt-3 flex flex-wrap gap-1">
            {car.has_gps && (
              <Badge variant="outline" className="text-xs font-normal">GPS</Badge>
            )}
            {car.has_ac && (
              <Badge variant="outline" className="text-xs font-normal">A/C</Badge>
            )}
            {car.unlimited_mileage && (
              <Badge variant="outline" className="text-xs font-normal">Unlimited miles</Badge>
            )}
            {car.insurance_included && (
              <Badge variant="outline" className="text-xs font-normal">
                <Check className="w-3 h-3 mr-1" />
                Insurance
              </Badge>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
