import { Check, Sparkles, Wallet, TrendingUp, Home, Utensils } from "lucide-react";
import { useOnboarding, BudgetLevel } from "@/context/OnboardingContext";
import { OnboardingLayout } from "../OnboardingLayout";
import { cn } from "@/lib/utils";

const budgetOptions: {
  id: BudgetLevel;
  title: string;
  range: string;
  monthly: string;
  description: string;
}[] = [
  {
    id: "budget",
    title: "Budget",
    range: "$500 - $1,000/mo",
    monthly: "$750",
    description: "Basic accommodations, local food, public transport",
  },
  {
    id: "moderate",
    title: "Moderate",
    range: "$1,000 - $2,000/mo",
    monthly: "$1,500",
    description: "Comfortable apartments, mix of dining, occasional taxis",
  },
  {
    id: "comfortable",
    title: "Comfortable",
    range: "$2,000 - $3,500/mo",
    monthly: "$2,750",
    description: "Nice apartments, quality dining, regular activities",
  },
  {
    id: "luxury",
    title: "Luxury",
    range: "$3,500+/mo",
    monthly: "$5,000+",
    description: "Premium apartments, fine dining, exclusive experiences",
  },
];

const budgetBreakdown: Record<
  NonNullable<BudgetLevel>,
  { rent: string; food: string; transport: string; activities: string }
> = {
  budget: {
    rent: "$300-500",
    food: "$150-250",
    transport: "$30-50",
    activities: "$50-100",
  },
  moderate: {
    rent: "$600-1000",
    food: "$250-400",
    transport: "$50-100",
    activities: "$100-200",
  },
  comfortable: {
    rent: "$1000-1800",
    food: "$400-600",
    transport: "$100-200",
    activities: "$200-400",
  },
  luxury: {
    rent: "$2000+",
    food: "$600+",
    transport: "$200+",
    activities: "$500+",
  },
};

export function BudgetStep() {
  const { data, setBudgetLevel } = useOnboarding();

  return (
    <OnboardingLayout
      stepTitle="What's your monthly budget?"
      stepDescription="This helps us show you options within your range"
      rightPanel={<BudgetRightPanel selected={data.budgetLevel} />}
    >
      <div className="space-y-3">
        {budgetOptions.map((option) => {
          const isSelected = data.budgetLevel === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setBudgetLevel(option.id)}
              className={cn(
                "w-full relative p-5 rounded-xl border-2 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg text-foreground">{option.title}</h3>
                    <span className="text-sm font-medium text-primary">{option.range}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 ml-4">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Prices are estimates in USD. Actual costs may vary.
      </p>
    </OnboardingLayout>
  );
}

function BudgetRightPanel({ selected }: { selected: BudgetLevel }) {
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
              With a <strong>{budgetOptions.find(o => o.id === selected)?.title}</strong> budget,
              you can {selected === "budget" ? "live comfortably while being mindful of expenses" :
                       selected === "moderate" ? "enjoy a balanced lifestyle with some treats" :
                       selected === "comfortable" ? "experience Medellín's best without worry" :
                       "access exclusive experiences and premium services"}.
            </>
          ) : (
            <>
              Most digital nomads in Medellín spend <strong>$1,500-2,500/month</strong> for a
              comfortable lifestyle including a nice apartment in Poblado or Laureles.
            </>
          )}
        </p>
      </div>

      {/* Budget breakdown */}
      {selected && budgetBreakdown[selected] && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Typical monthly breakdown
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Rent</p>
                <p className="text-xs text-muted-foreground">Furnished apartment</p>
              </div>
              <span className="text-sm font-medium text-foreground">
                {budgetBreakdown[selected].rent}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Food</p>
                <p className="text-xs text-muted-foreground">Groceries & dining</p>
              </div>
              <span className="text-sm font-medium text-foreground">
                {budgetBreakdown[selected].food}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Activities</p>
                <p className="text-xs text-muted-foreground">Entertainment & tours</p>
              </div>
              <span className="text-sm font-medium text-foreground">
                {budgetBreakdown[selected].activities}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Transport</p>
                <p className="text-xs text-muted-foreground">Metro, taxis, Uber</p>
              </div>
              <span className="text-sm font-medium text-foreground">
                {budgetBreakdown[selected].transport}
              </span>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Select a budget level to see a typical breakdown
          </p>
        </div>
      )}
    </div>
  );
}
