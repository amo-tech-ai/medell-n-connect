import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Calendar, Clock, MapPin, Shield, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

interface CarBookingWizardProps {
  car: {
    id: string;
    make: string;
    model: string;
    price_daily: number;
    price_weekly?: number;
    deposit_amount?: number;
    insurance_included?: boolean;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "dates" | "pickup" | "insurance" | "review" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "dates", title: "Dates" },
  { id: "pickup", title: "Pickup" },
  { id: "insurance", title: "Insurance" },
  { id: "review", title: "Review" },
  { id: "confirmation", title: "Confirmed" },
];

const pickupLocations = [
  { id: "airport", name: "José María Córdova Airport", fee: 0 },
  { id: "poblado", name: "El Poblado Office", fee: 0 },
  { id: "laureles", name: "Laureles Office", fee: 0 },
  { id: "delivery", name: "Hotel/Apartment Delivery", fee: 25 },
];

const insuranceOptions = [
  { id: "basic", name: "Basic Coverage", description: "Liability only", price: 0 },
  { id: "standard", name: "Standard Coverage", description: "Collision + Liability", price: 15 },
  { id: "premium", name: "Premium Coverage", description: "Full coverage + zero deductible", price: 30 },
];

export function CarBookingWizard({ car, onComplete, onCancel }: CarBookingWizardProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [currentStep, setCurrentStep] = useState<WizardStep>("dates");
  const [bookingData, setBookingData] = useState({
    dateRange: {
      from: addDays(new Date(), 1),
      to: addDays(new Date(), 4),
    } as DateRange,
    pickupTime: "10:00 AM",
    returnTime: "10:00 AM",
    pickupLocation: "poblado",
    insurance: "basic",
  });
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const carTitle = `${car.make} ${car.model}`;

  // Calculate pricing
  const days = bookingData.dateRange?.from && bookingData.dateRange?.to
    ? Math.ceil((bookingData.dateRange.to.getTime() - bookingData.dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const basePrice = days * car.price_daily;
  const pickupFee = pickupLocations.find(l => l.id === bookingData.pickupLocation)?.fee || 0;
  const insurancePrice = (insuranceOptions.find(i => i.id === bookingData.insurance)?.price || 0) * days;
  const totalPrice = basePrice + pickupFee + insurancePrice;

  const canProceed = () => {
    switch (currentStep) {
      case "dates":
        return bookingData.dateRange?.from && bookingData.dateRange?.to;
      case "pickup":
        return bookingData.pickupLocation;
      case "insurance":
        return bookingData.insurance;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === "review") {
      try {
        const booking = await createBooking.mutateAsync({
          booking_type: "car",
          resource_id: car.id,
          resource_title: carTitle,
          start_date: format(bookingData.dateRange!.from!, "yyyy-MM-dd"),
          end_date: format(bookingData.dateRange!.to!, "yyyy-MM-dd"),
          start_time: bookingData.pickupTime,
          end_time: bookingData.returnTime,
          total_price: totalPrice,
          currency: "USD",
          metadata: {
            pickup_location: bookingData.pickupLocation,
            insurance: bookingData.insurance,
          },
        });
        
        setConfirmation({ code: booking.confirmation_code || "" });
        setCurrentStep("confirmation");
        toast.success("Rental confirmed!");
      } catch (error) {
        toast.error("Failed to create rental");
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
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      {currentStep !== "confirmation" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.slice(0, -1).map((step, index) => (
              <div key={step.id} className={cn("flex items-center", index < steps.length - 2 && "flex-1")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {index < currentStepIndex ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 2 && (
                  <div className={cn("flex-1 h-1 mx-2", index < currentStepIndex ? "bg-primary" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Card>
        {currentStep !== "confirmation" && (
          <CardHeader>
            <CardTitle>{carTitle}</CardTitle>
            <CardDescription>${car.price_daily}/day</CardDescription>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {currentStep === "dates" && (
            <>
              <div className="space-y-2">
                <Label>Rental Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {bookingData.dateRange?.from && bookingData.dateRange?.to ? (
                        <>
                          {format(bookingData.dateRange.from, "MMM d")} - {format(bookingData.dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="range"
                      selected={bookingData.dateRange}
                      onSelect={(range) => range && setBookingData({ ...bookingData, dateRange: range })}
                      numberOfMonths={2}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Time</Label>
                  <Select value={bookingData.pickupTime} onValueChange={(v) => setBookingData({ ...bookingData, pickupTime: v })}>
                    <SelectTrigger><Clock className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Return Time</Label>
                  <Select value={bookingData.returnTime} onValueChange={(v) => setBookingData({ ...bookingData, returnTime: v })}>
                    <SelectTrigger><Clock className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {days > 0 && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">{days} days × ${car.price_daily}/day</p>
                  <p className="text-xl font-bold">${basePrice.toLocaleString()}</p>
                </div>
              )}
            </>
          )}

          {currentStep === "pickup" && (
            <div className="space-y-2">
              <Label>Pickup Location</Label>
              <RadioGroup value={bookingData.pickupLocation} onValueChange={(v) => setBookingData({ ...bookingData, pickupLocation: v })}>
                {pickupLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value={loc.id} id={loc.id} />
                    <label htmlFor={loc.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{loc.name}</span>
                      </div>
                    </label>
                    <span className="text-sm">{loc.fee > 0 ? `+$${loc.fee}` : "Free"}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === "insurance" && (
            <div className="space-y-2">
              <Label>Insurance Coverage</Label>
              <RadioGroup value={bookingData.insurance} onValueChange={(v) => setBookingData({ ...bookingData, insurance: v })}>
                {insuranceOptions.map((opt) => (
                  <div key={opt.id} className={cn("flex items-center space-x-3 p-4 rounded-lg border cursor-pointer", bookingData.insurance === opt.id && "ring-2 ring-primary")}>
                    <RadioGroupItem value={opt.id} id={opt.id} />
                    <label htmlFor={opt.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{opt.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
                    </label>
                    <span className="font-medium">{opt.price > 0 ? `+$${opt.price}/day` : "Included"}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === "review" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">{carTitle}</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Dates</dt>
                    <dd>{format(bookingData.dateRange!.from!, "MMM d")} - {format(bookingData.dateRange!.to!, "MMM d")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd>{days} days</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pickup</dt>
                    <dd>{pickupLocations.find(l => l.id === bookingData.pickupLocation)?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Insurance</dt>
                    <dd>{insuranceOptions.find(i => i.id === bookingData.insurance)?.name}</dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Rental ({days} days)</dt>
                    <dd>${basePrice}</dd>
                  </div>
                  {pickupFee > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Delivery Fee</dt>
                      <dd>${pickupFee}</dd>
                    </div>
                  )}
                  {insurancePrice > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Insurance</dt>
                      <dd>${insurancePrice}</dd>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-bold text-primary">${totalPrice}</dd>
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
              <h2 className="text-xl font-bold mb-2">Rental Confirmed!</h2>
              <p className="text-muted-foreground mb-4">{carTitle}</p>
              <div className="p-4 rounded-lg bg-muted/50 mb-6">
                <p className="text-xs text-muted-foreground uppercase mb-1">Confirmation</p>
                <p className="text-xl font-mono font-bold">{confirmation.code}</p>
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
            <ArrowLeft className="w-4 h-4 mr-2" />{currentStepIndex === 0 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed() || createBooking.isPending}>
            {createBooking.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {currentStep === "review" ? "Confirm Rental" : "Next"}
            {currentStep !== "review" && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}
    </div>
  );
}
