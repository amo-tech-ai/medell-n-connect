import { Calendar, MapPin, DollarSign, MoreVertical } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Trip, TripStatus } from "@/types/trip";

interface TripCardProps {
  trip: Trip;
  isSelected?: boolean;
  onSelect?: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
}

const statusColors: Record<TripStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-primary text-primary-foreground",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<TripStatus, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function TripCard({
  trip,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: TripCardProps) {
  const startDate = parseISO(trip.start_date);
  const endDate = parseISO(trip.end_date);
  const days = differenceInDays(endDate, startDate) + 1;
  const status = trip.status as TripStatus;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect?.(trip)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn("text-xs", statusColors[status])}>
                {statusLabels[status]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {days} {days === 1 ? "day" : "days"}
              </span>
            </div>

            <h3 className="font-semibold text-lg truncate">{trip.title}</h3>

            {trip.destination && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{trip.destination}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
              </span>
            </div>

            {trip.budget && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>
                  {trip.currency || "USD"} {trip.budget.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(trip)}>
                Edit trip
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete?.(trip)}
              >
                Delete trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
