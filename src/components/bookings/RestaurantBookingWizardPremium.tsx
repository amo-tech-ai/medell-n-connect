import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Calendar, Clock, Check, ArrowRight, ArrowLeft, Loader2, Sparkles, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

interface RestaurantBookingWizardPremiumProps {
  restaurant: {
    id: string;
    name: string;
    address?: string;
    price_level?: number;
    cuisine?: string;
    rating?: number;
    primary_image_url?: string;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "datetime" | "guests" | "requests" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "datetime", title: "Date & Time" },
  { id: "guests", title: "Party Size" },
  { id: "requests", title: "Requests" },
  { id: "confirmation", title: "Confirmed" },
];

const timeSlots = [
  { time: "6:00 PM", popular: false },
  { time: "6:30 PM", popular: false },
  { time: "7:00 PM", popular: true },
  { time: "7:30 PM", popular: true },
  { time: "8:00 PM", popular: true },
  { time: "8:30 PM", popular: false },
  { time: "9:00 PM", popular: false },
];

export function RestaurantBookingWizardPremium({ restaurant, onComplete, onCancel }: RestaurantBookingWizardPremiumProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [currentStep, setCurrentStep] = useState<WizardStep>("datetime");
  const [bookingData, setBookingData] = useState({
    date: addDays(new Date(), 1),
    time: "",
    guests: 2,
    specialRequests: "",
  });
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case "datetime":
        return bookingData.date && bookingData.time;
      case "guests":
        return bookingData.guests > 0;
      case "requests":
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === "requests") {
      try {
        const booking = await createBooking.mutateAsync({
          booking_type: "restaurant",
          resource_id: restaurant.id,
          resource_title: restaurant.name,
          start_date: format(bookingData.date, "yyyy-MM-dd"),
          start_time: bookingData.time,
          party_size: bookingData.guests,
          special_requests: bookingData.specialRequests || undefined,
        });
        
        setConfirmation({ code: booking.confirmation_code || "" });
        setCurrentStep("confirmation");
        toast.success("Reservation confirmed!");
      } catch (error) {
        toast.error("Failed to create reservation");
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

  if (currentStep === "confirmation" && confirmation) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold mb-2">Reservation Confirmed</h1>
          <p className="text-muted-foreground mb-8">
            Your table at {restaurant.name} is ready.
          </p>
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Confirmation Code</p>
            <p className="text-3xl font-mono font-bold text-foreground">{confirmation.code}</p>
            <div className="mt-4 text-sm text-foreground">
              <p>{format(bookingData.date, "EEEE, MMMM d, yyyy")}</p>
              <p>{bookingData.time} · {bookingData.guests} guests</p>
            </div>
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
          {/* Restaurant Preview */}
          <div className="mb-8">
            {restaurant.primary_image_url && (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-4">
                <img 
                  src={restaurant.primary_image_url} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h2 className="font-display text-lg font-semibold text-foreground">
              {restaurant.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {restaurant.cuisine && (
                <span className="text-sm text-muted-foreground">{restaurant.cuisine}</span>
              )}
              {restaurant.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                  <span className="text-sm font-medium">{restaurant.rating}</span>
                </div>
              )}
            </div>
            {restaurant.address && (
              <p className="text-sm text-muted-foreground mt-2">{restaurant.address}</p>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-4">
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
          </div>

          <div className="mt-auto">
            <button 
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel reservation
            </button>
          </div>
        </aside>

        {/* CENTER: Work */}
        <main className="p-12 flex flex-col">
          <div className="max-w-lg mx-auto w-full flex-1">
            {currentStep === "datetime" && (
              <div className="animate-fade-in">
                <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
                  Choose your date and time
                </h1>
                <p className="text-lg text-muted-foreground mb-10">
                  Select when you'd like to dine
                </p>

                {/* Date Picker */}
                <div className="mb-8">
                  <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left h-14 text-base">
                        <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                        {format(bookingData.date, "EEEE, MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={bookingData.date}
                        onSelect={(date) => date && setBookingData({ ...bookingData, date })}
                        disabled={{ before: new Date() }}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setBookingData({ ...bookingData, time: slot.time })}
                        className={cn(
                          "relative py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all",
                          bookingData.time === slot.time
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-foreground hover:border-muted-foreground/50"
                        )}
                      >
                        {slot.time}
                        {slot.popular && bookingData.time !== slot.time && (
                          <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === "guests" && (
              <div className="animate-fade-in">
                <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
                  Party size
                </h1>
                <p className="text-lg text-muted-foreground mb-10">
                  How many guests will be dining?
                </p>

                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBookingData({ ...bookingData, guests: n })}
                      className={cn(
                        "aspect-square rounded-xl border-2 font-display text-2xl font-semibold transition-all",
                        bookingData.guests === n
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-foreground hover:border-muted-foreground/50"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  For parties larger than 10, please call the restaurant directly.
                </p>
              </div>
            )}

            {currentStep === "requests" && (
              <div className="animate-fade-in">
                <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
                  Special requests
                </h1>
                <p className="text-lg text-muted-foreground mb-10">
                  Anything we should know? (Optional)
                </p>

                <textarea
                  placeholder="Dietary restrictions, seating preferences, special occasions..."
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-card p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />

                <div className="mt-8 p-6 rounded-2xl bg-muted/50 border border-border">
                  <h3 className="font-medium text-foreground mb-3">Reservation Summary</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd className="font-medium">{format(bookingData.date, "EEE, MMM d, yyyy")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Time</dt>
                      <dd className="font-medium">{bookingData.time}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Party size</dt>
                      <dd className="font-medium">{bookingData.guests} guests</dd>
                    </div>
                  </dl>
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
              {currentStep === "requests" ? "Confirm Reservation" : "Continue"}
              {currentStep !== "requests" && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </main>

        {/* RIGHT: Intelligence */}
        <aside className="border-l border-border bg-secondary/30 p-8">
          <div className="space-y-6">
            {/* Availability */}
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
                <span className="text-sm font-medium text-foreground">Available</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {bookingData.time 
                  ? `${bookingData.time} on ${format(bookingData.date, "MMM d")} is available`
                  : "Select a time to check availability"
                }
              </p>
            </div>

            {/* AI Insight */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Insight</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                <strong>7:30 PM</strong> is the most popular time at this restaurant. Book early for the best experience.
              </p>
            </div>

            {/* No pricing for restaurants */}
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground text-center">
                No booking fee · Free cancellation up to 2 hours before
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile */}
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

        <main className="flex-1 p-6 overflow-y-auto">
          {currentStep === "datetime" && (
            <div className="space-y-6">
              <h1 className="font-display text-2xl font-semibold">Choose date & time</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(bookingData.date, "EEE, MMM d")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => date && setBookingData({ ...bookingData, date })}
                    disabled={{ before: new Date() }}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setBookingData({ ...bookingData, time: slot.time })}
                    className={cn(
                      "py-3 rounded-lg border text-sm font-medium",
                      bookingData.time === slot.time
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border"
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="p-4 border-t border-border bg-card safe-area-inset-bottom">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
            <Button className="flex-1" onClick={handleNext} disabled={!canProceed()}>
              {currentStep === "requests" ? "Confirm" : "Continue"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
