import { Link } from "react-router-dom";
import { Heart, Clock, Phone, Globe, ExternalLink, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import type { Restaurant } from "@/types/restaurant";

const priceLevelDisplay = (level: number) => "$".repeat(level);

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

interface RestaurantDetailPanelProps {
  restaurant: Restaurant;
}

export function RestaurantDetailPanel({ restaurant }: RestaurantDetailPanelProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(restaurant.id, "restaurant");
  const toggleSave = useToggleSave();

  const today = DAY_NAMES[new Date().getDay()];
  const todayHours = (restaurant.hours_of_operation as any)?.[today];

  const handleSave = () => {
    if (!user) return;
    toggleSave.mutate({
      locationId: restaurant.id,
      locationType: "restaurant",
      isSaved,
    });
  };

  return (
    <div className="space-y-6">
      {/* View Full Page Button */}
      <Button asChild variant="outline" className="w-full">
        <Link to={`/restaurants/${restaurant.id}`}>
          <Expand className="w-4 h-4 mr-2" />
          View Full Page
        </Link>
      </Button>

      {/* Restaurant Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold line-clamp-2">{restaurant.name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {priceLevelDisplay(restaurant.price_level)}
          </span>
          <span>•</span>
          <span className="truncate">{restaurant.cuisine_types?.slice(0, 2).join(", ")}</span>
        </div>
        {restaurant.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({restaurant.rating_count || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* Reserve Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Make a Reservation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" size="lg">
            Reserve a Table
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            AI-powered reservations coming soon
          </p>
        </CardContent>
      </Card>

      {/* Today's Hours */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Hours Today</CardTitle>
        </CardHeader>
        <CardContent>
          {todayHours ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                {todayHours.open} - {todayHours.close}
              </span>
              {restaurant.is_open_now && (
                <Badge variant="outline" className="ml-auto text-green-600 border-green-600">
                  Open
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Hours not available</p>
          )}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 text-muted-foreground" />
              {restaurant.phone}
            </a>
          )}
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4 text-muted-foreground" />
              Visit Website
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
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
        {isSaved ? "Saved" : "Save Restaurant"}
      </Button>

      {/* View Full Page (Footer) */}
      <Button asChild variant="ghost" className="w-full text-muted-foreground">
        <Link to={`/restaurants/${restaurant.id}`}>
          View Full Page →
        </Link>
      </Button>
    </div>
  );
}
