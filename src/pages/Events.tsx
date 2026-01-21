import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { ThreePanelLayout, useThreePanelContext } from "@/components/explore/ThreePanelLayout";
import { EventCard } from "@/components/events/EventCard";
import { EnhancedEventFilters } from "@/components/events/EnhancedEventFilters";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useEvents } from "@/hooks/useEvents";
import type { EventFilters as EventFiltersType, Event } from "@/types/event";
import type { SelectedItem } from "@/context/ThreePanelContext";

function EventsContent() {
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("grid");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { data: events, isLoading, error } = useEvents(filters);
  const { openDetailPanel } = useThreePanelContext();

  const handleEventSelect = (event: Event) => {
    setSelectedId(event.id);
    const selectedItem: SelectedItem = {
      type: "event",
      id: event.id,
      data: event,
    };
    openDetailPanel(selectedItem);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Events</h1>
        <p className="text-muted-foreground mt-1">
          Discover concerts, festivals, meetups, and more in Medellín
        </p>
      </div>

      {/* Enhanced Filters */}
      <EnhancedEventFilters
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={events?.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
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
      ) : viewMode === "calendar" ? (
        <div className="max-w-lg mx-auto">
          <EventsCalendar
            events={events || []}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEventSelect={handleEventSelect}
          />
        </div>
      ) : events?.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try adjusting your filters or check back later for new events."
          icon={<Calendar className="w-8 h-8 text-muted-foreground" />}
        />
      ) : (
        <div className={viewMode === "list" 
          ? "space-y-4" 
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }>
          {events?.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              isSelected={selectedId === event.id}
              onSelect={() => handleEventSelect(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Events() {
  return (
    <ThreePanelLayout>
      <EventsContent />
    </ThreePanelLayout>
  );
}
