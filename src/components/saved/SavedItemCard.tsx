import { Heart, Star, MapPin, MoreVertical, Trash2, FolderPlus, StickyNote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { EnrichedSavedPlace } from "@/types/saved";
import { format } from "date-fns";
import { useToggleSave } from "@/hooks/useSavedPlaces";

import apartmentPlaceholder from "@/assets/apartment-1.jpg";
import carPlaceholder from "@/assets/car-1.jpg";
import restaurantPlaceholder from "@/assets/restaurant-1.jpg";
import eventPlaceholder from "@/assets/event-1.jpg";

interface SavedItemCardProps {
  item: EnrichedSavedPlace;
  onMoveToCollection?: (item: EnrichedSavedPlace) => void;
  onEditNotes?: (item: EnrichedSavedPlace) => void;
}

const placeholders: Record<string, string> = {
  apartment: apartmentPlaceholder,
  car: carPlaceholder,
  restaurant: restaurantPlaceholder,
  event: eventPlaceholder,
};

const typeLabels: Record<string, string> = {
  apartment: "Stay",
  car: "Car",
  restaurant: "Restaurant",
  event: "Event",
};

const typeColors: Record<string, string> = {
  apartment: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  car: "bg-green-500/10 text-green-600 dark:text-green-400",
  restaurant: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  event: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export function SavedItemCard({ item, onMoveToCollection, onEditNotes }: SavedItemCardProps) {
  const toggleSave = useToggleSave();
  const resource = item.resource;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave.mutate({
      locationId: item.location_id,
      locationType: item.location_type,
      isSaved: true, // We're removing, so it's currently saved
    });
  };

  const handleMenuAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const image = resource?.image || placeholders[item.location_type];
  const title = resource?.title || "Saved Item";
  const detailUrl = `/${item.location_type}s/${item.location_id}`;

  return (
    <Link
      to={detailUrl}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Type Badge */}
        <Badge
          className={cn(
            "absolute top-3 left-3 text-xs font-medium",
            typeColors[item.location_type]
          )}
        >
          {typeLabels[item.location_type]}
        </Badge>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onMoveToCollection && (
                <DropdownMenuItem
                  onClick={(e) => handleMenuAction(e, () => onMoveToCollection(item))}
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Add to Collection
                </DropdownMenuItem>
              )}
              {onEditNotes && (
                <DropdownMenuItem
                  onClick={(e) => handleMenuAction(e, () => onEditNotes(item))}
                >
                  <StickyNote className="w-4 h-4 mr-2" />
                  {item.notes ? "Edit Notes" : "Add Notes"}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleRemove}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
            onClick={handleRemove}
          >
            <Heart className="w-4 h-4 fill-current" />
          </Button>
        </div>

        {/* Saved date */}
        <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-muted-foreground">
          Saved {format(new Date(item.saved_at), "MMM d")}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          {resource?.rating && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium">{resource.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          {resource?.price && (
            <>
              <span className="font-semibold text-foreground">{resource.price}</span>
              <span>•</span>
            </>
          )}
          {resource?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {resource.location}
            </span>
          )}
        </div>

        {/* Notes preview */}
        {item.notes && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground line-clamp-2">{item.notes}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
