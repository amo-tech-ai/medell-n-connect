import { useState } from "react";
import { FolderPlus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useCollections, useDeleteCollection } from "@/hooks/useCollections";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import type { Collection } from "@/types/saved";
import { cn } from "@/lib/utils";

interface CollectionsListProps {
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
}

export function CollectionsList({
  selectedCollectionId,
  onSelectCollection,
}: CollectionsListProps) {
  const { data: collections = [], isLoading } = useCollections();
  const deleteCollection = useDeleteCollection();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editCollection, setEditCollection] = useState<Collection | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteCollection.mutateAsync(deleteConfirmId);
    if (selectedCollectionId === deleteConfirmId) {
      onSelectCollection(null);
    }
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* All Saved button */}
      <button
        onClick={() => onSelectCollection(null)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
          selectedCollectionId === null
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-muted/50 text-foreground"
        )}
      >
        <span className="text-lg">❤️</span>
        <span>All Saved</span>
      </button>

      {/* Collections */}
      {collections.map((collection) => (
        <div
          key={collection.id}
          className={cn(
            "group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
            selectedCollectionId === collection.id
              ? "bg-primary/10"
              : "hover:bg-muted/50"
          )}
        >
          <button
            onClick={() => onSelectCollection(collection.id)}
            className={cn(
              "flex-1 flex items-center gap-3 text-sm text-left",
              selectedCollectionId === collection.id
                ? "text-primary font-medium"
                : "text-foreground"
            )}
          >
            <span className="text-lg">{collection.emoji || "📁"}</span>
            <span className="truncate">{collection.name}</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditCollection(collection)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteConfirmId(collection.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      {/* Create new collection */}
      <Button
        variant="outline"
        className="w-full justify-start gap-3 border-dashed"
        onClick={() => setCreateDialogOpen(true)}
      >
        <FolderPlus className="w-4 h-4" />
        New Collection
      </Button>

      {/* Dialogs */}
      <CreateCollectionDialog
        open={createDialogOpen || !!editCollection}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditCollection(null);
          }
        }}
        editCollection={editCollection}
      />

      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the collection but keep all saved items. They will be
              moved back to your general saves.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
