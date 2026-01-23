import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isPast, isFuture, isToday } from "date-fns";
import { 
  Search, CalendarCheck, CalendarDays, Plane, Building2, Car, 
  UtensilsCrossed, Ticket, Sparkles, Plus, Clock, MapPin,
  CheckCircle, AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookingCard } from "@/components/bookings/BookingCard";
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useBookings, useCancelBooking } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { Booking, BookingType } from "@/types/booking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Bookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [activeType, setActiveType] = useState<BookingType | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const filters = {
    search: search || undefined,
    tab: activeTab,
    booking_type: activeType !== "all" ? [activeType] : undefined,
  };

  const { data, isLoading, error } = useBookings(filters);
  const cancelBooking = useCancelBooking();

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking.mutateAsync(bookingToCancel.id);
      toast.success("Booking cancelled");
      setBookingToCancel(null);
      if (selectedBooking?.id === bookingToCancel.id) {
        setSelectedBooking(null);
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  // Calculate stats
  const stats = {
    total: data?.bookings.length || 0,
    upcoming: data?.bookings.filter(b => b.status === "confirmed" || b.status === "pending").length || 0,
    thisMonth: data?.bookings.filter(b => {
      const date = parseISO(b.start_date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length || 0,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <CalendarCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to view and manage your reservations.
          </p>
          <Button size="lg" onClick={() => navigate("/login")}>
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop 3-Panel Layout */}
      <div className="hidden lg:grid lg:grid-cols-[320px_1fr_380px] min-h-screen">
        {/* LEFT PANEL: Context */}
        <aside className="border-r border-border bg-secondary/30 flex flex-col h-screen sticky top-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">My Bookings</h1>
                <p className="text-xs text-muted-foreground">Manage reservations</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="space-y-2">
              {[
                { value: "upcoming", label: "Upcoming", icon: CalendarDays },
                { value: "past", label: "Past", icon: Clock },
                { value: "cancelled", label: "Cancelled", icon: AlertCircle },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                    activeTab === tab.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-card border border-border">
                <span className="text-sm text-foreground">Total Bookings</span>
                <span className="font-display text-xl font-bold text-foreground">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-card border border-border">
                <span className="text-sm text-foreground">Upcoming</span>
                <span className="font-display text-xl font-bold text-primary">{stats.upcoming}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-card border border-border">
                <span className="text-sm text-foreground">This Month</span>
                <span className="font-display text-xl font-bold text-foreground">{stats.thisMonth}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-border">
            <Button className="w-full" onClick={() => navigate("/explore")}>
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </div>
        </aside>

        {/* CENTER PANEL: Work */}
        <main className="p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="pl-11 h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { value: "all", label: "All", icon: null },
                { value: "apartment", label: "Stays", icon: Building2 },
                { value: "car", label: "Cars", icon: Car },
                { value: "restaurant", label: "Dining", icon: UtensilsCrossed },
                { value: "event", label: "Events", icon: Ticket },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={activeType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType(type.value as any)}
                  className="rounded-full gap-1.5"
                >
                  {type.icon && <type.icon className="w-3.5 h-3.5" />}
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Booking List */}
            {isLoading ? (
              <ListingSkeleton count={4} />
            ) : error ? (
              <EmptyState
                title="Error loading bookings"
                description="Something went wrong. Please try again."
                action={{ label: "Retry", onClick: () => window.location.reload() }}
              />
            ) : !data?.bookings.length ? (
              <EmptyState
                icon={<CalendarCheck className="w-12 h-12 text-muted-foreground" />}
                title={activeTab === "upcoming" ? "No upcoming bookings" : activeTab === "past" ? "No past bookings" : "No cancelled bookings"}
                description={activeTab === "upcoming" ? "Book a stay, car, or experience to get started!" : "Your booking history will appear here."}
                action={activeTab === "upcoming" ? { label: "Explore", onClick: () => navigate("/explore") } : undefined}
              />
            ) : (
              <div className="space-y-4">
                {data.bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isSelected={selectedBooking?.id === booking.id}
                    onSelect={handleBookingSelect}
                    onView={handleBookingSelect}
                    onCancel={setBookingToCancel}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT PANEL: Intelligence */}
        <aside className="border-l border-border bg-secondary/30 h-screen sticky top-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-1">Details</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {selectedBooking ? "Booking information" : "Select a booking to view details"}
              </p>

              {selectedBooking ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Booking Summary */}
                  <div className="p-5 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                      {selectedBooking.resource_title}
                    </h3>
                    <Badge className={cn(
                      "mb-4",
                      selectedBooking.status === "confirmed" ? "bg-green-500/10 text-green-600" :
                      selectedBooking.status === "pending" ? "bg-yellow-500/10 text-yellow-600" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {selectedBooking.status}
                    </Badge>
                    
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {format(parseISO(selectedBooking.start_date), "EEE, MMM d, yyyy")}
                          {selectedBooking.end_date && selectedBooking.end_date !== selectedBooking.start_date && (
                            <> — {format(parseISO(selectedBooking.end_date), "MMM d")}</>
                          )}
                        </span>
                      </div>
                      {selectedBooking.start_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedBooking.start_time}</span>
                        </div>
                      )}
                      {selectedBooking.party_size && (
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedBooking.party_size} guests</span>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Confirmation */}
                  {selectedBooking.confirmation_code && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confirmation Code</p>
                      <p className="text-2xl font-mono font-bold text-foreground">{selectedBooking.confirmation_code}</p>
                    </div>
                  )}

                  {/* Price */}
                  {selectedBooking.total_price && (
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${selectedBooking.total_price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Calendar
                    </Button>
                    {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                      <Button 
                        className="w-full" 
                        variant="destructive"
                        onClick={() => setBookingToCancel(selectedBooking)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* AI Suggestions */}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI Suggestions</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your booking, you might also enjoy:
                    </p>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 rounded-lg bg-card border border-border text-sm hover:border-primary/50 transition-colors">
                        🍽️ Nearby restaurants
                      </button>
                      <button className="w-full text-left p-3 rounded-lg bg-card border border-border text-sm hover:border-primary/50 transition-colors">
                        🎉 Events during your stay
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Click a booking to see details, timeline, and AI suggestions
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen pb-20">
        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-2xl font-display font-bold">My Bookings</h1>
            <p className="text-muted-foreground text-sm">Manage your reservations</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <BookingFilters
            activeTab={activeTab}
            activeType={activeType}
            onTabChange={setActiveTab}
            onTypeChange={setActiveType}
          />

          {isLoading ? (
            <ListingSkeleton count={4} />
          ) : error ? (
            <EmptyState
              title="Error loading bookings"
              description="Something went wrong."
              action={{ label: "Retry", onClick: () => window.location.reload() }}
            />
          ) : !data?.bookings.length ? (
            <EmptyState
              icon={<CalendarCheck className="w-12 h-12 text-muted-foreground" />}
              title="No bookings"
              description="Book an experience to get started!"
              action={{ label: "Explore", onClick: () => navigate("/explore") }}
            />
          ) : (
            <div className="space-y-3">
              {data.bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onSelect={handleBookingSelect}
                  onView={handleBookingSelect}
                  onCancel={setBookingToCancel}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your booking for "{bookingToCancel?.resource_title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
