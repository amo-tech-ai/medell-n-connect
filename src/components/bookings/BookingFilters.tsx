import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingType } from "@/types/booking";

type BookingTab = "upcoming" | "past" | "cancelled";

interface BookingFiltersProps {
  activeTab: BookingTab;
  activeType: BookingType | "all";
  onTabChange: (tab: BookingTab) => void;
  onTypeChange: (type: BookingType | "all") => void;
}

const tabs: { value: BookingTab; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

const types: { value: BookingType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "apartment", label: "Stays" },
  { value: "car", label: "Cars" },
  { value: "restaurant", label: "Dining" },
  { value: "event", label: "Events" },
];

export function BookingFilters({
  activeTab,
  activeType,
  onTabChange,
  onTypeChange,
}: BookingFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Tab filters */}
      <div className="flex gap-2 border-b pb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <Button
            key={type.value}
            variant={activeType === type.value ? "secondary" : "outline"}
            size="sm"
            onClick={() => onTypeChange(type.value)}
            className="rounded-full"
          >
            {type.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
