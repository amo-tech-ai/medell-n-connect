import { GripVertical, MapPin, Clock, Trash2, Edit2, Navigation } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TripItem, TripItemType } from "@/types/trip";

interface ItemCardProps {
  item: TripItem;
  isDragging?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  previousItem?: TripItem | null;
}

const itemTypeColors: Record<TripItemType, string> = {
  apartment: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  car: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  restaurant: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  event: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  activity: "bg-green-500/10 text-green-600 border-green-500/20",
  transport: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  note: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const itemTypeLabels: Record<TripItemType, string> = {
  apartment: "Stay",
  car: "Car",
  restaurant: "Food",
  event: "Event",
  activity: "Activity",
  transport: "Transport",
  note: "Note",
};

const itemTypeIcons: Record<TripItemType, string> = {
  apartment: "🏠",
  car: "🚗",
  restaurant: "🍽️",
  event: "🎉",
  activity: "🎯",
  transport: "✈️",
  note: "📝",
};

export function ItemCard({ item, isDragging, onRemove, onEdit, previousItem }: ItemCardProps) {
  const itemType = item.item_type as TripItemType;
  const startTime = item.start_at ? format(parseISO(item.start_at), "h:mm a") : null;

  // Generate navigation URL to Google Maps / Apple Maps
  const getNavigationUrl = () => {
    if (!item.latitude || !item.longitude) return null;
    
    const destination = `${item.latitude},${item.longitude}`;
    const destinationName = encodeURIComponent(item.title);
    
    // Check if previous item has coordinates for directions
    if (previousItem?.latitude && previousItem?.longitude) {
      const origin = `${previousItem.latitude},${previousItem.longitude}`;
      // Google Maps directions URL
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&destination_place_id=${destinationName}&travelmode=driving`;
    }
    
    // Just navigate to the location
    return `https://www.google.com/maps/search/?api=1&query=${destination}&query_place_id=${destinationName}`;
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getNavigationUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const hasLocation = item.latitude && item.longitude;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border bg-card transition-all",
        isDragging && "shadow-lg ring-2 ring-primary",
        !isDragging && "hover:bg-accent/50"
      )}
    >
      {/* Drag Handle */}
      <div className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Icon */}
      <div className="text-xl flex-shrink-0">
        {itemTypeIcons[itemType]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{item.title}</span>
          <Badge className={cn("text-[10px] flex-shrink-0", itemTypeColors[itemType])}>
            {itemTypeLabels[itemType]}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {startTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {startTime}
            </span>
          )}
          {item.location_name && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {item.location_name}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {hasLocation && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary hover:text-primary"
            onClick={handleNavigate}
            title="Open in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        )}
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
