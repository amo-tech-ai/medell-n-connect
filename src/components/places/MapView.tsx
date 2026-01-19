import { Place } from "@/lib/mockData";
import { MapPin } from "lucide-react";

interface MapViewProps {
  places: Place[];
  selectedPlace?: Place | null;
  onPlaceSelect?: (place: Place) => void;
}

export function MapView({ places, selectedPlace, onPlaceSelect }: MapViewProps) {
  return (
    <div className="relative w-full h-full bg-muted rounded-2xl overflow-hidden">
      {/* Map placeholder with stylized background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--secondary)) 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      />

      {/* Pins */}
      <div className="absolute inset-0 p-8">
        {places.slice(0, 5).map((place, index) => {
          const isSelected = selectedPlace?.id === place.id;
          // Distribute pins around the map
          const positions = [
            { top: "20%", left: "25%" },
            { top: "40%", left: "60%" },
            { top: "60%", left: "30%" },
            { top: "30%", left: "75%" },
            { top: "70%", left: "65%" },
          ];
          const pos = positions[index];

          return (
            <button
              key={place.id}
              onClick={() => onPlaceSelect?.(place)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10"
              style={{ top: pos.top, left: pos.left }}
            >
              <div
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-full shadow-lg
                  ${isSelected ? "bg-primary text-primary-foreground scale-110" : "bg-card text-foreground"}
                `}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-semibold whitespace-nowrap">
                  {place.price.replace("/night", "").replace("/day", "")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-card rounded-lg shadow-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-card rounded-lg shadow-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
          −
        </button>
      </div>

      {/* Map attribution placeholder */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50">
        Map view coming soon
      </div>
    </div>
  );
}
