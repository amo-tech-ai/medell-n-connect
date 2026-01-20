import { useState } from "react";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { ThreePanelLayout } from "@/components/layout/ThreePanelLayout";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useEvents } from "@/hooks/useEvents";
import type { EventFilters as EventFiltersType } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, addDays } from "date-fns";

export default function Events() {
  const [filters, setFilters] = useState<EventFiltersType>({});
  const { data: events, isLoading, error } = useEvents(filters);

  // Get upcoming events count by type
  const getEventTypeCounts = () => {
    if (!events) return {};
    return events.reduce((acc, event) => {
      const type = event.event_type || "other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const eventTypeCounts = getEventTypeCounts();

  // Get events happening this week
  const thisWeekEvents = events?.filter((event) => {
    const eventDate = new Date(event.event_start_time);
    const weekFromNow = addDays(new Date(), 7);
    return eventDate <= weekFromNow && eventDate >= new Date();
  });

  const rightPanelContent = (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Events</span>
            <span className="font-semibold">{events?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">This Week</span>
            <span className="font-semibold">{thisWeekEvents?.length || 0}</span>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">By Category</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(eventTypeCounts).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Week Highlights */}
      {thisWeekEvents && thisWeekEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Happening This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {thisWeekEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="text-center bg-primary/10 rounded-lg px-2 py-1 min-w-[48px]">
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(event.event_start_time), "MMM")}
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {format(new Date(event.event_start_time), "d")}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{event.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {event.address || event.city}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Location Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Showing events in <span className="font-medium text-foreground">Medellín</span> and surrounding areas.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ThreePanelLayout rightPanelContent={rightPanelContent}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">
            Discover concerts, festivals, meetups, and more in Medellín
          </p>
        </div>

        {/* Filters */}
        <EventFilters
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={events?.length}
        />

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Error loading events"
            description="There was a problem loading events. Please try again."
            icon={<Calendar className="w-8 h-8 text-muted-foreground" />}
          />
        ) : events?.length === 0 ? (
          <EmptyState
            title="No events found"
            description="Try adjusting your filters or check back later for new events."
            icon={<Calendar className="w-8 h-8 text-muted-foreground" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </ThreePanelLayout>
  );
}
