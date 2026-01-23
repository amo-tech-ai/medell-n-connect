import { Check, Sparkles, MapPin } from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";
import { OnboardingLayout } from "../OnboardingLayout";
import { cn } from "@/lib/utils";

const neighborhoods = [
  {
    id: "poblado",
    name: "El Poblado",
    description: "Upscale, expat-friendly, restaurants & nightlife",
    vibe: "Modern & International",
    priceLevel: "$$$",
  },
  {
    id: "laureles",
    name: "Laureles",
    description: "Local vibe, great cafes, walkable streets",
    vibe: "Trendy & Authentic",
    priceLevel: "$$",
  },
  {
    id: "envigado",
    name: "Envigado",
    description: "Quiet, residential, family-friendly",
    vibe: "Peaceful & Safe",
    priceLevel: "$$",
  },
  {
    id: "centro",
    name: "El Centro",
    description: "Historic, bustling, cultural attractions",
    vibe: "Historic & Lively",
    priceLevel: "$",
  },
  {
    id: "belen",
    name: "Belén",
    description: "Affordable, authentic, growing scene",
    vibe: "Local & Emerging",
    priceLevel: "$",
  },
  {
    id: "candelaria",
    name: "La Candelaria",
    description: "Nightlife hub, bars & clubs",
    vibe: "Party & Social",
    priceLevel: "$$",
  },
  {
    id: "sabaneta",
    name: "Sabaneta",
    description: "Small town feel, excellent restaurants",
    vibe: "Charming & Foodie",
    priceLevel: "$$",
  },
  {
    id: "vegas",
    name: "Las Vegas",
    description: "Business district, modern apartments",
    vibe: "Urban & Convenient",
    priceLevel: "$$",
  },
];

export function NeighborhoodsStep() {
  const { data, toggleNeighborhood } = useOnboarding();

  return (
    <OnboardingLayout
      stepTitle="Where would you like to explore?"
      stepDescription="Select at least one neighborhood (you can choose multiple)"
      rightPanel={<NeighborhoodsRightPanel selected={data.neighborhoods} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {neighborhoods.map((hood) => {
          const isSelected = data.neighborhoods.includes(hood.id);
          
          return (
            <button
              key={hood.id}
              onClick={() => toggleNeighborhood(hood.id)}
              className={cn(
                "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{hood.name}</h3>
                    <span className="text-xs text-muted-foreground">{hood.priceLevel}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{hood.description}</p>
                  <span className="inline-block px-2 py-0.5 text-xs bg-secondary rounded-full text-foreground">
                    {hood.vibe}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        {data.neighborhoods.length === 0
          ? "Select at least 1 neighborhood to continue"
          : `${data.neighborhoods.length} neighborhood${data.neighborhoods.length !== 1 ? "s" : ""} selected`}
      </p>
    </OnboardingLayout>
  );
}

function NeighborhoodsRightPanel({ selected }: { selected: string[] }) {
  const selectedHoods = neighborhoods.filter((n) => selected.includes(n.id));

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
              <strong>El Poblado</strong> and <strong>Laureles</strong> are the most popular
              choices for first-time visitors. Both have excellent safety and walkability.
            </>
          ) : selected.length === 1 ? (
            <>
              Great start! Consider adding 1-2 more neighborhoods to discover different vibes
              and find your perfect match.
            </>
          ) : (
            <>
              Nice mix! You'll get diverse recommendations across {selected.length} areas
              with different atmospheres and price points.
            </>
          )}
        </p>
      </div>

      {/* Selected neighborhoods */}
      {selectedHoods.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Your selections
          </h3>
          {selectedHoods.map((hood) => (
            <div
              key={hood.id}
              className="p-3 rounded-xl bg-card border border-border flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{hood.name}</p>
                <p className="text-xs text-muted-foreground">{hood.vibe}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Select neighborhoods to see your personalized area guide
          </p>
        </div>
      )}
    </div>
  );
}
