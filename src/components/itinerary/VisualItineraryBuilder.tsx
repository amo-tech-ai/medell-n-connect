import { useState, useMemo, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format, parseISO, addDays, isSameDay } from "date-fns";
import { Plus, Route, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SortableItem } from "./SortableItem";
import { ItemCard } from "./ItineraryItemCard";
import { GoogleMapView } from "./GoogleMapView";
import { TravelTimeIndicator } from "./TravelTimeIndicator";
import { useGoogleDirections, type DirectionsResult } from "@/hooks/useGoogleDirections";
import type { TripItem, TripItemType } from "@/types/trip";

// Haversine formula for distance calculation (fallback when no Google directions)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateTravelTime(distanceKm: number): number {
  return Math.round((distanceKm / 25) * 60);
}

// Google Maps API Key - loaded from env
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface VisualItineraryBuilderProps {
  startDate: string;
  endDate: string;
  items: TripItem[];
  onReorderItem?: (itemId: string, newDayIndex: number, newPosition: number) => void;
  onAddItem?: (dayIndex: number) => void;
  onRemoveItem?: (item: TripItem) => void;
  onEditItem?: (item: TripItem) => void;
  selectedDay?: number;
  onDaySelect?: (dayIndex: number) => void;
  showMapView?: boolean;
  onOptimizeRoute?: (dayItems: TripItem[], dayDate: string) => Promise<void>;
  isOptimizing?: boolean;
  onDirectionsUpdate?: (result: DirectionsResult | null) => void;
}

