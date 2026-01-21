import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CalendarCheck, Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, useThreePanelContext } from "@/components/explore/ThreePanelLayout";
import { BookingCard } from "@/components/bookings/BookingCard";
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useBookings, useCancelBooking } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import type { Booking, BookingType } from "@/types/booking";
import type { SelectedItem } from "@/context/ThreePanelContext";
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

function BookingsContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [activeType, setActiveType] = useState<BookingType | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const { openDetailPanel } = useThreePanelContext();

  const filters = {
    search: search || undefined,
    tab: activeTab,
    booking_type: activeType !== "all" ? [activeType] : undefined,
  };

  const { data, isLoading, error } = useBookings(filters);
  const cancelBooking = useCancelBooking();

  const handleBookingSelect = (booking: Booking) => {
    setSelectedId(booking.id);
    const selectedItem: SelectedItem = {
      type: booking.booking_type as any,
      id: booking.resource_id,
      data: booking,
    };
    openDetailPanel(selectedItem);
  };

  const handleCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking.mutateAsync(bookingToCancel.id);
      toast.success("Booking cancelled");
      setBookingToCancel(null);
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <EmptyState
          title="Sign in to view your bookings"
          description="Create an account to manage your reservations."
          action={{ label: "Sign In", onClick: () => navigate("/login") }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage your reservations and tickets</p>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md">
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
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isSelected={selectedId === booking.id}
              onSelect={handleBookingSelect}
              onView={() => handleBookingSelect(booking)}
              onCancel={setBookingToCancel}
            />
          ))}
        </div>
      )}

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

export default function Bookings() {
  return (
    <ThreePanelLayout>
      <BookingsContent />
    </ThreePanelLayout>
  );
}
