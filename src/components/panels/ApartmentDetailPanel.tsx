import { Link } from "react-router-dom";
import { Heart, Calendar, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import type { Apartment } from "@/types/listings";

interface ApartmentDetailPanelProps {
  apartment: Apartment;
}

export function ApartmentDetailPanel({ apartment }: ApartmentDetailPanelProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(apartment.id, "apartment");
  const toggleSave = useToggleSave();

  const handleSave = () => {
    if (!user) return;
    toggleSave.mutate({
      locationId: apartment.id,
      locationType: "apartment",
      isSaved,
    });
  };

  const priceDisplay = apartment.price_monthly
    ? `$${apartment.price_monthly.toLocaleString()}/mo`
    : apartment.price_weekly
    ? `$${apartment.price_weekly.toLocaleString()}/wk`
    : apartment.price_daily
    ? `$${apartment.price_daily.toLocaleString()}/day`
    : "Contact for price";

  return (
    <div className="space-y-6">
      {/* View Full Page Button */}
      <Button asChild variant="outline" className="w-full">
        <Link to={`/apartments/${apartment.id}`}>
          <Expand className="w-4 h-4 mr-2" />
          View Full Page
        </Link>
      </Button>

      {/* Apartment Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold line-clamp-2">{apartment.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{priceDisplay}</span>
          <span>•</span>
          <span>{apartment.neighborhood}</span>
        </div>
        {apartment.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{apartment.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({apartment.review_count || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* Book This Place Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Book This Place</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              ${apartment.price_monthly?.toLocaleString() || "N/A"}
            </div>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="font-medium">${apartment.price_weekly || "N/A"}</div>
              <div className="text-xs text-muted-foreground">weekly</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="font-medium">${apartment.price_daily || "N/A"}</div>
              <div className="text-xs text-muted-foreground">daily</div>
            </div>
          </div>
          <Button className="w-full" size="lg">
            <Calendar className="w-4 h-4 mr-2" />
            Check Availability
          </Button>
          <Button variant="outline" className="w-full">
            Contact Host
          </Button>
        </CardContent>
      </Card>

      {/* Key Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Key Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bedrooms</span>
            <span className="font-medium">{apartment.bedrooms || 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bathrooms</span>
            <span className="font-medium">{apartment.bathrooms || 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Min Stay</span>
            <span className="font-medium">{apartment.minimum_stay_days || 1} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">WiFi Speed</span>
            <span className="font-medium">{apartment.wifi_speed ? `${apartment.wifi_speed} Mbps` : "N/A"}</span>
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
        {isSaved ? "Saved" : "Save Apartment"}
      </Button>

      {/* View Full Page (Footer) */}
      <Button asChild variant="ghost" className="w-full text-muted-foreground">
        <Link to={`/apartments/${apartment.id}`}>
          View Full Page →
        </Link>
      </Button>
    </div>
  );
}
