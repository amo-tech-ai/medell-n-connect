import { useState, useMemo } from "react";
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
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format, parseISO, addDays, isSameDay } from "date-fns";
import { Plus, GripVertical, MapPin, Clock, Trash2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SortableItem } from "./SortableItem";
import { ItemCard } from "./ItineraryItemCard";
import type { TripItem, TripItemType } from "@/types/trip";

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
}

export function VisualItineraryBuilder({
  startDate,
  endDate,
  items,
  onReorderItem,
  onAddItem,
  onRemoveItem,
  onEditItem,
  selectedDay,
  onDaySelect,
}: VisualItineraryBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="h-[calc(100vh-250px)]">
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
                    <Badge variant="secondary" className="text-xs">
                      {dayItems.length} {dayItems.length === 1 ? "item" : "items"}
                    </Badge>
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
  );
}
