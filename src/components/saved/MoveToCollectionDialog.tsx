import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollections, useAddToCollection } from "@/hooks/useCollections";
import type { EnrichedSavedPlace } from "@/types/saved";
import { FolderPlus, Check } from "lucide-react";

interface MoveToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EnrichedSavedPlace | null;
  onCreateNew: () => void;
}

export function MoveToCollectionDialog({
  open,
  onOpenChange,
  item,
  onCreateNew,
}: MoveToCollectionDialogProps) {
  const { data: collections = [] } = useCollections();
  const addToCollection = useAddToCollection();

  const handleSelect = async (collectionId: string | null) => {
    if (!item) return;

    await addToCollection.mutateAsync({
      savedPlaceId: item.id,
      collectionId,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[300px]">
          <div className="space-y-2 pr-4">
            {/* Remove from collection option */}
            {item?.collection_id && (
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => handleSelect(null)}
                disabled={addToCollection.isPending}
              >
                <span className="text-lg mr-3">❌</span>
                <div className="text-left">
                  <p className="font-medium">Remove from collection</p>
                  <p className="text-xs text-muted-foreground">Move back to general saves</p>
                </div>
              </Button>
            )}

            {/* Collections list */}
            {collections.map((collection) => (
              <Button
                key={collection.id}
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => handleSelect(collection.id)}
                disabled={addToCollection.isPending}
              >
                <span className="text-lg mr-3">{collection.emoji || "📁"}</span>
                <div className="text-left flex-1">
                  <p className="font-medium">{collection.name}</p>
                  {collection.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {collection.description}
                    </p>
                  )}
                </div>
                {item?.collection_id === collection.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </Button>
            ))}

            {/* Create new collection */}
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 border-dashed"
              onClick={() => {
                onOpenChange(false);
                onCreateNew();
              }}
            >
              <FolderPlus className="w-5 h-5 mr-3 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Create New Collection</p>
                <p className="text-xs text-muted-foreground">Organize your saves</p>
              </div>
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
