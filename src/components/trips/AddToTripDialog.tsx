import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTrips } from "@/hooks/useTrips";
import { useAddTripItem } from "@/hooks/useTripItems";
import { useAuth } from "@/hooks/useAuth";
import type { TripItemType } from "@/types/trip";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format, parseISO, addDays } from "date-fns";

interface AddToTripDialogProps {
  itemType: TripItemType;
  sourceId: string;
  title: string;
  description?: string;
  locationName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  trigger?: React.ReactNode;
}

export function AddToTripDialog({
  itemType,
  sourceId,
  title,
  description,
  locationName,
  address,
  latitude,
  longitude,
  trigger,
}: AddToTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("0");
  const { user } = useAuth();
  const { data } = useTrips({ status: ["draft", "active"] });
  const addTripItem = useAddTripItem();

  const selectedTrip = data?.trips.find((t) => t.id === selectedTripId);
  
  // Generate day options for selected trip
  const getDayOptions = () => {
    if (!selectedTrip) return [];
    const start = parseISO(selectedTrip.start_date);
    const end = parseISO(selectedTrip.end_date);
    const days: { value: string; label: string }[] = [];
    
    let current = start;
    let dayIndex = 0;
    while (current <= end) {
      days.push({
        value: dayIndex.toString(),
        label: `Day ${dayIndex + 1} — ${format(current, "EEE, MMM d")}`,
      });
      current = addDays(current, 1);
      dayIndex++;
    }
    return days;
  };

  const handleAdd = async () => {
    if (!selectedTripId || !selectedTrip) {
      toast.error("Please select a trip");
      return;
    }

    const dayIndex = parseInt(selectedDay);
    const startAt = addDays(parseISO(selectedTrip.start_date), dayIndex);

    try {
      await addTripItem.mutateAsync({
        trip_id: selectedTripId,
        item_type: itemType,
        source_id: sourceId,
        title,
        description,
        location_name: locationName,
        address,
        latitude,
        longitude,
        start_at: startAt.toISOString(),
      });

      toast.success(`Added to ${selectedTrip.title}`);
      setOpen(false);
      setSelectedTripId("");
      setSelectedDay("0");
    } catch (error) {
      toast.error("Failed to add to trip");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add to Trip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Trip</DialogTitle>
          <DialogDescription>
            Add "{title}" to one of your trips.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Trip</label>
            <Select value={selectedTripId} onValueChange={setSelectedTripId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a trip" />
              </SelectTrigger>
              <SelectContent>
                {data?.trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTrip && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Day</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a day" />
                </SelectTrigger>
                <SelectContent>
                  {getDayOptions().map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!selectedTripId || addTripItem.isPending}>
            {addTripItem.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Add to Trip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
