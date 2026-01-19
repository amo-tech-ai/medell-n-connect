import { Sparkles } from "lucide-react";

interface ContextBannerProps {
  neighborhood: string;
}

export function ContextBanner({ neighborhood }: ContextBannerProps) {
  const getContextMessage = () => {
    const hour = new Date().getHours();
    const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

    let timeOfDay = "morning";
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else if (hour >= 21 || hour < 5) timeOfDay = "night";

    const messages = {
      morning: `Perfect for a coffee walk or morning yoga. Here are some spots near you.`,
      afternoon: `It's currently 24°C. Perfect for a walking tour or a rooftop coffee.`,
      evening: `Golden hour in ${neighborhood}. Great time to explore rooftop bars and dinner spots.`,
      night: `The nightlife is coming alive. Check out these evening hotspots.`,
    };

    return {
      title: `${day} ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} in ${neighborhood}`,
      message: messages[timeOfDay as keyof typeof messages],
    };
  };

  const context = getContextMessage();

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-accent" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{context.title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{context.message}</p>
      </div>
    </div>
  );
}
