import { Link } from "react-router-dom";
import { Heart, Calendar, Expand, Users, Settings2, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import type { Car } from "@/types/listings";

interface CarDetailPanelProps {
  car: Car;
}

export function CarDetailPanel({ car }: CarDetailPanelProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(car.id, "car");
  const toggleSave = useToggleSave();

  const handleSave = () => {
    if (!user) return;
    toggleSave.mutate({
      locationId: car.id,
      locationType: "car",
      isSaved,
    });
  };

  const title = `${car.year || ""} ${car.make} ${car.model}`.trim();

  return (
    <div className="space-y-6">
      {/* View Full Page Button */}
      <Button asChild variant="outline" className="w-full">
        <Link to={`/cars/${car.id}`}>
          <Expand className="w-4 h-4 mr-2" />
          View Full Page
        </Link>
      </Button>

      {/* Car Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {car.vehicle_type && (
            <Badge variant="secondary">{car.vehicle_type}</Badge>
          )}
          {car.transmission && (
            <Badge variant="outline">{car.transmission}</Badge>
          )}
        </div>
        {car.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{car.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({car.review_count || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* Rent This Car Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Rent This Car</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              ${car.price_daily?.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">per day</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="font-medium">${car.price_weekly || "N/A"}</div>
              <div className="text-xs text-muted-foreground">weekly</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="font-medium">${car.price_monthly || "N/A"}</div>
              <div className="text-xs text-muted-foreground">monthly</div>
            </div>
          </div>
          <Button className="w-full" size="lg">
            <Calendar className="w-4 h-4 mr-2" />
            Check Availability
          </Button>
          <Button variant="outline" className="w-full">
            Contact Rental Company
          </Button>
        </CardContent>
      </Card>

      {/* Quick Specs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Specs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              Seats
            </span>
            <span className="font-medium">{car.seats || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Settings2 className="w-4 h-4" />
              Transmission
            </span>
            <span className="font-medium">{car.transmission || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Fuel className="w-4 h-4" />
              Fuel Type
            </span>
            <span className="font-medium">{car.fuel_type || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mileage</span>
            <span className="font-medium">
              {car.unlimited_mileage ? "Unlimited" : `${car.mileage_limit_daily || "N/A"} km/day`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        variant="outline"
        className={cn("w-full", isSaved && "text-red-500")}
        onClick={handleSave}
        disabled={!user || toggleSave.isPending}
      >
        <Heart className={cn("w-4 h-4 mr-2", isSaved && "fill-current")} />
        {isSaved ? "Saved" : "Save Car"}
      </Button>

      {/* View Full Page (Footer) */}
      <Button asChild variant="ghost" className="w-full text-muted-foreground">
        <Link to={`/cars/${car.id}`}>
          View Full Page →
        </Link>
      </Button>
    </div>
  );
}
