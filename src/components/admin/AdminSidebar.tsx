import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Car, 
  UtensilsCrossed, 
  CalendarDays, 
  Users,
  Settings,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Building2, label: "Apartments", path: "/admin/apartments" },
  { icon: Car, label: "Cars", path: "/admin/cars" },
  { icon: UtensilsCrossed, label: "Restaurants", path: "/admin/restaurants" },
  { icon: CalendarDays, label: "Events", path: "/admin/events" },
];

const bottomNavItems = [
  { icon: Users, label: "Users", path: "/admin/users", superAdminOnly: true },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const { user, isSuperAdmin, loading } = useAdminAuth();

  const NavItem = ({ item }: { item: typeof navItems[0] & { superAdminOnly?: boolean } }) => {
    const isActive = location.pathname === item.path || 
      (item.path !== "/admin" && location.pathname.startsWith(item.path));
    
    const linkContent = (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside 
      className={cn(
        "flex flex-col border-r border-border bg-card h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl">⚙️</span>
            </div>
            <div>
              <h1 className="font-display font-semibold text-foreground">Admin</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        )}
        {onToggle && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className={cn("shrink-0", collapsed && "mx-auto")}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="p-3 space-y-1 border-t border-border">
        {bottomNavItems.map((item) => {
          if (item.superAdminOnly && !isSuperAdmin) return null;
          return <NavItem key={item.path} item={item} />;
        })}

        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-muted/50",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm">👤</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {loading ? "..." : user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Back to Site */}
        <Link to="/">
          <Button variant="ghost" className={cn("w-full justify-start gap-2", collapsed && "justify-center")}>
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Back to Site</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
