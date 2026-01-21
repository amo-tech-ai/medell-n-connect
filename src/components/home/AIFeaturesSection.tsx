import { 
  MapPin, 
  Star, 
  Sparkles, 
  Calendar, 
  Heart, 
  Compass,
  MessageSquare,
  Clock,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Plus,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Card 1: Photos, Maps & AI Reviews
const PhotosMapReviewsCard = () => (
  <div className="bg-card rounded-3xl p-8 md:col-span-2 shadow-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h3 className="font-display text-2xl md:text-3xl text-foreground">
          Photos, maps +<br />reviews
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Explore restaurants, rentals, events, and trips using real photos, interactive maps, and <span className="text-primary font-medium">AI-summarized reviews</span> that highlight what matters most.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Summaries
          </Badge>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-0">
            Popular highlights
          </Badge>
        </div>
      </div>
      
      {/* Visual mockup */}
      <div className="relative">
        <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
          {/* Map preview */}
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl h-32 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-6 w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="absolute top-8 right-12 w-2 h-2 bg-rose-500 rounded-full" />
              <div className="absolute bottom-6 left-1/3 w-2 h-2 bg-amber-500 rounded-full" />
            </div>
            <div className="absolute top-3 right-3">
              <div className="bg-white rounded-lg shadow-md p-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg" />
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
            </div>
          </div>
          
          {/* Reviews section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Reviews</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-foreground">4.9</span>
                  <span className="text-xs text-muted-foreground">Excellent</span>
                </div>
                <p className="text-xs text-muted-foreground">★ 2,372 reviews</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <ThumbsUp className="w-4 h-4 mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground mt-1">Pros</p>
                </div>
                <div className="text-center">
                  <ThumbsDown className="w-4 h-4 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-1">Cons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Card 2: Tailored Recommendations
const TailoredRecommendationsCard = () => (
  <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-foreground">
        Tailored<br />recommendations
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        AI recommends restaurants, stays, events, and trips based on your location, interests, time of day, and past activity.
      </p>
    </div>
    
    {/* Visual mockup */}
    <div className="mt-6 relative">
      <div className="flex gap-3 mb-4">
        <Badge className="bg-amber-100 text-amber-700 border-0 hover:bg-amber-100">🏖️ Tropical Beach</Badge>
        <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100">🦐 Seafood</Badge>
      </div>
      
      <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-100 flex items-center justify-center">
          <Users className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Joan Jones</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Near you
          </p>
        </div>
      </div>
      
      <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium shadow-lg">
        ⚡ The Solo Wanderer
      </div>
    </div>
  </div>
);

// Card 3: Customizable Trip Plans
const TripPlansCard = () => (
  <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-foreground">
        Customizable<br />trip plans
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Create smart plans in seconds. AI builds itineraries that combine rentals, dining, events, and travel — fully customizable.
      </p>
    </div>
    
    {/* Visual mockup */}
    <div className="mt-6 bg-muted/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm text-foreground">Trip to Medellín</p>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary" />
          <div className="w-6 h-6 rounded-full bg-rose-400" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Itinerary</p>
      <div className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3">Day 1</div>
      
      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">🏨 Costa Verde</p>
          <p className="text-xs text-muted-foreground">⏰ 3pm check-in • 2 nights</p>
        </div>
      </div>
      
      <Button variant="outline" size="sm" className="w-full text-primary border-primary/30 hover:bg-primary/5">
        <Plus className="w-3 h-3 mr-1" />
        Add to trip
      </Button>
    </div>
  </div>
);

// Card 4: AI Taste Matching
const TasteMatchingCard = () => (
  <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-foreground">
        AI Taste<br />Matching
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        AI matches restaurants, events, and stays to your personal taste — not just popularity.
      </p>
    </div>
    
    {/* Visual mockup */}
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 text-xs">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        <span className="text-muted-foreground">Because you liked...</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl p-3 text-center">
          <p className="text-2xl mb-1">🍝</p>
          <p className="text-xs font-medium text-foreground">Italian</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 text-center">
          <p className="text-2xl mb-1">🌿</p>
          <p className="text-xs font-medium text-foreground">Organic</p>
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">98% match</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">La Provincia - Farm to table</p>
      </div>
    </div>
  </div>
);

// Card 5: AI-Curated Itineraries
const CuratedItinerariesCard = () => (
  <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-foreground">
        Popular<br />itineraries
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Browse AI-curated itineraries that blend food, stays, events, and experiences — updated in real time.
      </p>
    </div>
    
    {/* Visual mockup */}
    <div className="mt-6 relative">
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-primary/30 to-primary/10 relative">
          <div className="absolute top-2 left-2 flex gap-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-xs font-medium text-foreground bg-white/80 backdrop-blur-sm rounded px-2 py-1 inline-block">
              Explore Guatapé
            </p>
          </div>
        </div>
        <div className="p-3 flex gap-2">
          <Button size="sm" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">
            <Plus className="w-3 h-3 mr-1" />
            Customize a trip
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Heart className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white border-0">
        <Clock className="w-3 h-3 mr-1" />
        Trending
      </Badge>
    </div>
  </div>
);

export function AIFeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest text-primary uppercase mb-4">
            AI-Powered Discovery
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
            Everything you need<br />for your next adventure
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Discover, plan, and personalize your trip with AI assistance
          </p>
        </div>
        
        {/* Card Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full-width card */}
          <PhotosMapReviewsCard />
          
          {/* 2x2 grid of smaller cards */}
          <TailoredRecommendationsCard />
          <TripPlansCard />
          <TasteMatchingCard />
          <CuratedItinerariesCard />
        </div>
      </div>
    </section>
  );
}

export default AIFeaturesSection;
