import { 
  Utensils, Wine, Palette, Mountain, Briefcase, 
  Heart, Music, Coffee, Camera, ShoppingBag,
  Dumbbell, BookOpen, Sparkles, Check
} from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";
import { OnboardingLayout } from "../OnboardingLayout";
import { cn } from "@/lib/utils";

const interests = [
  { id: "food", label: "Food & Dining", icon: Utensils, emoji: "🍽️" },
  { id: "nightlife", label: "Nightlife & Bars", icon: Wine, emoji: "🍸" },
  { id: "culture", label: "Culture & Arts", icon: Palette, emoji: "🎨" },
  { id: "outdoor", label: "Outdoor Activities", icon: Mountain, emoji: "🏃" },
  { id: "networking", label: "Networking & Tech", icon: Briefcase, emoji: "💼" },
  { id: "wellness", label: "Wellness & Fitness", icon: Dumbbell, emoji: "🧘" },
  { id: "music", label: "Music & Concerts", icon: Music, emoji: "🎵" },
  { id: "coffee", label: "Coffee & Cafes", icon: Coffee, emoji: "☕" },
  { id: "photography", label: "Photography", icon: Camera, emoji: "📸" },
  { id: "shopping", label: "Shopping & Markets", icon: ShoppingBag, emoji: "🛍️" },
  { id: "dating", label: "Dating & Social", icon: Heart, emoji: "❤️" },
  { id: "learning", label: "Learning & Spanish", icon: BookOpen, emoji: "📚" },
];

export function InterestsStep() {
  const { data, toggleInterest } = useOnboarding();

  return (
    <OnboardingLayout
      stepTitle="What are you interested in?"
      stepDescription="Select at least 3 interests to personalize your recommendations"
      rightPanel={<InterestsRightPanel selected={data.interests} />}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {interests.map((interest) => {
          const isSelected = data.interests.includes(interest.id);
          const Icon = interest.icon;
          
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={cn(
                "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{interest.emoji}</span>
                <span className="text-sm font-medium text-foreground">
                  {interest.label}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        {data.interests.length < 3
          ? `Select ${3 - data.interests.length} more to continue`
          : `${data.interests.length} interests selected ✓`}
      </p>
    </OnboardingLayout>
  );
}

function InterestsRightPanel({ selected }: { selected: string[] }) {
  const selectedInterests = interests.filter((i) => selected.includes(i.id));

  // Generate personalized suggestions based on interests
  const getSuggestions = () => {
    const suggestions: string[] = [];
    
    if (selected.includes("coffee")) {
      suggestions.push("We'll show you the best specialty coffee shops");
    }
    if (selected.includes("food")) {
      suggestions.push("Get curated restaurant recommendations daily");
    }
    if (selected.includes("outdoor")) {
      suggestions.push("Discover hiking trails and outdoor adventures");
    }
    if (selected.includes("networking")) {
      suggestions.push("Find coworking spaces and tech meetups");
    }
    if (selected.includes("nightlife")) {
      suggestions.push("Get the scoop on the best bars and clubs");
    }
    if (selected.includes("culture")) {
      suggestions.push("Stay updated on art exhibitions and cultural events");
    }
    if (selected.includes("wellness")) {
      suggestions.push("Find yoga studios, gyms, and wellness centers");
    }
    
    return suggestions.slice(0, 4);
  };

  const suggestions = getSuggestions();

  return (
    <div className="space-y-6">
      {/* AI Insight */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Insight</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {selected.length === 0 ? (
            <>
              <strong>Food, Coffee, and Nightlife</strong> are the top picks among visitors.
              Medellín's culinary scene is world-class!
            </>
          ) : selected.length < 3 ? (
            <>
              Great start! Add {3 - selected.length} more interest{3 - selected.length !== 1 ? "s" : ""} to
              help us create your perfect experience.
            </>
          ) : (
            <>
              Perfect! With {selected.length} interests, we can create highly personalized
              recommendations tailored just for you.
            </>
          )}
        </p>
      </div>

      {/* Selected interests */}
      {selectedInterests.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Your interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <span
                key={interest.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>{interest.emoji}</span>
                {interest.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Personalized suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            What you'll get
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Select interests to see personalized features
          </p>
        </div>
      )}
    </div>
  );
}
