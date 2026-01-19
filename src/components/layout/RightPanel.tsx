import { ReactNode } from "react";
import { Sparkles, Lightbulb, AlertTriangle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightPanelProps {
  children?: ReactNode;
  isDrawer?: boolean;
}

// Default AI suggestions placeholder
function DefaultRightPanelContent() {
  return (
    <div className="space-y-6">
      {/* AI Actions Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">AI Suggestions</h3>
        </div>
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Explore Poblado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on your interests, you might love the cafés in El Poblado.
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Weekend Events</p>
                <p className="text-xs text-muted-foreground mt-1">
                  3 upcoming events match your preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Details Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Quick Info</h3>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weather</span>
              <span className="text-foreground">☀️ 24°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Local time</span>
              <span className="text-foreground">2:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency</span>
              <span className="text-foreground">1 USD = 4,100 COP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Warnings Section (example) */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-sm text-foreground">Alerts</h3>
        </div>
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-sm text-foreground">
            Peak traffic hours: 5-7 PM. Consider metro for faster travel.
          </p>
        </div>
      </section>
    </div>
  );
}

export function RightPanel({ children, isDrawer = false }: RightPanelProps) {
  return (
    <aside
      className={cn(
        "bg-background border-l border-border overflow-y-auto",
        isDrawer ? "h-full" : "h-screen sticky top-0"
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Intelligence</h2>
            <p className="text-xs text-muted-foreground">AI-powered assistance</p>
          </div>
        </div>

        {/* Content */}
        {children || <DefaultRightPanelContent />}
      </div>
    </aside>
  );
}
