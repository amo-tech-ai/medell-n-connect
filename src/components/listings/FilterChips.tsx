import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterChip {
  key: string;
  label: string;
  value: string | number | boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onRemove: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterChips({
  filters,
  onRemove,
  onClearAll,
  className,
}: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="pl-3 pr-1 py-1.5 gap-1.5 text-sm font-normal"
        >
          <span className="text-muted-foreground">{filter.label}:</span>
          <span className="font-medium">
            {typeof filter.value === "boolean"
              ? filter.value
                ? "Yes"
                : "No"
              : filter.value}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-1 hover:bg-destructive/20"
            onClick={() => onRemove(filter.key)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      {filters.length > 1 && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
