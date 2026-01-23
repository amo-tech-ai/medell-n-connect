import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Clock, ArrowLeft, ArrowRight, Sparkles, MapPin, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StayDuration = "visiting" | "short" | "medium" | "long" | null;

const stayOptions: { id: StayDuration; title: string; subtitle: string; description: string }[] = [
  { id: "visiting", title: "Visiting", subtitle: "Under 1 month", description: "Short-term vacation or business trip" },
  { id: "short", title: "Short Stay", subtitle: "1–3 months", description: "Extended travel or remote work stint" },
  { id: "medium", title: "Medium Stay", subtitle: "3–6 months", description: "Seasonal living or project-based" },
  { id: "long", title: "Long Stay", subtitle: "6+ months", description: "Relocation or long-term commitment" },
];

const impactData: Record<Exclude<StayDuration, null>, { neighborhoods: string[]; pricing: string; availability: string }> = {
  visiting: {
    neighborhoods: ["El Poblado", "Laureles", "El Centro"],
    pricing: "Daily rates, flexible dates",
    availability: "Hotels, short-term rentals"
  },
  short: {
    neighborhoods: ["El Poblado", "Envigado", "Laureles"],
    pricing: "Weekly discounts available",
    availability: "Furnished apartments"
  },
  medium: {
    neighborhoods: ["Laureles", "Envigado", "Belén"],
    pricing: "Monthly rates, 15-30% savings",
    availability: "Fully equipped apartments"
  },
  long: {
    neighborhoods: ["Envigado", "Sabaneta", "Belén"],
    pricing: "Best monthly rates, negotiate",
    availability: "Unfurnished options too"
  }
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<StayDuration>(null);

  const handleContinue = () => {
    // In production, save to user_preferences table
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: 3-Panel Layout */}
      <div className="hidden lg:grid lg:grid-cols-[320px_1fr_380px] min-h-screen">
        {/* LEFT PANEL: Context */}
        <aside className="border-r border-border bg-secondary/30 p-8 flex flex-col">
          <div className="mb-12">
            <h1 className="font-display text-2xl font-semibold text-foreground mb-1">I Love Medellín</h1>
            <p className="text-sm text-muted-foreground">Your personal concierge</p>
          </div>

          {/* Progress */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm font-medium text-foreground">of 6 steps</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "33%" }} />
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Stay Duration</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This helps us personalize your recommendations
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>~3 minutes remaining</span>
            </div>
          </div>

          <div className="mt-auto">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate("/")}>
              Skip for now
            </Button>
          </div>
        </aside>

        {/* CENTER PANEL: Work */}
        <main className="p-12 flex flex-col">
          <div className="max-w-2xl mx-auto w-full flex-1">
            <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
              How long will you stay?
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              Select the option that best describes your plans
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stayOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    "relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover-lift",
                    selected === option.id
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  {selected === option.id && (
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
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border max-w-2xl mx-auto w-full">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleContinue} disabled={!selected} className="gap-2 px-8">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </main>

        {/* RIGHT PANEL: Intelligence */}
        <aside className="border-l border-border bg-secondary/30 p-8">
          <div className="space-y-6">
            {/* AI Insight */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Insight</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                Most users like you choose <strong>Medium Stay (3–6 months)</strong>. This gives the best balance of flexibility and value.
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
                      <span key={n} className="px-2.5 py-1 text-xs bg-secondary rounded-full text-foreground">
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
                  <p className="text-sm text-muted-foreground">{impactData[selected].pricing}</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Availability</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{impactData[selected].availability}</p>
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
        </aside>
      </div>

      {/* Tablet & Mobile: Single Column */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <header className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-lg font-semibold">Step 2 of 6</h1>
            <span className="text-sm text-muted-foreground">Stay Duration</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "33%" }} />
          </div>
        </header>

        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            How long will you stay?
          </h1>
          <p className="text-muted-foreground mb-6">Select the option that best describes your plans</p>

          <div className="space-y-3">
            {stayOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                  selected === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{option.title}</h3>
                    <p className="text-sm text-primary">{option.subtitle}</p>
                  </div>
                  {selected === option.id && (
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </main>

        <footer className="p-4 border-t border-border bg-card safe-area-inset-bottom">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleContinue} disabled={!selected}>
              Continue
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