export function VisualItineraryBuilder({
  startDate,
  endDate,
  items,
  onReorderItem,
  onAddItem,
  onRemoveItem,
  onEditItem,
  selectedDay = 0,
  onDaySelect,
  showMapView = false,
  onOptimizeRoute,
  isOptimizing = false,
  onDirectionsUpdate,
}: VisualItineraryBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Google Directions hook
  const { getDirections, result: directionsResult, isLoading: isLoadingDirections } = useGoogleDirections();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate days array
  const days = useMemo(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const result: Date[] = [];
    let current = start;
    while (current <= end) {
      result.push(current);
      current = addDays(current, 1);
    }
    return result;
  }, [startDate, endDate]);

  // Group items by day
  const itemsByDay = useMemo(() => {
    const grouped: Record<number, TripItem[]> = {};
    days.forEach((_, i) => {
      grouped[i] = [];
    });

    items.forEach((item) => {
      if (item.start_at) {
        const itemDate = parseISO(item.start_at);
        const dayIndex = days.findIndex((d) => isSameDay(d, itemDate));
        if (dayIndex >= 0) {
          grouped[dayIndex].push(item);
        }
      }
    });

    // Sort items within each day by start time
    Object.keys(grouped).forEach((key) => {
      grouped[parseInt(key)].sort((a, b) => {
        if (!a.start_at || !b.start_at) return 0;
        return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
      });
    });

    return grouped;
  }, [items, days]);

  // Get items for the selected day (for map view)
  const selectedDayItems = useMemo(() => {
    return itemsByDay[selectedDay] || [];
  }, [itemsByDay, selectedDay]);

  // Calculate travel segments for selected day - use Google Directions if available
  const travelSegments = useMemo(() => {
    // If we have Google Directions result, use that data
    if (directionsResult?.success && directionsResult.legs) {
      const dayItems = selectedDayItems.filter((i) => i.latitude && i.longitude);
      return directionsResult.legs.map((leg, i) => ({
        from: dayItems[i],
        to: dayItems[i + 1],
        distanceKm: leg.distanceMeters / 1000,
        durationMinutes: Math.round(leg.durationSeconds / 60),
      })).filter(seg => seg.from && seg.to);
    }
    
    // Fallback to Haversine calculation
    const segments: { from: TripItem; to: TripItem; distanceKm: number; durationMinutes: number }[] = [];
    const dayItems = selectedDayItems.filter((i) => i.latitude && i.longitude);
    for (let i = 0; i < dayItems.length - 1; i++) {
      const from = dayItems[i];
      const to = dayItems[i + 1];
      const distanceKm = calculateDistance(from.latitude!, from.longitude!, to.latitude!, to.longitude!);
      segments.push({ from, to, distanceKm, durationMinutes: estimateTravelTime(distanceKm) });
    }
    return segments;
  }, [selectedDayItems, directionsResult]);

  // Fetch directions when selected day items change
  useEffect(() => {
    const fetchDirections = async () => {
      const validItems = selectedDayItems.filter(i => i.latitude && i.longitude);
      if (validItems.length >= 2 && showMapView && GOOGLE_MAPS_API_KEY) {
        const result = await getDirections(validItems);
        onDirectionsUpdate?.(result);
      }
    };
    fetchDirections();
  }, [selectedDayItems, showMapView, getDirections, onDirectionsUpdate]);

  // Handle request directions manually
  const handleRequestDirections = useCallback(async () => {
    const validItems = selectedDayItems.filter(i => i.latitude && i.longitude);
    if (validItems.length >= 2) {
      const result = await getDirections(validItems);
      onDirectionsUpdate?.(result);
    }
  }, [selectedDayItems, getDirections, onDirectionsUpdate]);

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItemId = active.id as string;
    const overId = over.id as string;

    // Determine target day and position
    if (overId.startsWith("day-")) {
      const dayIndex = parseInt(overId.replace("day-", ""));
      const dayItems = itemsByDay[dayIndex] || [];
      onReorderItem?.(activeItemId, dayIndex, dayItems.length);
    } else {
      // Dropped on another item - find its day and position
      for (const [dayIdx, dayItems] of Object.entries(itemsByDay)) {
        const overIndex = dayItems.findIndex((i) => i.id === overId);
        if (overIndex >= 0) {
          onReorderItem?.(activeItemId, parseInt(dayIdx), overIndex);
          break;
        }
      }
    }
  };

  // Render items with travel time indicators
  const renderDayItemsWithTravel = (dayItems: TripItem[]) => {
    const elements: React.ReactNode[] = [];
    dayItems.forEach((item, idx) => {
      elements.push(
        <SortableItem key={item.id} id={item.id}>
          <ItemCard
            item={item}
            onRemove={() => onRemoveItem?.(item)}
            onEdit={() => onEditItem?.(item)}
          />
        </SortableItem>
      );
      // Add travel indicator between items
      if (idx < dayItems.length - 1) {
        const segment = travelSegments.find((s) => s.from.id === item.id);
        if (segment) {
          elements.push(
            <TravelTimeIndicator
              key={`travel-${item.id}`}
              fromName={segment.from.title}
              toName={segment.to.title}
              distanceKm={segment.distanceKm}
              durationMinutes={segment.durationMinutes}
            />
          );
        }
      }
    });
    return elements;
  };

  return (
    <div className={cn("flex gap-4", showMapView && "h-[calc(100vh-280px)]")}>
      {/* Timeline/List View */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className={cn(showMapView ? "w-1/2" : "w-full", "h-full")}>
          <div className="space-y-4 pr-4">
            {days.map((day, dayIndex) => {
              const dayItems = itemsByDay[dayIndex] || [];
              const isSelected = selectedDay === dayIndex;

              return (
                <Card
                  key={dayIndex}
                  className={cn(
                    "transition-all cursor-pointer",
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => onDaySelect?.(dayIndex)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                          {dayIndex + 1}
                        </span>
                        <div>
                          <span className="font-semibold">
                            {format(day, "EEEE")}
                          </span>
                          <span className="text-muted-foreground ml-2 font-normal">
                            {format(day, "MMM d")}
                          </span>
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {/* AI Optimize Button */}
                        {isSelected && dayItems.length >= 2 && onOptimizeRoute && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOptimizeRoute(dayItems, format(day, "yyyy-MM-dd"));
                            }}
                            disabled={isOptimizing}
                          >
                            {isOptimizing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                            {isOptimizing ? "Optimizing..." : "AI Optimize"}
                          </Button>
                        )}
                        {/* Show travel time for the day */}
                        {isSelected && travelSegments.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Route className="w-3 h-3 mr-1" />
                            {travelSegments.reduce((sum, s) => sum + s.durationMinutes, 0)} min travel
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {dayItems.length} {dayItems.length === 1 ? "item" : "items"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <SortableContext
                      items={dayItems.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div
                        id={`day-${dayIndex}`}
                        className="min-h-[60px] space-y-2"
                      >
                        {dayItems.length === 0 ? (
                          <div className="text-center py-4 border-2 border-dashed rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Drop items here or click + to add
                            </p>
                          </div>
                        ) : isSelected && showMapView ? (
                          renderDayItemsWithTravel(dayItems)
                        ) : (
                          dayItems.map((item) => (
                            <SortableItem key={item.id} id={item.id}>
                              <ItemCard
                                item={item}
                                onRemove={() => onRemoveItem?.(item)}
                                onEdit={() => onEditItem?.(item)}
                              />
                            </SortableItem>
                          ))
                        )}
                      </div>
                    </SortableContext>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 border-dashed border"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddItem?.(dayIndex);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Activity
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        <DragOverlay>
          {activeItem && (
            <div className="opacity-80">
              <ItemCard item={activeItem} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Map View - Google Maps or Fallback */}
      {showMapView && (
        <div className="w-1/2 h-full">
          {GOOGLE_MAPS_API_KEY ? (
            <GoogleMapView
              items={selectedDayItems}
              selectedItemId={selectedItemId ?? undefined}
              onItemSelect={(item) => setSelectedItemId(item.id)}
              directionsResult={directionsResult}
              isLoadingDirections={isLoadingDirections}
              onRequestDirections={handleRequestDirections}
              apiKey={GOOGLE_MAPS_API_KEY}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted/50 rounded-xl">
              <div className="text-center text-muted-foreground p-4">
                <p className="font-medium">Google Maps Not Configured</p>
                <p className="text-sm mt-1">Add VITE_GOOGLE_MAPS_API_KEY to enable interactive maps</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
