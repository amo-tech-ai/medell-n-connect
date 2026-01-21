import { Link } from "react-router-dom";
import { Heart, Calendar, Clock, MapPin, Ticket, Expand, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useIsSaved, useToggleSave } from "@/hooks/useSavedPlaces";
import type { Event } from "@/types/event";
import { format } from "date-fns";

interface EventDetailPanelProps {
  event: Event;
}

export function EventDetailPanel({ event }: EventDetailPanelProps) {
  const { user } = useAuth();
  const { data: isSaved = false } = useIsSaved(event.id, "event");
  const toggleSave = useToggleSave();

  const handleSave = () => {
    if (!user) return;
    toggleSave.mutate({
      locationId: event.id,
      locationType: "event",
      isSaved,
    });
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
    <div className="space-y-6">
      {/* View Full Page Button */}
      <Button asChild variant="outline" className="w-full">
        <Link to={`/events/${event.id}`}>
          <Expand className="w-4 h-4 mr-2" />
          View Full Page
        </Link>
      </Button>

      {/* Event Header */}
      <div className="space-y-2">
        <Badge variant="secondary" className={getEventTypeColor(event.event_type)}>
          {event.event_type || "Event"}
        </Badge>
        <h3 className="text-lg font-semibold line-clamp-2">{event.name}</h3>
        {event.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{event.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({event.rating_count || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Get Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">
              {formatPrice()}
            </div>
            {isFree && <Badge className="mt-2 bg-green-500 text-white">Free Event</Badge>}
          </div>
          {event.ticket_url ? (
            <Button className="w-full" size="lg" asChild>
              <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                <Ticket className="w-4 h-4 mr-2" />
                Get Tickets
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </Button>
          ) : (
            <Button className="w-full" size="lg">
              <Ticket className="w-4 h-4 mr-2" />
              Check Availability
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">
              {format(new Date(event.event_start_time), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(new Date(event.event_start_time), "h:mm a")}
              {event.event_end_time &&
                ` - ${format(new Date(event.event_end_time), "h:mm a")}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.address || event.city || "Medellín"}
            </p>
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
        {isSaved ? "Saved" : "Save Event"}
      </Button>

      {/* View Full Page (Footer) */}
      <Button asChild variant="ghost" className="w-full text-muted-foreground">
        <Link to={`/events/${event.id}`}>
          View Full Page →
        </Link>
      </Button>
    </div>
  );
}
