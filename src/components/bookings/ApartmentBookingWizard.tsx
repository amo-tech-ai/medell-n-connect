import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Calendar, Users, CreditCard, Check, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

interface ApartmentBookingWizardProps {
  apartment: {
    id: string;
    title: string;
    price_daily?: number;
    price_weekly?: number;
    price_monthly?: number;
    neighborhood?: string;
    minimum_stay_days?: number;
    deposit_amount?: number;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "dates" | "guests" | "review" | "payment" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "dates", title: "Dates" },
  { id: "guests", title: "Guest Info" },
  { id: "review", title: "Review" },
  { id: "payment", title: "Payment" },
  { id: "confirmation", title: "Confirmed" },
];

export function ApartmentBookingWizard({ apartment, onComplete, onCancel }: ApartmentBookingWizardProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [currentStep, setCurrentStep] = useState<WizardStep>("dates");
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
    guests: 1,
    specialRequests: "",
    termsAccepted: false,
  });
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Calculate pricing
  const calculatePrice = () => {
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

  const totalPrice = calculatePrice();
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
      // Create booking
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      {currentStep !== "confirmation" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.slice(0, -1).map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center",
                  index < steps.length - 2 && "flex-1"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    index <= currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentStepIndex ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 2 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-2",
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card>
        {currentStep !== "confirmation" && (
          <CardHeader>
            <CardTitle>{steps[currentStepIndex].title}</CardTitle>
            <CardDescription>
              {currentStep === "dates" && `Book your stay at ${apartment.title}`}
              {currentStep === "guests" && "Tell us about your party"}
              {currentStep === "review" && "Review your booking details"}
              {currentStep === "payment" && "Complete your booking"}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {currentStep === "dates" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Check-in / Check-out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingData.dateRange && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {bookingData.dateRange?.from ? (
                        bookingData.dateRange.to ? (
                          <>
                            {format(bookingData.dateRange.from, "LLL dd, y")} -{" "}
                            {format(bookingData.dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(bookingData.dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Select dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={bookingData.dateRange?.from}
                      selected={bookingData.dateRange}
                      onSelect={(range) => setBookingData({ ...bookingData, dateRange: range })}
                      numberOfMonths={2}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {days > 0 && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    {days} nights × ${apartment.price_daily || 0}/night
                  </p>
                  <p className="text-xl font-bold mt-1">${totalPrice.toLocaleString()} total</p>
                </div>
              )}
            </div>
          )}

          {currentStep === "guests" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    max={10}
                    value={bookingData.guests}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, guests: parseInt(e.target.value) || 1 })
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">guests</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests (optional)</Label>
                <Textarea
                  id="requests"
                  placeholder="Late check-in, early check-out, etc."
                  value={bookingData.specialRequests}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, specialRequests: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === "review" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">{apartment.title}</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Dates</dt>
                    <dd className="font-medium">
                      {bookingData.dateRange?.from && format(bookingData.dateRange.from, "MMM d")} -{" "}
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
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-bold text-primary">${totalPrice.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                <Checkbox
                  id="terms"
                  checked={bookingData.termsAccepted}
                  onCheckedChange={(checked) =>
                    setBookingData({ ...bookingData, termsAccepted: checked === true })
                  }
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the cancellation policy and house rules. I understand that the booking
                  is subject to the host's confirmation.
                </label>
              </div>
            </div>
          )}

          {currentStep === "payment" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-dashed text-center">
                <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Payment integration coming soon.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  For now, bookings are created as "confirmed" for demo purposes.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === "confirmation" && confirmation && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Your stay at {apartment.title} is confirmed.
              </p>

              <div className="p-4 rounded-lg bg-muted/50 inline-block mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Confirmation Code
                </p>
                <p className="text-2xl font-mono font-bold">{confirmation.code}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate("/bookings")}>
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={onComplete || onCancel}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep !== "confirmation" && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={currentStepIndex === 0 ? onCancel : handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStepIndex === 0 ? "Cancel" : "Back"}
          </Button>

          <Button onClick={handleNext} disabled={!canProceed() || createBooking.isPending}>
            {createBooking.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {currentStep === "payment" ? "Confirm Booking" : "Next"}
            {currentStep !== "payment" && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}
    </div>
  );
}
