import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { 
  Calendar, Users, Check, ArrowRight, ArrowLeft, Loader2, Sparkles, 
  Minus, Plus, Clock, X, Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

interface ApartmentBookingWizardPremiumProps {
  apartment: {
    id: string;
    title: string;
    price_daily?: number;
    price_weekly?: number;
    price_monthly?: number;
    neighborhood?: string;
    minimum_stay_days?: number;
    deposit_amount?: number;
    images?: string[];
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "dates" | "guests" | "review" | "payment" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "dates", title: "Select Dates" },
  { id: "guests", title: "Guests" },
  { id: "review", title: "Review" },
  { id: "payment", title: "Payment" },
  { id: "confirmation", title: "Confirmed" },
];

export function ApartmentBookingWizardPremium({ apartment, onComplete, onCancel }: ApartmentBookingWizardPremiumProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [currentStep, setCurrentStep] = useState<WizardStep>("guests");
  const [bookingData, setBookingData] = useState<{
    dateRange?: DateRange;
    guests: number;
    specialRequests: string;
    termsAccepted: boolean;
  }>({
    dateRange: {
      from: addDays(new Date(), 7),
      to: addDays(new Date(), 14),
    },
    guests: 2,
    specialRequests: "",
    termsAccepted: false,
  });
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Calculate pricing with guest adjustments
  const calculateBasePrice = () => {
    if (!bookingData.dateRange?.from || !bookingData.dateRange?.to) return 0;
    const days = Math.ceil(
      (bookingData.dateRange.to.getTime() - bookingData.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (days >= 30 && apartment.price_monthly) {
      return Math.ceil(days / 30) * apartment.price_monthly;
    }
    if (days >= 7 && apartment.price_weekly) {
      return Math.ceil(days / 7) * apartment.price_weekly;
    }
    return days * (apartment.price_daily || 0);
  };

  const basePrice = calculateBasePrice();
  const guestAdjustment = bookingData.guests > 2 ? (bookingData.guests - 2) * 15 * 7 : 0; // $15/night per extra guest
  const totalPrice = basePrice + guestAdjustment;
  
  const days = bookingData.dateRange?.from && bookingData.dateRange?.to
    ? Math.ceil((bookingData.dateRange.to.getTime() - bookingData.dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const canProceed = () => {
    switch (currentStep) {
      case "dates":
        return bookingData.dateRange?.from && bookingData.dateRange?.to;
      case "guests":
        return bookingData.guests > 0;
      case "review":
        return bookingData.termsAccepted;
      case "payment":
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === "payment") {
      try {
        const booking = await createBooking.mutateAsync({
          booking_type: "apartment",
          resource_id: apartment.id,
          resource_title: apartment.title,
          start_date: format(bookingData.dateRange!.from!, "yyyy-MM-dd"),
          end_date: format(bookingData.dateRange!.to!, "yyyy-MM-dd"),
          party_size: bookingData.guests,
          total_price: totalPrice,
          currency: "USD",
          special_requests: bookingData.specialRequests || undefined,
        });
        
        setConfirmation({ code: booking.confirmation_code || "" });
        setCurrentStep("confirmation");
        toast.success("Booking confirmed!");
      } catch (error) {
        toast.error("Failed to create booking");
      }
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const adjustGuests = (delta: number) => {
    const newValue = Math.max(1, Math.min(10, bookingData.guests + delta));
    setBookingData({ ...bookingData, guests: newValue });
  };

  if (currentStep === "confirmation" && confirmation) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold mb-2">Booking Confirmed</h1>
          <p className="text-muted-foreground mb-8">
            Your stay at {apartment.title} is all set.
          </p>
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border mb-8">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Confirmation Code</p>
            <p className="text-3xl font-mono font-bold text-foreground">{confirmation.code}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={() => navigate("/bookings")} className="w-full">
              View My Bookings
            </Button>
            <Button size="lg" variant="outline" onClick={onComplete || onCancel} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop 3-Panel */}
      <div className="hidden lg:grid lg:grid-cols-[320px_1fr_380px] min-h-screen">
        {/* LEFT: Context */}
        <aside className="border-r border-border bg-secondary/30 p-8 flex flex-col">
          {/* Apartment Preview */}
          <div className="mb-8">
            {apartment.images?.[0] && (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-4">
                <img 
                  src={apartment.images[0]} 
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h2 className="font-display text-lg font-semibold text-foreground line-clamp-2">
              {apartment.title}
            </h2>
            {apartment.neighborhood && (
              <p className="text-sm text-muted-foreground mt-1">{apartment.neighborhood}</p>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Step {currentStepIndex + 1}</span>
              <span className="text-sm text-muted-foreground">of {steps.length - 1}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${((currentStepIndex + 1) / (steps.length - 1)) * 100}%` }} 
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>~1 minute left</span>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel booking
            </button>
          </div>
        </aside>

        {/* CENTER: Work */}
        <main className="p-12 flex flex-col">
          <div className="max-w-lg mx-auto w-full flex-1">
            {currentStep === "guests" && (
              <div className="animate-fade-in">
                <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
                  How many guests?
                </h1>
                <p className="text-lg text-muted-foreground mb-12">
                  Select the number of people staying
                </p>

                {/* Guest Selector */}
                <div className="flex items-center justify-center gap-8 py-12">
                  <button
                    onClick={() => adjustGuests(-1)}
                    disabled={bookingData.guests <= 1}
                    className={cn(
                      "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all",
                      bookingData.guests <= 1
                        ? "border-muted text-muted cursor-not-allowed"
                        : "border-border text-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <div className="text-center">
                    <span className="font-display text-7xl font-bold text-foreground">
                      {bookingData.guests}
                    </span>
                    <p className="text-muted-foreground mt-2">
                      {bookingData.guests === 1 ? "guest" : "guests"}
                    </p>
                  </div>

                  <button
                    onClick={() => adjustGuests(1)}
                    disabled={bookingData.guests >= 10}
                    className={cn(
                      "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all",
                      bookingData.guests >= 10
                        ? "border-muted text-muted cursor-not-allowed"
                        : "border-border text-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Maximum occupancy: 10 guests
                </p>
              </div>
            )}

            {currentStep === "review" && (
              <div className="animate-fade-in space-y-6">
                <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
                  Review your booking
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Please confirm the details are correct
                </p>

                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Dates</dt>
                      <dd className="font-medium">
                        {bookingData.dateRange?.from && format(bookingData.dateRange.from, "MMM d")} – {" "}
                        {bookingData.dateRange?.to && format(bookingData.dateRange.to, "MMM d, yyyy")}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration</dt>
                      <dd className="font-medium">{days} nights</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Guests</dt>
                      <dd className="font-medium">{bookingData.guests}</dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Special Requests (optional)
                  </label>
                  <Textarea
                    placeholder="Early check-in, late check-out, etc."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                  <Checkbox
                    id="terms"
                    checked={bookingData.termsAccepted}
                    onCheckedChange={(checked) => 
                      setBookingData({ ...bookingData, termsAccepted: checked === true })
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    I agree to the cancellation policy and house rules. I understand the booking is subject to host confirmation.
                  </label>
                </div>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="animate-fade-in space-y-6">
                <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
                  Complete payment
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Secure payment processing
                </p>

                <div className="p-8 rounded-2xl border-2 border-dashed border-border text-center">
                  <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Payment integration coming soon
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    For demo purposes, bookings are created as confirmed
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border max-w-lg mx-auto w-full">
            <Button variant="outline" onClick={currentStepIndex === 0 ? onCancel : handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {currentStepIndex === 0 ? "Cancel" : "Back"}
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed() || createBooking.isPending} 
              className="gap-2 px-8"
            >
              {createBooking.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentStep === "payment" ? "Confirm Booking" : currentStep === "guests" ? "Review Booking" : "Continue"}
              {currentStep !== "payment" && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </main>

        {/* RIGHT: Intelligence */}
        <aside className="border-l border-border bg-secondary/30 p-8">
          <div className="space-y-6">
            {/* Live Price Breakdown */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Price Breakdown
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Base price ({days} nights)</dt>
                  <dd className="font-medium">${basePrice.toLocaleString()}</dd>
                </div>
                {guestAdjustment > 0 && (
                  <div className="flex justify-between text-primary">
                    <dt>Extra guests ({bookingData.guests - 2})</dt>
                    <dd className="font-medium">+${guestAdjustment.toLocaleString()}</dd>
                  </div>
                )}
                <div className="pt-3 border-t border-border flex justify-between">
                  <dt className="font-semibold text-foreground">Total</dt>
                  <dd className="text-2xl font-bold text-primary">${totalPrice.toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            {/* AI Tip */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Insight</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                This apartment is most often booked by <strong>2 guests</strong>. Couples love the location and the rooftop views.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile/Tablet */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <header className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length - 1}</p>
            <h1 className="font-semibold">{steps[currentStepIndex].title}</h1>
          </div>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 p-6">
          {currentStep === "guests" && (
            <div className="text-center py-8">
              <h1 className="font-display text-2xl font-semibold mb-8">How many guests?</h1>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => adjustGuests(-1)}
                  disabled={bookingData.guests <= 1}
                  className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-display text-5xl font-bold">{bookingData.guests}</span>
                <button
                  onClick={() => adjustGuests(1)}
                  disabled={bookingData.guests >= 10}
                  className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="p-4 border-t border-border bg-card">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-primary">${totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
            <Button className="flex-1" onClick={handleNext} disabled={!canProceed()}>
              {currentStep === "guests" ? "Review Booking" : "Continue"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
