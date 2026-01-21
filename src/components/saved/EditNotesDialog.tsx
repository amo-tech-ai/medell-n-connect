import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSavedPlaceNotes } from "@/hooks/useCollections";
import type { EnrichedSavedPlace } from "@/types/saved";

interface EditNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EnrichedSavedPlace | null;
}

export function EditNotesDialog({ open, onOpenChange, item }: EditNotesDialogProps) {
  const [notes, setNotes] = useState("");
  const updateNotes = useUpdateSavedPlaceNotes();

  useEffect(() => {
    if (item) {
      setNotes(item.notes || "");
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    await updateNotes.mutateAsync({
      savedPlaceId: item.id,
      notes: notes.trim(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {item?.notes ? "Edit Notes" : "Add Notes"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <span className="text-2xl">
              {item?.location_type === "apartment" && "🏠"}
              {item?.location_type === "car" && "🚗"}
              {item?.location_type === "restaurant" && "🍽️"}
              {item?.location_type === "event" && "🎉"}
            </span>
            <div>
              <p className="font-medium line-clamp-1">{item?.resource?.title}</p>
              <p className="text-sm text-muted-foreground">{item?.resource?.location}</p>
            </div>
          </div>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes, reminders, or thoughts about this place..."
            rows={4}
            autoFocus
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateNotes.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateNotes.isPending}>
              {updateNotes.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
