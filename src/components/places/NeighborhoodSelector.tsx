import { MapPin, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { neighborhoods } from "@/lib/mockData";

interface NeighborhoodSelectorProps {
  selected: string;
  onSelect: (neighborhood: string) => void;
}

export function NeighborhoodSelector({ selected, onSelect }: NeighborhoodSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-left hover:bg-accent/50 px-3 py-2 rounded-lg transition-colors">
        <MapPin className="w-4 h-4 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Exploring</p>
          <p className="text-sm font-semibold flex items-center gap-1">
            {selected}
            <ChevronDown className="w-4 h-4" />
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => onSelect("All Neighborhoods")} className="cursor-pointer">
          All Neighborhoods
        </DropdownMenuItem>
        {neighborhoods.map((neighborhood) => (
          <DropdownMenuItem
            key={neighborhood}
            onClick={() => onSelect(neighborhood)}
            className="cursor-pointer"
          >
            {neighborhood}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
