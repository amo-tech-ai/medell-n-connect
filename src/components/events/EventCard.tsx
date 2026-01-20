import { Heart, MapPin, Calendar, Clock, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import { useAuth } from "@/hooks/useAuth";
import type { Event } from "@/types/event";
import { format } from "date-fns";
import eventPlaceholder from "@/assets/event-1.jpg";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(event.id, "event");
  const toggleSave = useToggleSave();

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleSave.mutate({
      locationId: event.id,
      locationType: "event",
      isSaved,
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEE, MMM d");
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  const getEventTypeColor = (type: string | null) => {
    const colors: Record<string, string> = {
      concert: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      festival: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      sports: "bg-green-500/10 text-green-600 dark:text-green-400",
      tech: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      social: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      culture: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      food: "bg-red-500/10 text-red-600 dark:text-red-400",
      nightlife: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    };
    return colors[type || ""] || "bg-muted text-muted-foreground";
  };

  const formatPrice = () => {
    if (!event.ticket_price_min && !event.ticket_price_max) {
      return "Free";
    }
    const currency = event.currency || "COP";
    const min = event.ticket_price_min?.toLocaleString() || "0";
    const max = event.ticket_price_max?.toLocaleString();
    
    if (max && event.ticket_price_max !== event.ticket_price_min) {
      return `${currency} $${min} - $${max}`;
    }
    return `${currency} $${min}`;
  };

  const isFree = !event.ticket_price_min && !event.ticket_price_max;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={event.primary_image_url || eventPlaceholder}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
              isSaved && "text-red-500"
            )}
            onClick={handleSave}
            disabled={toggleSave.isPending}
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
          </Button>

          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
            <div className="text-xs font-medium text-muted-foreground">
              {format(new Date(event.event_start_time), "MMM")}
            </div>
            <div className="text-lg font-bold text-foreground">
              {format(new Date(event.event_start_time), "d")}
            </div>
          </div>

          {/* Free Badge */}
          {isFree && (
            <Badge className="absolute bottom-3 left-3 bg-green-500 text-white">
              Free
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Event Type */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getEventTypeColor(event.event_type)}>
              {event.event_type || "Event"}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {event.name}
          </h3>

          {/* Date & Time */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatEventDate(event.event_start_time)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatEventTime(event.event_start_time)}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.address || event.city || "Medellín"}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 text-sm">
              <Ticket className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{formatPrice()}</span>
            </div>
            {event.rating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{event.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
