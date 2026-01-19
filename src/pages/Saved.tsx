import { Heart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceCard } from "@/components/places/PlaceCard";
import { mockPlaces } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Saved() {
  // In a real app, this would come from user state/database
  const savedPlaces = mockPlaces.slice(0, 3).map((p) => ({ ...p, saved: true }));

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="px-4 lg:px-6 py-6 border-b border-border">
          <h1 className="font-display text-2xl font-bold text-foreground">Saved Places</h1>
          <p className="text-muted-foreground mt-1">
            {savedPlaces.length} places saved
          </p>
        </div>

        {/* Content */}
        <div className="px-4 lg:px-6 py-6">
          {savedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">No saved places yet</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Start exploring and save your favorite places to access them later.
              </p>
              <Link to="/explore" className="mt-6 inline-block">
                <Button>Start Exploring</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
