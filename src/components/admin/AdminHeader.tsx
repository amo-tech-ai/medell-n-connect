import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onCreateClick?: () => void;
  createLabel?: string;
}

export function AdminHeader({
  title,
  subtitle,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  onCreateClick,
  createLabel = "Create New",
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {onSearchChange && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            {/* Create Button */}
            {onCreateClick && (
              <Button onClick={onCreateClick} className="gap-2">
                <Plus className="w-4 h-4" />
                {createLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
