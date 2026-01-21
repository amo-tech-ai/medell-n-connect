import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { MapPin, Clock, Route, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TripItem, TripItemType } from "@/types/trip";

interface ItineraryMapViewProps {
  items: TripItem[];
  selectedItemId?: string;
  onItemSelect?: (item: TripItem) => void;
}

interface TravelSegment {
  from: TripItem;
  to: TripItem;
  distanceKm: number;
  durationMinutes: number;
}

const typeColors: Record<TripItemType, string> = {
  apartment: "bg-blue-500",
  car: "bg-orange-500",
  restaurant: "bg-green-500",
  event: "bg-purple-500",
  activity: "bg-yellow-500",
  transport: "bg-slate-500",
  note: "bg-muted",
};

const typeIcons: Record<TripItemType, string> = {
  apartment: "🏠",
  car: "🚗",
  restaurant: "🍽️",
  event: "🎉",
  activity: "⭐",
  transport: "🚌",
  note: "📝",
};

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimate travel time based on distance (assuming average city speed of 25 km/h with traffic)
function estimateTravelTime(distanceKm: number): number {
  const averageSpeedKmh = 25;
  return Math.round((distanceKm / averageSpeedKmh) * 60);
}

export function ItineraryMapView({
  items,
  selectedItemId,
  onItemSelect,
}: ItineraryMapViewProps) {
  // Filter items with valid coordinates
  const itemsWithCoords = useMemo(
    () => items.filter((item) => item.latitude !== null && item.longitude !== null),
    [items]
  );

  // Calculate travel segments between consecutive items
  const travelSegments = useMemo((): TravelSegment[] => {
    const segments: TravelSegment[] = [];
    for (let i = 0; i < itemsWithCoords.length - 1; i++) {
      const from = itemsWithCoords[i];
      const to = itemsWithCoords[i + 1];
      if (from.latitude && from.longitude && to.latitude && to.longitude) {
        const distanceKm = calculateDistance(
          from.latitude,
          from.longitude,
          to.latitude,
          to.longitude
        );
        segments.push({
          from,
          to,
          distanceKm,
          durationMinutes: estimateTravelTime(distanceKm),
        });
      }
    }
    return segments;
  }, [itemsWithCoords]);

  // Calculate total travel stats
  const totalStats = useMemo(() => {
    const totalDistance = travelSegments.reduce((sum, seg) => sum + seg.distanceKm, 0);
    const totalTime = travelSegments.reduce((sum, seg) => sum + seg.durationMinutes, 0);
    return { totalDistance, totalTime };
  }, [travelSegments]);

  // Calculate bounding box and positions for pins
  const pinPositions = useMemo(() => {
    if (itemsWithCoords.length === 0) return [];

    const lats = itemsWithCoords.map((i) => i.latitude!);
    const lngs = itemsWithCoords.map((i) => i.longitude!);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding
    const latPadding = (maxLat - minLat) * 0.15 || 0.01;
    const lngPadding = (maxLng - minLng) * 0.15 || 0.01;

    return itemsWithCoords.map((item) => {
      const latRange = maxLat - minLat + 2 * latPadding || 1;
      const lngRange = maxLng - minLng + 2 * lngPadding || 1;

      // Convert to percentage position (inverted for lat since CSS top goes down)
      const top = ((maxLat + latPadding - item.latitude!) / latRange) * 100;
      const left = ((item.longitude! - minLng + lngPadding) / lngRange) * 100;

      return {
        item,
        top: Math.max(10, Math.min(90, top)),
        left: Math.max(10, Math.min(90, left)),
      };
    });
  }, [itemsWithCoords]);

  // Calculate route line positions
  const routeLines = useMemo(() => {
    return travelSegments.map((segment, index) => {
      const fromPos = pinPositions.find((p) => p.item.id === segment.from.id);
      const toPos = pinPositions.find((p) => p.item.id === segment.to.id);
      if (!fromPos || !toPos) return null;
      return {
        segment,
        index,
        fromTop: fromPos.top,
        fromLeft: fromPos.left,
        toTop: toPos.top,
        toLeft: toPos.left,
      };
    }).filter(Boolean);
  }, [pinPositions, travelSegments]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50 rounded-xl">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Add activities to see them on the map</p>
        </div>
      </div>
    );
  }

  if (itemsWithCoords.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50 rounded-xl">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No location data for today's activities</p>
          <p className="text-sm mt-1">Add activities with addresses to see the route</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-muted/30 rounded-xl overflow-hidden">
      {/* Stylized map background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--secondary)/0.5) 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      />

      {/* Route lines (SVG overlay) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 6 3, 0 6"
              fill="hsl(var(--primary))"
              opacity="0.6"
            />
          </marker>
        </defs>
        {routeLines.map((line) => {
          if (!line) return null;
          return (
            <g key={`route-${line.index}`}>
              {/* Route line */}
              <line
                x1={`${line.fromLeft}%`}
                y1={`${line.fromTop}%`}
                x2={`${line.toLeft}%`}
                y2={`${line.toTop}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.4"
                markerEnd="url(#arrowhead)"
              />
              {/* Travel time label */}
              <foreignObject
                x={`${(line.fromLeft + line.toLeft) / 2 - 4}%`}
                y={`${(line.fromTop + line.toTop) / 2 - 3}%`}
                width="8%"
                height="6%"
                className="overflow-visible"
              >
                <div className="flex items-center justify-center">
                  <span className="text-[10px] bg-background/90 px-1.5 py-0.5 rounded-full shadow-sm border whitespace-nowrap">
                    {line.segment.durationMinutes} min
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* Map pins */}
      <div className="absolute inset-0 p-4">
        {pinPositions.map(({ item, top, left }, index) => {
          const isSelected = selectedItemId === item.id;
          const itemType = item.item_type as TripItemType;

          return (
            <button
              key={item.id}
              onClick={() => onItemSelect?.(item)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-full shadow-lg border-2 transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary scale-110"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                )}
              >
                {/* Step number */}
                <span
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                    isSelected ? "bg-primary-foreground/20" : "bg-muted"
                  )}
                >
                  {index + 1}
                </span>
                {/* Icon */}
                <span className="text-sm">{typeIcons[itemType]}</span>
                {/* Title (truncated) */}
                <span className="text-xs font-medium max-w-[80px] truncate">
                  {item.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats panel */}
      {travelSegments.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
          <Badge variant="secondary" className="bg-background/90 shadow-sm">
            <Route className="w-3 h-3 mr-1" />
            {totalStats.totalDistance.toFixed(1)} km total
          </Badge>
          <Badge variant="secondary" className="bg-background/90 shadow-sm">
            <Clock className="w-3 h-3 mr-1" />
            {totalStats.totalTime} min travel
          </Badge>
          <Badge variant="secondary" className="bg-background/90 shadow-sm">
            <Navigation className="w-3 h-3 mr-1" />
            {itemsWithCoords.length} stops
          </Badge>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/90 rounded-lg p-2 shadow-sm border text-xs">
        <div className="flex items-center gap-1 text-muted-foreground mb-1">
          <span>Activity Types</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(["restaurant", "event", "activity", "apartment"] as TripItemType[]).map((type) => (
            <span key={type} className="flex items-center gap-0.5">
              <span>{typeIcons[type]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
