import { Link } from "react-router-dom";
import { ArrowRight, Home, Utensils, Calendar, Car, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPlaces, categories } from "@/lib/mockData";
import { PlaceCard } from "@/components/places/PlaceCard";
import { useAuth } from "@/hooks/useAuth";
import { HeroSection } from "@/components/home/HeroSection";
import { GetInspiredSlider } from "@/components/home/GetInspiredSlider";

const categoryIcons = {
  apartments: Home,
  restaurants: Utensils,
  events: Calendar,
  cars: Car,
};

export default function Index() {
  const featuredPlaces = mockPlaces.slice(0, 4);
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💚</span>
            <span className="font-display text-xl font-semibold text-foreground italic">
              i love Medellín
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/concierge" className="text-muted-foreground hover:text-foreground transition-colors">
              Concierge
            </Link>
            <Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">
              Events
            </Link>
            <Link to="/apartments" className="text-muted-foreground hover:text-foreground transition-colors">
              Real Estate
            </Link>
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Itinerary
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm hidden sm:inline">
                  {user.email?.split("@")[0]}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="rounded-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[72px]" />

      {/* Hero Section */}
      <HeroSection />

      {/* Get Inspired Slider */}
      <GetInspiredSlider />

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">Explore</p>
            <h2 className="font-display text-3xl font-bold text-foreground mt-2">
              Discover your next adventure
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id];
              return (
                <Link
                  key={category.id}
                  to={`/explore?category=${category.id}`}
                  className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-card-foreground">{category.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.id === "apartments" && "Find your perfect stay"}
                    {category.id === "restaurants" && "Taste the city"}
                    {category.id === "events" && "Never miss a moment"}
                    {category.id === "cars" && "Drive your adventure"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Places */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-accent uppercase tracking-wider">Featured</p>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2">
                Popular in Medellín
              </h2>
            </div>
            <Link to="/explore">
              <Button variant="ghost">
                See all
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaces.map((place, index) => (
              <div
                key={place.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Concierge Teaser */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">Coming Soon</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mt-4">
              AI that works for you, not instead of you
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Our AI concierge will learn your preferences and help you discover places you'll love.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button variant="hero">
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💚</span>
              <span className="font-display text-xl font-semibold">I Love Medellín</span>
            </div>
            <p className="text-sm text-muted">
              © 2025 I Love Medellín. Made with 💚 in the City of Eternal Spring.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
