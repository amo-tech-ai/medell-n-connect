import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, Plus, Plane, X, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTripContext } from "@/context/TripContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Trip, TripStatus } from "@/types/trip";

interface TripSelectorProps {
  collapsed?: boolean;
  className?: string;
}

const statusColors: Record<TripStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-primary/10 text-primary",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-destructive/10 text-destructive",
};

export function TripSelector({ collapsed = false, className }: TripSelectorProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const {
    activeTrip,
    trips,
    upcomingTrips,
    pastTrips,
    isLoadingTrips,
    setActiveTrip,
    clearActiveTrip,
  } = useTripContext();

  // Don't render for unauthenticated users
  if (!user) {
    return null;
  }

  const handleSelectTrip = (trip: Trip) => {
    setActiveTrip(trip);
    setOpen(false);
  };

  const handleClearTrip = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearActiveTrip();
  };

  // Collapsed view - just show icon
  if (collapsed) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-10 h-10 relative",
              activeTrip && "text-primary",
              className
            )}
          >
            <Plane className="w-5 h-5" />
            {activeTrip && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-72 p-0">
          <TripSelectorContent
            activeTrip={activeTrip}
            trips={trips}
            upcomingTrips={upcomingTrips}
            pastTrips={pastTrips}
            isLoading={isLoadingTrips}
            onSelectTrip={handleSelectTrip}
            onClearTrip={handleClearTrip}
            onClose={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Expanded view
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-4 py-3 h-auto text-left",
            activeTrip
              ? "bg-primary/5 hover:bg-primary/10 border border-primary/20"
              : "hover:bg-sidebar-accent/50",
            className
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              activeTrip ? "bg-primary/10" : "bg-muted"
            )}
          >
            <Plane className={cn("w-4 h-4", activeTrip ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div className="flex-1 min-w-0">
            {activeTrip ? (
              <>
                <p className="text-sm font-medium truncate">{activeTrip.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(activeTrip.start_date), "MMM d")} -{" "}
                  {format(parseISO(activeTrip.end_date), "MMM d, yyyy")}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground">No active trip</p>
                <p className="text-xs text-muted-foreground">Select or create one</p>
              </>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <TripSelectorContent
          activeTrip={activeTrip}
          trips={trips}
          upcomingTrips={upcomingTrips}
          pastTrips={pastTrips}
          isLoading={isLoadingTrips}
          onSelectTrip={handleSelectTrip}
          onClearTrip={handleClearTrip}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

interface TripSelectorContentProps {
  activeTrip: Trip | null;
  trips: Trip[];
  upcomingTrips: Trip[];
  pastTrips: Trip[];
  isLoading: boolean;
  onSelectTrip: (trip: Trip) => void;
  onClearTrip: (e: React.MouseEvent) => void;
  onClose: () => void;
}

function TripSelectorContent({
  activeTrip,
  trips,
  upcomingTrips,
  pastTrips,
  isLoading,
  onSelectTrip,
  onClearTrip,
  onClose,
}: TripSelectorContentProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Trip Context</h4>
          {activeTrip && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={onClearTrip}
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        {activeTrip && (
          <p className="text-xs text-muted-foreground mt-1">
            Saved places will be linked to this trip
          </p>
        )}
      </div>

      <ScrollArea className="max-h-[300px]">
        {trips.length === 0 ? (
          <div className="p-6 text-center">
            <Plane className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No trips yet</p>
            <Button size="sm" asChild onClick={onClose}>
              <Link to="/trips/new">
                <Plus className="w-4 h-4 mr-1" />
                Create your first trip
              </Link>
            </Button>
          </div>
        ) : (
          <div className="p-2">
            {/* Upcoming trips */}
            {upcomingTrips.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Upcoming
                </p>
                {upcomingTrips.map((trip) => (
                  <TripOptionItem
                    key={trip.id}
                    trip={trip}
                    isActive={activeTrip?.id === trip.id}
                    onSelect={onSelectTrip}
                  />
                ))}
              </div>
            )}

            {/* Past trips */}
            {pastTrips.length > 0 && (
              <div>
                {upcomingTrips.length > 0 && <Separator className="my-2" />}
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Past
                </p>
                {pastTrips.slice(0, 5).map((trip) => (
                  <TripOptionItem
                    key={trip.id}
                    trip={trip}
                    isActive={activeTrip?.id === trip.id}
                    onSelect={onSelectTrip}
                  />
                ))}
                {pastTrips.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground"
                    asChild
                    onClick={onClose}
                  >
                    <Link to="/trips">View all {pastTrips.length} past trips</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {trips.length > 0 && (
        <div className="p-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            asChild
            onClick={onClose}
          >
            <Link to="/trips/new">
              <Plus className="w-4 h-4 mr-1" />
              Create New Trip
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

interface TripOptionItemProps {
  trip: Trip;
  isActive: boolean;
  onSelect: (trip: Trip) => void;
}

function TripOptionItem({ trip, isActive, onSelect }: TripOptionItemProps) {
  const status = trip.status as TripStatus;

  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-accent"
      )}
      onClick={() => onSelect(trip)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{trip.title}</span>
          {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {format(parseISO(trip.start_date), "MMM d")} -{" "}
            {format(parseISO(trip.end_date), "MMM d")}
          </span>
        </div>
      </div>
      <Badge className={cn("text-[10px]", statusColors[status])}>
        {status}
      </Badge>
    </button>
  );
}
