import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MapPin, Star, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPlaceById } from "@/lib/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PlaceDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [isSaved, setIsSaved] = useState(false);

  const place = getPlaceById(id || "");

  if (!place) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Place not found</h1>
          <Link to="/explore" className="mt-4 text-primary hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    apartments: "STAY",
    restaurants: "RESTAURANT",
    events: "EVENT",
    cars: "CAR RENTAL",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/explore"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Explore</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant={isSaved ? "default" : "outline"}
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Image */}
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              {categoryLabels[place.type]}
            </Badge>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {place.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{place.rating}</span>
                <span>(48 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{place.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{place.distance} away</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-foreground font-semibold text-2xl">{place.price}</p>
            </div>

            {/* Description */}
            <div className="mt-8 prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {place.description}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Located in the heart of {place.neighborhood}, this {place.type.slice(0, -1)} offers
                an exceptional experience for visitors looking to explore the best of Medellín.
                Whether you're a digital nomad, expat, or traveler, you'll find everything you need here.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-3">Highlights</h3>
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg"
                  >
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-3">Location</h3>
              <div className="bg-muted rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>{place.neighborhood}, Medellín</p>
                  <p className="text-sm mt-1">Map integration coming soon</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pb-8 flex flex-wrap gap-4">
              <Button size="lg" className="flex-1 sm:flex-none">
                {place.type === "apartments" && "Book Now"}
                {place.type === "restaurants" && "Make Reservation"}
                {place.type === "events" && "Get Tickets"}
                {place.type === "cars" && "Reserve Car"}
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="lg"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
