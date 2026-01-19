import { Sparkles, Send } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Concierge() {
  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-4 lg:px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">AI Concierge</h1>
              <p className="text-muted-foreground text-sm">Your personal Medellín guide</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground text-center">
            Coming Soon
          </h2>
          <p className="text-muted-foreground text-center mt-3 max-w-md">
            Our AI concierge will help you discover personalized recommendations,
            plan your itinerary, and answer all your questions about Medellín.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
            {[
              "Where should I eat tonight?",
              "Best rooftop bars in El Poblado",
              "Weekend trip to Guatapé",
              "Coffee shops for remote work",
            ].map((suggestion) => (
              <button
                key={suggestion}
                className="px-4 py-3 bg-card border border-border rounded-xl text-sm text-left hover:border-primary hover:text-primary transition-colors"
                disabled
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 lg:px-6 py-4 border-t border-border">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <Input
              placeholder="Ask about places, events, or get recommendations..."
              className="flex-1"
              disabled
            />
            <Button size="icon" disabled>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI features launching in Phase 2
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
