import { format, parseISO, addDays, isSameDay } from "date-fns";
import { Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TripItem, TripItemType } from "@/types/trip";

interface DayTimelineProps {
  startDate: string;
  endDate: string;
  items: TripItem[];
  onAddItem?: (dayIndex: number) => void;
  onRemoveItem?: (item: TripItem) => void;
  selectedDay?: number;
  onDaySelect?: (dayIndex: number) => void;
}

const itemTypeColors: Record<TripItemType, string> = {
  apartment: "bg-blue-500/10 text-blue-600 border-blue-200",
  car: "bg-orange-500/10 text-orange-600 border-orange-200",
  restaurant: "bg-green-500/10 text-green-600 border-green-200",
  event: "bg-purple-500/10 text-purple-600 border-purple-200",
  activity: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  transport: "bg-slate-500/10 text-slate-600 border-slate-200",
  note: "bg-muted text-muted-foreground border-muted",
};

const itemTypeLabels: Record<TripItemType, string> = {
  apartment: "Stay",
  car: "Car",
  restaurant: "Dining",
  event: "Event",
  activity: "Activity",
  transport: "Transport",
  note: "Note",
};

export function DayTimeline({
  startDate,
  endDate,
  items,
  onAddItem,
  onRemoveItem,
  selectedDay,
  onDaySelect,
}: DayTimelineProps) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days: Date[] = [];
  
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  const getItemsForDay = (date: Date) => {
    return items.filter((item) => {
      if (!item.start_at) return false;
      const itemDate = parseISO(item.start_at);
      return isSameDay(itemDate, date);
    });
  };

  return (
    <div className="space-y-4">
      {days.map((day, index) => {
        const dayItems = getItemsForDay(day);
        const isSelected = selectedDay === index;

        return (
          <Card
            key={index}
            className={cn(
              "cursor-pointer transition-all",
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onDaySelect?.(index)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Day {index + 1} — {format(day, "EEEE, MMMM d")}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddItem?.(index);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dayItems.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No activities planned yet
                </p>
              ) : (
                <div className="space-y-3">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              itemTypeColors[item.item_type as TripItemType]
                            )}
                          >
                            {itemTypeLabels[item.item_type as TripItemType] || item.item_type}
                          </Badge>
                          {item.start_at && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(parseISO(item.start_at), "h:mm a")}
                            </span>
                          )}
                        </div>
                        <p className="font-medium truncate">{item.title}</p>
                        {item.location_name && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {item.location_name}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem?.(item);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
