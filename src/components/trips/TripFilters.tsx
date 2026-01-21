import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TripStatus } from "@/types/trip";

interface TripFiltersProps {
  activeStatus: TripStatus | "all";
  onStatusChange: (status: TripStatus | "all") => void;
}

const statusOptions: { value: TripStatus | "all"; label: string }[] = [
  { value: "all", label: "All Trips" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Drafts" },
  { value: "completed", label: "Completed" },
];

export function TripFilters({ activeStatus, onStatusChange }: TripFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((option) => (
        <Button
          key={option.value}
          variant={activeStatus === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(option.value)}
          className={cn(
            "rounded-full",
            activeStatus === option.value && "bg-primary"
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
