import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCollection, useUpdateCollection } from "@/hooks/useCollections";
import type { Collection } from "@/types/saved";

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCollection?: Collection | null;
}

const EMOJI_OPTIONS = ["📍", "🏠", "🍽️", "🚗", "🎉", "❤️", "⭐", "🌴", "☀️", "🌙"];

export function CreateCollectionDialog({
  open,
  onOpenChange,
  editCollection,
}: CreateCollectionDialogProps) {
  const [name, setName] = useState(editCollection?.name || "");
  const [description, setDescription] = useState(editCollection?.description || "");
  const [emoji, setEmoji] = useState(editCollection?.emoji || "📍");

  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editCollection) {
      await updateCollection.mutateAsync({
        id: editCollection.id,
        name: name.trim(),
        description: description.trim() || undefined,
        emoji,
      });
    } else {
      await createCollection.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        emoji,
      });
    }

    setName("");
    setDescription("");
    setEmoji("📍");
    onOpenChange(false);
  };

  const isLoading = createCollection.isPending || updateCollection.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editCollection ? "Edit Collection" : "Create Collection"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emoji">Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                    emoji === e
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekend Trip Ideas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this collection for?"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading
                ? "Saving..."
                : editCollection
                ? "Save Changes"
                : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
