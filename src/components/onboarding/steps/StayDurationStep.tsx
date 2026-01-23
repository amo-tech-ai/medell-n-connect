import { Check, Sparkles, MapPin, DollarSign, Building } from "lucide-react";
import { useOnboarding, StayDuration } from "@/context/OnboardingContext";
import { OnboardingLayout } from "../OnboardingLayout";
import { cn } from "@/lib/utils";

const stayOptions: {
  id: StayDuration;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    id: "visiting",
    title: "Visiting",
    subtitle: "Under 1 month",
    description: "Short-term vacation or business trip",
  },
  {
    id: "short",
    title: "Short Stay",
    subtitle: "1–3 months",
    description: "Extended travel or remote work stint",
  },
  {
    id: "medium",
    title: "Medium Stay",
    subtitle: "3–6 months",
    description: "Seasonal living or project-based",
  },
  {
    id: "long",
    title: "Long Stay",
    subtitle: "6+ months",
    description: "Relocation or long-term commitment",
  },
];

const impactData: Record<
  NonNullable<StayDuration>,
  { neighborhoods: string[]; pricing: string; availability: string }
> = {
  visiting: {
    neighborhoods: ["El Poblado", "Laureles", "El Centro"],
    pricing: "Daily rates, flexible dates",
    availability: "Hotels, short-term rentals",
  },
  short: {
    neighborhoods: ["El Poblado", "Envigado", "Laureles"],
    pricing: "Weekly discounts available",
    availability: "Furnished apartments",
  },
  medium: {
    neighborhoods: ["Laureles", "Envigado", "Belén"],
    pricing: "Monthly rates, 15-30% savings",
    availability: "Fully equipped apartments",
  },
  long: {
    neighborhoods: ["Envigado", "Sabaneta", "Belén"],
    pricing: "Best monthly rates, negotiate",
    availability: "Unfurnished options too",
  },
};

export function StayDurationStep() {
  const { data, setStayDuration } = useOnboarding();

  return (
    <OnboardingLayout
      stepTitle="How long will you stay?"
      stepDescription="Select the option that best describes your plans"
      rightPanel={<StayDurationRightPanel selected={data.stayDuration} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stayOptions.map((option) => {
          const isSelected = data.stayDuration === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setStayDuration(option.id)}
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

function StayDurationRightPanel({ selected }: { selected: StayDuration }) {
  return (
    <div className="space-y-6">
      {/* AI Insight */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Insight</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {selected ? (
            <>
              Great choice! <strong>{stayOptions.find(o => o.id === selected)?.title}</strong> stays
              give you {selected === "visiting" ? "maximum flexibility" : 
                        selected === "short" ? "a good balance of exploration and settling in" :
                        selected === "medium" ? "the best value with monthly discounts" :
                        "access to the best deals and local integration"}.
            </>
          ) : (
            <>
              Most users like you choose <strong>Medium Stay (3–6 months)</strong>. This gives
              the best balance of flexibility and value.
            </>
          )}
        </p>
      </div>

      {/* Impact Preview */}
      {selected && impactData[selected] && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            How this affects your results
          </h3>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Neighborhoods</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {impactData[selected].neighborhoods.map((n) => (
                <span
                  key={n}
                  className="px-2.5 py-1 text-xs bg-secondary rounded-full text-foreground"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Pricing</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {impactData[selected].pricing}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Availability</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {impactData[selected].availability}
            </p>
          </div>
        </div>
      )}

      {!selected && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Select an option to see how it personalizes your experience
          </p>
        </div>
      )}
    </div>
  );
}
