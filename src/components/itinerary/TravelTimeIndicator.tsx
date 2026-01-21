import { Car, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TravelTimeIndicatorProps {
  fromName: string;
  toName: string;
  distanceKm: number;
  durationMinutes: number;
  className?: string;
}

export function TravelTimeIndicator({
  fromName,
  toName,
  distanceKm,
  durationMinutes,
  className,
}: TravelTimeIndicatorProps) {
  // Determine travel mode suggestion based on distance
  const travelMode = distanceKm < 1 ? "walk" : distanceKm < 5 ? "taxi" : "car";
  
  const modeConfig = {
    walk: { icon: "🚶", label: "Walk", color: "text-green-600" },
    taxi: { icon: "🚕", label: "Taxi", color: "text-yellow-600" },
    car: { icon: "🚗", label: "Drive", color: "text-blue-600" },
  };

  const mode = modeConfig[travelMode];

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2 px-3 my-1 rounded-lg bg-muted/50 border-l-2 border-dashed border-muted-foreground/30",
        className
      )}
    >
      {/* Route indicator */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-1 h-8 bg-gradient-to-b from-primary/40 to-primary/10 rounded-full" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{distanceKm.toFixed(1)} km</span>
          </div>
        </div>
      </div>

      {/* Travel mode suggestion */}
      <div className={cn("flex items-center gap-1 text-xs", mode.color)}>
        <span>{mode.icon}</span>
        <span className="font-medium">{mode.label}</span>
      </div>
    </div>
  );
}
