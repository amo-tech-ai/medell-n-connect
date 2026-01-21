import { MapPin } from "lucide-react";
import type { ExplorePlaceResult } from "@/types/explore";

interface ExploreMapViewProps {
  places: ExplorePlaceResult[];
  selectedPlace?: ExplorePlaceResult | null;
  onPlaceSelect?: (place: ExplorePlaceResult) => void;
}

const typeColors: Record<string, string> = {
  apartment: "bg-blue-500",
  car: "bg-green-500",
  restaurant: "bg-orange-500",
  event: "bg-purple-500",
};

export function ExploreMapView({ places, selectedPlace, onPlaceSelect }: ExploreMapViewProps) {
  // Filter places with valid coordinates
  const placesWithCoords = places.filter((p) => p.coordinates !== null);

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
        {placesWithCoords.slice(0, 8).map((place, index) => {
          const isSelected = selectedPlace?.id === place.id;
          // Distribute pins around the map in a more realistic pattern
          const positions = [
            { top: "18%", left: "22%" },
            { top: "35%", left: "55%" },
            { top: "55%", left: "28%" },
            { top: "28%", left: "72%" },
            { top: "65%", left: "62%" },
            { top: "42%", left: "38%" },
            { top: "75%", left: "45%" },
            { top: "22%", left: "45%" },
          ];
          const pos = positions[index % positions.length];

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
                <div className={`w-2 h-2 rounded-full ${typeColors[place.type]}`} />
                <span className="text-xs font-semibold whitespace-nowrap">
                  {place.price.replace("/night", "").replace("/day", "").replace("/mo", "")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-card">
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Stays</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Food</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Events</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Cars</span>
          </div>
        </div>
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

      {/* Selected place preview */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 bg-card rounded-xl p-3 shadow-elevated">
          <div className="flex gap-3">
            <img
              src={selectedPlace.image}
              alt={selectedPlace.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm line-clamp-1">{selectedPlace.title}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedPlace.neighborhood}
              </p>
              <p className="text-sm font-semibold text-primary mt-1">{selectedPlace.price}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map attribution placeholder */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50">
        Map integration coming soon
      </div>
    </div>
  );
}
