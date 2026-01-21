import { useState, useEffect } from "react";
import { Heart, Sparkles, MapPin, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SavedItemCard } from "@/components/saved/SavedItemCard";
import { SavedFilters } from "@/components/saved/SavedFilters";
import { CollectionsList } from "@/components/saved/CollectionsList";
import { CreateCollectionDialog } from "@/components/saved/CreateCollectionDialog";
import { MoveToCollectionDialog } from "@/components/saved/MoveToCollectionDialog";
import { EditNotesDialog } from "@/components/saved/EditNotesDialog";
import { CollectionSuggestions } from "@/components/saved/CollectionSuggestions";
import { useEnrichedSavedPlaces, useSavedPlacesCount } from "@/hooks/useEnrichedSavedPlaces";
import { useCollections, useCollection, useCreateCollection, useAddToCollection } from "@/hooks/useCollections";
import { useCollectionSuggestions, type CollectionSuggestion } from "@/hooks/useCollectionSuggestions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { LocationType, EnrichedSavedPlace } from "@/types/saved";

// Right panel content for Saved page
function SavedRightPanelContent({
  totalCount,
  collections,
}: {
  totalCount: number;
  collections: number;
}) {
  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <section className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h3 className="font-semibold text-sm text-foreground mb-3">Your Saves</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Places saved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{collections}</p>
            <p className="text-xs text-muted-foreground">Collections</p>
          </div>
        </div>
      </section>

      {/* AI Suggestions placeholder */}
      <section className="p-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Coming Soon</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered suggestions based on your saves, trip planning assistance, and more.
        </p>
      </section>

      {/* Quick Links */}
      <section className="p-4 rounded-xl border border-border">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Explore More</h3>
        </div>
        <div className="space-y-2">
          <Link to="/apartments" className="block text-sm text-primary hover:underline">
            Browse Apartments →
          </Link>
          <Link to="/restaurants" className="block text-sm text-primary hover:underline">
            Discover Restaurants →
          </Link>
          <Link to="/events" className="block text-sm text-primary hover:underline">
            Find Events →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function Saved() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<LocationType>("all");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  // Dialog states
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false);
  const [moveToCollectionItem, setMoveToCollectionItem] = useState<EnrichedSavedPlace | null>(null);
  const [editNotesItem, setEditNotesItem] = useState<EnrichedSavedPlace | null>(null);

  // Data
  const { data: savedPlaces = [], isLoading } = useEnrichedSavedPlaces(
    activeFilter,
    selectedCollectionId
  );
  const { data: allSavedPlaces = [] } = useEnrichedSavedPlaces("all", null);
  const { data: countData } = useSavedPlacesCount();
  const { data: collections = [] } = useCollections();
  const { data: selectedCollection } = useCollection(selectedCollectionId || undefined);

  // AI Suggestions
  const { suggestions, getSuggestions, isLoading: isLoadingSuggestions, clearSuggestions } = useCollectionSuggestions();
  const createCollection = useCreateCollection();
  const addToCollection = useAddToCollection();

  const pageTitle = selectedCollection?.name || "Saved Places";
  const pageSubtitle = selectedCollection?.description || `${savedPlaces.length} places saved`;

  // Filter out dismissed suggestions
  const activeSuggestions = suggestions.filter(s => !dismissedSuggestions.includes(s.name));

  const handleGetSuggestions = () => {
    const placesForAnalysis = allSavedPlaces.map(p => ({
      id: p.id,
      location_id: p.location_id,
      location_type: p.location_type,
      title: p.resource?.title || '',
      cuisine_types: undefined, // Would need to extend EnrichedSavedPlace if needed
      neighborhood: p.resource?.location,
      price_level: undefined,
      rating: p.resource?.rating,
    }));
    getSuggestions(placesForAnalysis);
  };

  const handleCreateFromSuggestion = async (suggestion: CollectionSuggestion) => {
    try {
      const newCollection = await createCollection.mutateAsync({
        name: suggestion.name,
        description: suggestion.description,
        emoji: suggestion.emoji,
        color: suggestion.color,
      });

      // Add places to the new collection
      for (const placeId of suggestion.placeIds) {
        await addToCollection.mutateAsync({
          savedPlaceId: placeId,
          collectionId: newCollection.id,
        });
      }

      toast.success(`Created "${suggestion.name}" with ${suggestion.placeIds.length} places`);
      setDismissedSuggestions(prev => [...prev, suggestion.name]);
    } catch (error) {
      toast.error("Failed to create collection");
    }
  };

  const handleDismissSuggestion = (suggestion: CollectionSuggestion) => {
    setDismissedSuggestions(prev => [...prev, suggestion.name]);
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sign in to view saved places</h2>
            <p className="text-muted-foreground mt-2">
              Create an account to save your favorite places and organize them into collections.
            </p>
            <Link to="/login" className="mt-6 inline-block">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-20 px-4 lg:px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                {selectedCollection?.emoji && (
                  <span className="text-2xl">{selectedCollection.emoji}</span>
                )}
                {pageTitle}
              </h1>
              <p className="text-muted-foreground mt-1">{pageSubtitle}</p>
            </div>
          </div>

          {/* Type Filters */}
          <SavedFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={countData?.byType}
          />
        </div>

        {/* Content Area */}
        <div className="flex">
          {/* Collections Sidebar (desktop only) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Collections</h2>
            <CollectionsList
              selectedCollectionId={selectedCollectionId}
              onSelectCollection={setSelectedCollectionId}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 px-4 lg:px-6 py-6 space-y-6">
            {/* AI Collection Suggestions */}
            {!selectedCollectionId && allSavedPlaces.length >= 3 && (
              <div className="space-y-4">
                {activeSuggestions.length > 0 ? (
                  <CollectionSuggestions
                    suggestions={activeSuggestions}
                    onCreateCollection={handleCreateFromSuggestion}
                    onDismiss={handleDismissSuggestion}
                    isCreating={createCollection.isPending}
                  />
                ) : (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGetSuggestions}
                      disabled={isLoadingSuggestions}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isLoadingSuggestions ? "Analyzing..." : "Suggest Collections"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : savedPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedPlaces.map((item) => (
                  <SavedItemCard
                    key={item.id}
                    item={item}
                    onMoveToCollection={setMoveToCollectionItem}
                    onEditNotes={setEditNotesItem}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedCollectionId ? "No items in this collection" : "No saved places yet"}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  {selectedCollectionId
                    ? "Add items to this collection from your saved places."
                    : "Start exploring and save your favorite places to access them later."}
                </p>
                <Link to="/explore" className="mt-6 inline-block">
                  <Button>Start Exploring</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateCollectionDialog
        open={createCollectionOpen}
        onOpenChange={setCreateCollectionOpen}
      />

      <MoveToCollectionDialog
        open={!!moveToCollectionItem}
        onOpenChange={(open) => !open && setMoveToCollectionItem(null)}
        item={moveToCollectionItem}
        onCreateNew={() => setCreateCollectionOpen(true)}
      />

      <EditNotesDialog
        open={!!editNotesItem}
        onOpenChange={(open) => !open && setEditNotesItem(null)}
        item={editNotesItem}
      />
    </AppLayout>
  );
}
