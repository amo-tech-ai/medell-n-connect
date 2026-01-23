import { Check, Laptop, Globe, Home, Plane } from "lucide-react";
import { useOnboarding, UserType } from "@/context/OnboardingContext";
import { OnboardingLayout } from "../OnboardingLayout";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const userTypeOptions: {
  id: UserType;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Laptop;
}[] = [
  {
    id: "nomad",
    title: "Digital Nomad",
    subtitle: "Remote worker",
    description: "Working remotely, staying 1-6 months",
    icon: Laptop,
  },
  {
    id: "expat",
    title: "Expat",
    subtitle: "Relocating",
    description: "Moving to Medellín long-term, 6+ months",
    icon: Globe,
  },
  {
    id: "local",
    title: "Local",
    subtitle: "Resident",
    description: "Living here permanently or from here",
    icon: Home,
  },
  {
    id: "traveler",
    title: "Traveler",
    subtitle: "Visiting",
    description: "Vacation or short business trip, 1-4 weeks",
    icon: Plane,
  },
];

export function UserTypeStep() {
  const { data, setUserType } = useOnboarding();

  return (
    <OnboardingLayout
      stepTitle="How would you describe yourself?"
      stepDescription="This helps us personalize your experience"
      rightPanel={<UserTypeRightPanel selected={data.userType} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = data.userType === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setUserType(option.id)}
              className={cn(
                "relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02]",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                {option.title}
              </h3>
              <p className="text-sm font-medium text-primary mb-2">{option.subtitle}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </button>
          );
        })}
      </div>
    </OnboardingLayout>
  );
}

function UserTypeRightPanel({ selected }: { selected: UserType }) {
  const insights: Record<NonNullable<UserType>, { title: string; points: string[] }> = {
    nomad: {
      title: "Perfect for remote workers!",
      points: [
        "We'll highlight coworking-friendly cafes",
        "Show apartments with fast WiFi (100+ Mbps)",
        "Recommend neighborhoods with reliable power",
        "Connect you with the tech community",
      ],
    },
    expat: {
      title: "Welcome to your new home!",
      points: [
        "Long-term rental discounts unlocked",
        "Local integration tips and resources",
        "Healthcare and visa information",
        "Authentic neighborhood recommendations",
      ],
    },
    local: {
      title: "¡Hola, paisa!",
      points: [
        "Discover hidden gems in your city",
        "Find new restaurants and events",
        "Skip the tourist traps",
        "Support local businesses",
      ],
    },
    traveler: {
      title: "Make the most of your visit!",
      points: [
        "Must-see attractions and tours",
        "Safety tips for travelers",
        "Best areas to stay short-term",
        "Day trip recommendations",
      ],
    },
  };

  return (
    <div className="space-y-6">
      {/* AI Insight */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Insight</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          Most visitors to Medellín are <strong>Digital Nomads</strong> (45%) looking
          for the perfect work-life balance in the City of Eternal Spring.
        </p>
      </div>

      {/* Dynamic insight based on selection */}
      {selected && insights[selected] && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            {insights[selected].title}
          </h3>
          <ul className="space-y-3">
            {insights[selected].points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!selected && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Select an option to see how we'll personalize your experience
          </p>
        </div>
      )}
    </div>
  );
}
