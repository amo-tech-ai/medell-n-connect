import { Link } from "react-router-dom";
import { Plane, Calendar, X, ExternalLink } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useTripContext } from "@/context/TripContext";
import { Button } from "@/components/ui/button";

interface ActiveTripBannerProps {
  className?: string;
  compact?: boolean;
}

export function ActiveTripBanner({ className, compact = false }: ActiveTripBannerProps) {
  const { activeTrip, clearActiveTrip, hasActiveTrip } = useTripContext();

  if (!hasActiveTrip || !activeTrip) {
    return null;
  }

  const startDate = parseISO(activeTrip.start_date);
  const endDate = parseISO(activeTrip.end_date);
  const days = differenceInDays(endDate, startDate) + 1;
  const today = new Date();
  const daysUntilStart = differenceInDays(startDate, today);

  const getStatusText = () => {
    if (daysUntilStart > 0) {
      return `Starts in ${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"}`;
    } else if (daysUntilStart === 0) {
      return "Starts today!";
    } else if (today <= endDate) {
      return "Currently active";
    } else {
      return "Completed";
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/20",
          className
        )}
      >
        <Plane className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-sm font-medium truncate">{activeTrip.title}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 ml-auto flex-shrink-0"
          onClick={clearActiveTrip}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-xl border border-primary/20",
        className
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Plane className="w-5 h-5 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link 
            to={`/trips/${activeTrip.id}`}
            className="text-sm font-semibold hover:underline truncate"
          >
            {activeTrip.title}
          </Link>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
            {getStatusText()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
          <Calendar className="w-3 h-3" />
          <span>
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")} ({days} days)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link to={`/trips/${activeTrip.id}`}>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={clearActiveTrip}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
