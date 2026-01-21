import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, differenceInDays } from "date-fns";
import { ArrowLeft, Calendar, MapPin, DollarSign, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreePanelLayout } from "@/components/explore/ThreePanelLayout";
import { DayTimeline } from "@/components/trips/DayTimeline";
import { useTrip, useUpdateTrip } from "@/hooks/useTrips";
import { useDeleteTripItem } from "@/hooks/useTripItems";
import { EmptyState } from "@/components/listings/EmptyState";
import { cn } from "@/lib/utils";
import type { TripStatus, TripItem } from "@/types/trip";
import { toast } from "sonner";

const statusColors: Record<TripStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-primary text-primary-foreground",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-destructive/10 text-destructive",
};

function TripDetailContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: trip, isLoading, error } = useTrip(id!);
  const updateTrip = useUpdateTrip();
  const deleteTripItem = useDeleteTripItem();

  const handleStatusChange = async (status: TripStatus) => {
    if (!trip) return;
    try {
      await updateTrip.mutateAsync({ id: trip.id, status });
      toast.success(`Trip marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRemoveItem = async (item: TripItem) => {
    try {
      await deleteTripItem.mutateAsync({ id: item.id, trip_id: item.trip_id });
      toast.success("Item removed from trip");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="p-6">
        <EmptyState
          title="Trip not found"
          description="This trip doesn't exist or you don't have access to it."
          action={{ label: "Back to Trips", onClick: () => navigate("/trips") }}
        />
      </div>
    );
  }

  const startDate = parseISO(trip.start_date);
  const endDate = parseISO(trip.end_date);
  const days = differenceInDays(endDate, startDate) + 1;
  const status = trip.status as TripStatus;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            onClick={() => navigate("/trips")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Trips
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold">{trip.title}</h1>
            <Badge className={cn(statusColors[status])}>{status}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {trip.destination && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {trip.destination}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
              <span className="text-muted-foreground/60">({days} days)</span>
            </span>
            {trip.budget && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {trip.currency || "USD"} {trip.budget.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {status === "draft" && (
            <Button onClick={() => handleStatusChange("active")}>
              Activate Trip
            </Button>
          )}
          {status === "active" && (
            <Button onClick={() => handleStatusChange("completed")}>
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      {trip.description && (
        <p className="text-muted-foreground">{trip.description}</p>
      )}

      {/* Day Timeline */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
        <DayTimeline
          startDate={trip.start_date}
          endDate={trip.end_date}
          items={trip.items}
          onRemoveItem={handleRemoveItem}
          onAddItem={(dayIndex) => {
            toast.info("Add item feature coming soon!");
          }}
        />
      </div>
    </div>
  );
}

export default function TripDetail() {
  return (
    <ThreePanelLayout>
      <TripDetailContent />
    </ThreePanelLayout>
  );
}
