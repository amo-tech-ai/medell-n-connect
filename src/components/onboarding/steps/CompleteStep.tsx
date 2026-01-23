import { Check, Sparkles, MapPin, Wallet, Heart, User } from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";
import { OnboardingLayout } from "../OnboardingLayout";
import confetti from "@/lib/confetti";
import { useEffect } from "react";

const neighborhoods: Record<string, string> = {
  poblado: "El Poblado",
  laureles: "Laureles",
  envigado: "Envigado",
  centro: "El Centro",
  belen: "Belén",
  candelaria: "La Candelaria",
  sabaneta: "Sabaneta",
  vegas: "Las Vegas",
};

const budgetLabels: Record<string, string> = {
  budget: "Budget ($500-1,000/mo)",
  moderate: "Moderate ($1,000-2,000/mo)",
  comfortable: "Comfortable ($2,000-3,500/mo)",
  luxury: "Luxury ($3,500+/mo)",
};

const userTypeLabels: Record<string, string> = {
  nomad: "Digital Nomad",
  expat: "Expat",
  local: "Local",
  traveler: "Traveler",
};

const interestEmojis: Record<string, string> = {
  food: "🍽️",
  nightlife: "🍸",
  culture: "🎨",
  outdoor: "🏃",
  networking: "💼",
  wellness: "🧘",
  music: "🎵",
  coffee: "☕",
  photography: "📸",
  shopping: "🛍️",
  dating: "❤️",
  learning: "📚",
};

export function CompleteStep() {
  const { data } = useOnboarding();

  // Trigger confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <OnboardingLayout
      stepTitle="You're all set! 🎉"
      stepDescription="Here's a summary of your preferences"
      rightPanel={<CompleteRightPanel />}
    >
      <div className="space-y-6">
        {/* Success message */}
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Welcome to Medellín!
          </h2>
          <p className="text-muted-foreground">
            Your personalized experience is ready. Let's explore!
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Type */}
          {data.userType && (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Profile</span>
              </div>
              <p className="font-medium text-foreground">{userTypeLabels[data.userType]}</p>
            </div>
          )}

          {/* Budget */}
          {data.budgetLevel && (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Budget</span>
              </div>
              <p className="font-medium text-foreground">{budgetLabels[data.budgetLevel]}</p>
            </div>
          )}

          {/* Neighborhoods */}
          {data.neighborhoods.length > 0 && (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Neighborhoods</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.neighborhoods.slice(0, 3).map((id) => (
                  <span key={id} className="px-2 py-0.5 text-xs bg-secondary rounded-full text-foreground">
                    {neighborhoods[id] || id}
                  </span>
                ))}
                {data.neighborhoods.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-secondary rounded-full text-foreground">
                    +{data.neighborhoods.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Interests */}
          {data.interests.length > 0 && (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Interests</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.interests.slice(0, 5).map((id) => (
                  <span key={id} className="text-lg">
                    {interestEmojis[id] || "🎯"}
                  </span>
                ))}
                {data.interests.length > 5 && (
                  <span className="text-sm text-muted-foreground">
                    +{data.interests.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}

function CompleteRightPanel() {
  return (
    <div className="space-y-6">
      {/* AI Welcome */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Your AI Concierge</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          I've learned your preferences and I'm ready to help! Ask me anything about
          Medellín – from the best coffee shops to hidden gems only locals know.
        </p>
      </div>

      {/* What's next */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
          What's next
        </h3>
        
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-medium text-primary">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Explore the city</p>
              <p className="text-xs text-muted-foreground">
                Browse apartments, restaurants, and events
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-medium text-primary">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Plan your trip</p>
              <p className="text-xs text-muted-foreground">
                Create an itinerary with our smart planner
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-medium text-primary">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Ask your concierge</p>
              <p className="text-xs text-muted-foreground">
                Get personalized recommendations anytime
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Fun fact */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Did you know?</span> Medellín
          has an average temperature of 72°F (22°C) year-round – that's why it's called
          the City of Eternal Spring! 🌸
        </p>
      </div>
    </div>
  );
}
