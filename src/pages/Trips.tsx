import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, useThreePanelContext } from "@/components/explore/ThreePanelLayout";
import { TripCard } from "@/components/trips/TripCard";
import { TripFilters } from "@/components/trips/TripFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useTrips, useDeleteTrip, useArchiveTrip, useUnarchiveTrip } from "@/hooks/useTrips";
import { useAuth } from "@/hooks/useAuth";
import type { Trip, TripStatus } from "@/types/trip";
import type { SelectedItem } from "@/context/ThreePanelContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function TripsContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [tripToArchive, setTripToArchive] = useState<Trip | null>(null);
  const { openDetailPanel } = useThreePanelContext();

  const filters = {
    search: search || undefined,
    status: statusFilter !== "all" ? [statusFilter] : undefined,
  };

  const { data, isLoading, error } = useTrips(filters);
  const deleteTrip = useDeleteTrip();
  const archiveTrip = useArchiveTrip();
  const unarchiveTrip = useUnarchiveTrip();

  const handleTripSelect = (trip: Trip) => {
    setSelectedId(trip.id);
    const selectedItem: SelectedItem = {
      type: "trip" as any,
      id: trip.id,
      data: trip,
    };
    openDetailPanel(selectedItem);
  };

  const handleEdit = (trip: Trip) => {
    navigate(`/trips/${trip.id}`);
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;
    
    try {
      await deleteTrip.mutateAsync(tripToDelete.id);
      toast.success("Trip deleted");
      setTripToDelete(null);
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  const handleArchive = async () => {
    if (!tripToArchive) return;
    
    try {
      await archiveTrip.mutateAsync(tripToArchive.id);
      toast.success("Trip archived");
      setTripToArchive(null);
    } catch (error) {
      toast.error("Failed to archive trip");
    }
  };

  const handleUnarchive = async (trip: Trip) => {
    try {
      await unarchiveTrip.mutateAsync(trip.id);
      toast.success("Trip restored");
    } catch (error) {
      toast.error("Failed to restore trip");
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <EmptyState
          title="Sign in to view your trips"
          description="Create an account to start planning your adventures."
          action={{ label: "Sign In", onClick: () => navigate("/login") }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">Plan and manage your adventures</p>
        </div>
        <Button onClick={() => navigate("/trips/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Trip
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <TripFilters activeStatus={statusFilter} onStatusChange={setStatusFilter} />
      </div>

      {isLoading ? (
        <ListingSkeleton count={4} />
      ) : error ? (
        <EmptyState
          title="Error loading trips"
          description="Something went wrong. Please try again."
          action={{ label: "Retry", onClick: () => window.location.reload() }}
        />
      ) : !data?.trips.length ? (
        <EmptyState
          icon={<Plane className="w-12 h-12 text-muted-foreground" />}
          title="No trips yet"
          description="Start planning your first adventure in Medellín!"
          action={{ label: "Create Trip", onClick: () => navigate("/trips/new") }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isSelected={selectedId === trip.id}
              onSelect={handleTripSelect}
              onEdit={handleEdit}
              onDelete={setTripToDelete}
              onArchive={setTripToArchive}
              onUnarchive={handleUnarchive}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!tripToDelete} onOpenChange={() => setTripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tripToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!tripToArchive} onOpenChange={() => setTripToArchive(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Archive "{tripToArchive?.title}"? Archived trips are marked as completed and moved to your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function Trips() {
  return (
    <ThreePanelLayout>
      <TripsContent />
    </ThreePanelLayout>
  );
}
