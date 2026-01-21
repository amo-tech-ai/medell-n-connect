import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Calendar, Clock, Users, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

interface RestaurantBookingWizardProps {
  restaurant: {
    id: string;
    name: string;
    address?: string;
    price_level?: number;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "datetime" | "guests" | "requests" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "datetime", title: "Date & Time" },
  { id: "guests", title: "Party Size" },
  { id: "requests", title: "Special Requests" },
  { id: "confirmation", title: "Confirmed" },
];

const timeSlots = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM",
  "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
];

export function RestaurantBookingWizard({ restaurant, onComplete, onCancel }: RestaurantBookingWizardProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [currentStep, setCurrentStep] = useState<WizardStep>("datetime");
  const [bookingData, setBookingData] = useState({
    date: addDays(new Date(), 1),
    time: "7:00 PM",
    guests: 2,
    specialRequests: "",
    occasion: "",
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
          special_requests: [
            bookingData.occasion && `Occasion: ${bookingData.occasion}`,
            bookingData.specialRequests,
          ].filter(Boolean).join("\n") || undefined,
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

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      {currentStep !== "confirmation" && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length - 1}
            </span>
            <span className="font-medium">{steps[currentStepIndex].title}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentStepIndex + 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      <Card>
        {currentStep !== "confirmation" && (
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{restaurant.name}</CardTitle>
            {restaurant.address && (
              <CardDescription>{restaurant.address}</CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {currentStep === "datetime" && (
            <>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(bookingData.date, "EEEE, MMMM d, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={bookingData.date}
                      onSelect={(date) => date && setBookingData({ ...bookingData, date })}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Select
                  value={bookingData.time}
                  onValueChange={(time) => setBookingData({ ...bookingData, time })}
                >
                  <SelectTrigger>
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === "guests" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Party Size</Label>
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <Select
                    value={bookingData.guests.toString()}
                    onValueChange={(v) => setBookingData({ ...bookingData, guests: parseInt(v) })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                For parties larger than 10, please contact the restaurant directly.
              </div>
            </div>
          )}

          {currentStep === "requests" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Occasion (optional)</Label>
                <Select
                  value={bookingData.occasion}
                  onValueChange={(v) => setBookingData({ ...bookingData, occasion: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Anniversary">Anniversary</SelectItem>
                    <SelectItem value="Date Night">Date Night</SelectItem>
                    <SelectItem value="Business Dinner">Business Dinner</SelectItem>
                    <SelectItem value="Celebration">Celebration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Special Requests (optional)</Label>
                <Textarea
                  placeholder="Dietary restrictions, seating preferences, etc."
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium mb-2">Reservation Summary</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd>{format(bookingData.date, "EEE, MMM d, yyyy")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Time</dt>
                    <dd>{bookingData.time}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Party Size</dt>
                    <dd>{bookingData.guests} guests</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {currentStep === "confirmation" && confirmation && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Reservation Confirmed!</h2>
              <p className="text-muted-foreground mb-4">
                Your table at {restaurant.name} is reserved.
              </p>

              <div className="p-4 rounded-lg bg-muted/50 mb-6">
                <p className="text-xs text-muted-foreground uppercase mb-1">Confirmation</p>
                <p className="text-xl font-mono font-bold">{confirmation.code}</p>
                <div className="text-sm mt-2">
                  <p>{format(bookingData.date, "EEEE, MMMM d, yyyy")}</p>
                  <p>{bookingData.time} · {bookingData.guests} guests</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate("/bookings")}>View My Bookings</Button>
                <Button variant="outline" onClick={onComplete || onCancel}>Close</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {currentStep !== "confirmation" && (
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={currentStepIndex === 0 ? onCancel : handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStepIndex === 0 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed() || createBooking.isPending}>
            {createBooking.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {currentStep === "requests" ? "Confirm Reservation" : "Next"}
            {currentStep !== "requests" && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}
    </div>
  );
}
