import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderOpen, Sparkles } from "lucide-react";
import { ThreePanelLayout } from "@/components/explore/ThreePanelLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { CreateCollectionDialog } from "@/components/saved/CreateCollectionDialog";
import { useCollections, useDeleteCollection } from "@/hooks/useCollections";
import { useCollectionPreviews } from "@/hooks/useCollectionPreviews";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState } from "@/components/listings/EmptyState";
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
import type { Collection } from "@/types/saved";

function CollectionsContent() {
  const { user } = useAuth();
  const { data: collections = [], isLoading } = useCollections();
  const { data: previews = {} } = useCollectionPreviews();
  const deleteCollection = useDeleteCollection();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editCollection, setEditCollection] = useState<Collection | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Collection | null>(null);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteCollection.mutateAsync(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  if (!user) {
    return (
      <div className="p-6">
        <EmptyState
          title="Sign in to view collections"
          description="Create an account to organize your saved places into collections."
          action={{ label: "Sign In", onClick: () => {} }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Collections</h1>
          <p className="text-muted-foreground mt-1">
            Organize your saved places into themed collections
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* AI Suggestion Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">AI Collection Suggestions</p>
            <p className="text-xs text-muted-foreground">
              Based on your saved places, we can auto-generate collections like "Best Coffee Shops" or "Romantic Spots"
            </p>
          </div>
          <Button variant="outline" size="sm" disabled>
            Coming Soon
          </Button>
        </div>
      </div>

      {/* Collections Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No collections yet</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Create your first collection to organize your saved places by theme, trip, or purpose.
          </p>
          <Button className="mt-6" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              previewImages={previews[collection.id] || []}
              onEdit={setEditCollection}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

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
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteConfirm?.name}"?</AlertDialogTitle>
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

export default function Collections() {
  return (
    <ThreePanelLayout>
      <CollectionsContent />
    </ThreePanelLayout>
  );
}
