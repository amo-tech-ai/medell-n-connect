import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, MoreVertical, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
import type { Booking, BookingStatus, BookingType } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  isSelected?: boolean;
  onSelect?: (booking: Booking) => void;
  onView?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

const statusConfig: Record<BookingStatus, { label: string; className: string; icon: typeof CheckCircle }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600", icon: AlertCircle },
  confirmed: { label: "Confirmed", className: "bg-green-500/10 text-green-600", icon: CheckCircle },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground", icon: CheckCircle },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive", icon: XCircle },
  no_show: { label: "No Show", className: "bg-destructive/10 text-destructive", icon: XCircle },
};

const typeConfig: Record<BookingType, { label: string; className: string }> = {
  apartment: { label: "Stay", className: "bg-blue-500/10 text-blue-600" },
  car: { label: "Car Rental", className: "bg-orange-500/10 text-orange-600" },
  restaurant: { label: "Dining", className: "bg-green-500/10 text-green-600" },
  event: { label: "Event", className: "bg-purple-500/10 text-purple-600" },
  tour: { label: "Tour", className: "bg-primary/10 text-primary" },
};

export function BookingCard({
  booking,
  isSelected,
  onSelect,
  onView,
  onCancel,
}: BookingCardProps) {
  const startDate = parseISO(booking.start_date);
  const status = statusConfig[booking.status];
  const type = typeConfig[booking.booking_type];
  const StatusIcon = status.icon;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect?.(booking)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={cn("text-xs", type.className)}>{type.label}</Badge>
              <Badge className={cn("text-xs", status.className)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>

            <h3 className="font-semibold text-lg truncate">{booking.resource_title}</h3>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {format(startDate, "EEE, MMM d, yyyy")}
                {booking.end_date && booking.end_date !== booking.start_date && (
                  <> — {format(parseISO(booking.end_date), "MMM d")}</>
                )}
              </span>
            </div>

            {booking.start_time && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{booking.start_time}</span>
              </div>
            )}

            {booking.confirmation_code && (
              <div className="mt-3 text-xs">
                <span className="text-muted-foreground">Confirmation: </span>
                <span className="font-mono font-medium">{booking.confirmation_code}</span>
              </div>
            )}

            {booking.total_price && (
              <div className="mt-2 font-semibold text-primary">
                {booking.currency || "USD"} {booking.total_price.toLocaleString()}
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
              <DropdownMenuItem onClick={() => onView?.(booking)}>
                View details
              </DropdownMenuItem>
              {booking.status !== "cancelled" && booking.status !== "completed" && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onCancel?.(booking)}
                >
                  Cancel booking
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
