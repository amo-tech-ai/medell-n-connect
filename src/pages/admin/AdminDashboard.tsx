import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { Building2, Car, UtensilsCrossed, CalendarDays, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [apartments, restaurants, events, cars, bookings] = await Promise.all([
        supabase.from("apartments").select("id", { count: "exact", head: true }),
        supabase.from("restaurants").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("car_rentals").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
      ]);

      return {
        apartments: apartments.count || 0,
        restaurants: restaurants.count || 0,
        events: events.count || 0,
        cars: cars.count || 0,
        bookings: bookings.count || 0,
      };
    },
  });
}

function AdminDashboardContent() {
  const { data: stats, isLoading } = useAdminStats();

  const quickActions = [
    { label: "Apartments", path: "/admin/apartments", icon: Building2, count: stats?.apartments },
    { label: "Restaurants", path: "/admin/restaurants", icon: UtensilsCrossed, count: stats?.restaurants },
    { label: "Events", path: "/admin/events", icon: CalendarDays, count: stats?.events },
    { label: "Cars", path: "/admin/cars", icon: Car, count: stats?.cars },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your listings."
      />

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatsCard
            title="Total Apartments"
            value={isLoading ? "..." : stats?.apartments || 0}
            change="+12% from last month"
            changeType="positive"
            icon={Building2}
          />
          <AdminStatsCard
            title="Total Restaurants"
            value={isLoading ? "..." : stats?.restaurants || 0}
            change="+8% from last month"
            changeType="positive"
            icon={UtensilsCrossed}
          />
          <AdminStatsCard
            title="Total Events"
            value={isLoading ? "..." : stats?.events || 0}
            change="+5 new this week"
            changeType="positive"
            icon={CalendarDays}
          />
          <AdminStatsCard
            title="Total Cars"
            value={isLoading ? "..." : stats?.cars || 0}
            change="+3% from last month"
            changeType="positive"
            icon={Car}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Manage Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <action.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{action.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.count !== undefined ? `${action.count} listings` : "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">Activity Feed Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              Track listing updates, user activity, and bookings here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
}
