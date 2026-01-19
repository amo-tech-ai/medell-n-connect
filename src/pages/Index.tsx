import { Link } from "react-router-dom";
import { ArrowRight, Home, Utensils, Calendar, Car, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPlaces, categories } from "@/lib/mockData";
import { PlaceCard } from "@/components/places/PlaceCard";
import heroImage from "@/assets/hero-medellin.jpg";

const categoryIcons = {
  apartments: Home,
  restaurants: Utensils,
  events: Calendar,
  cars: Car,
};

export default function Index() {
  const featuredPlaces = mockPlaces.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💚</span>
            <span className="font-display text-xl font-semibold text-primary-foreground">
              I Love Medellín
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Explore
            </Link>
            <Link to="/saved" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Saved
            </Link>
            <Button variant="hero" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Medellín skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pt-16">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight animate-fade-in">
              Your Next Adventure Starts Here in Colombia
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Discover the best stays, restaurants, events, and car rentals in Medellín — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/explore">
                <Button variant="hero" size="lg">
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="lg">
                How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div>
                <p className="text-3xl font-bold text-primary-foreground">120+</p>
                <p className="text-sm text-primary-foreground/70">Curated Places</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-foreground">15+</p>
                <p className="text-sm text-primary-foreground/70">Neighborhoods</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-foreground">4.9</p>
                <p className="text-sm text-primary-foreground/70">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
