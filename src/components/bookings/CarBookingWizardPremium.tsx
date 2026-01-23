import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Calendar, Clock, MapPin, Shield, Check, ArrowRight, ArrowLeft, Loader2, Car, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

interface CarBookingWizardPremiumProps {
  car: {
    id: string;
    make: string;
    model: string;
    year?: number;
    price_daily: number;
    price_weekly?: number;
    deposit_amount?: number;
    insurance_included?: boolean;
    primary_image_url?: string;
    fuel_type?: string;
    transmission?: string;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "dates" | "pickup" | "insurance" | "review" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "dates", title: "Select Dates" },
  { id: "pickup", title: "Pickup Location" },
  { id: "insurance", title: "Coverage" },
  { id: "review", title: "Review" },
  { id: "confirmation", title: "Confirmed" },
];

const pickupLocations = [
  { id: "airport", name: "José María Córdova Airport", address: "Rionegro", fee: 0, popular: true },
  { id: "poblado", name: "El Poblado Office", address: "Cra 43A #1-50", fee: 0, popular: true },
  { id: "laureles", name: "Laureles Office", address: "Cir 73B #39-80", fee: 0, popular: false },
  { id: "delivery", name: "Hotel/Apartment Delivery", address: "We come to you", fee: 25, popular: false },
];

const insuranceOptions = [
  { id: "basic", name: "Basic Coverage", description: "Third-party liability only", price: 0, icon: "🛡️", recommended: false },
  { id: "standard", name: "Standard Coverage", description: "Collision damage waiver + Liability", price: 15, icon: "🛡️🛡️", recommended: true },
  { id: "premium", name: "Premium Coverage", description: "Full coverage + Zero deductible + Theft", price: 30, icon: "🛡️🛡️🛡️", recommended: false },
];

const pickupTimes = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export function CarBookingWizardPremium({ car, onComplete, onCancel }: CarBookingWizardPremiumProps) {
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
    insurance: "standard",
  });
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const carTitle = `${car.year ? car.year + " " : ""}${car.make} ${car.model}`;

  // Calculate pricing
  const days = bookingData.dateRange?.from && bookingData.dateRange?.to
    ? Math.ceil((bookingData.dateRange.to.getTime() - bookingData.dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Weekly discount if 7+ days
  const useWeeklyRate = days >= 7 && car.price_weekly;
  const weeks = Math.floor(days / 7);
  const extraDays = days % 7;
  const basePrice = useWeeklyRate 
    ? (weeks * (car.price_weekly || 0)) + (extraDays * car.price_daily)
    : days * car.price_daily;
  
  const pickupFee = pickupLocations.find(l => l.id === bookingData.pickupLocation)?.fee || 0;
  const insurancePrice = (insuranceOptions.find(i => i.id === bookingData.insurance)?.price || 0) * days;
  const depositAmount = car.deposit_amount || 200;
  const totalPrice = basePrice + pickupFee + insurancePrice;

  const canProceed = () => {
    switch (currentStep) {
      case "dates":
        return bookingData.dateRange?.from && bookingData.dateRange?.to && days > 0;
      case "pickup":
        return bookingData.pickupLocation && bookingData.pickupTime && bookingData.returnTime;
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
            deposit_amount: depositAmount,
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

  // Confirmation screen
  if (currentStep === "confirmation" && confirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Rental Confirmed!</h1>
          <p className="text-muted-foreground mb-6">{carTitle}</p>
          
          <div className="p-6 rounded-xl bg-muted/50 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Confirmation Code</p>
            <p className="text-3xl font-mono font-bold tracking-wider">{confirmation.code}</p>
          </div>

          <div className="p-4 rounded-lg border mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Pickup</span>
              <span>{format(bookingData.dateRange!.from!, "MMM d")} at {bookingData.pickupTime}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Return</span>
              <span>{format(bookingData.dateRange!.to!, "MMM d")} at {bookingData.returnTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span>{pickupLocations.find(l => l.id === bookingData.pickupLocation)?.name}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={() => navigate("/bookings")} className="w-full">
              View My Bookings
            </Button>
            <Button variant="outline" size="lg" onClick={onComplete || onCancel} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: 3-panel layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_320px] min-h-screen">
        {/* Left Panel - Context */}
        <aside className="border-r bg-muted/30 p-6 flex flex-col">
          <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={onCancel} className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Car
            </Button>
            
            {car.primary_image_url && (
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                <img src={car.primary_image_url} alt={carTitle} className="w-full h-full object-cover" />
              </div>
            )}
            
            <h2 className="font-display text-xl font-semibold mb-1">{carTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {car.transmission && <span className="capitalize">{car.transmission}</span>}
              {car.fuel_type && <span className="capitalize"> • {car.fuel_type}</span>}
            </p>
          </div>

          {/* Progress Steps */}
          <nav className="space-y-1 flex-1">
            {steps.slice(0, -1).map((step, index) => (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  index === currentStepIndex && "bg-primary/10 text-primary",
                  index < currentStepIndex && "text-muted-foreground",
                  index > currentStepIndex && "text-muted-foreground/50"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium",
                  index === currentStepIndex && "bg-primary text-primary-foreground",
                  index < currentStepIndex && "bg-primary/20 text-primary",
                  index > currentStepIndex && "bg-muted text-muted-foreground"
                )}>
                  {index < currentStepIndex ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={cn("font-medium", index === currentStepIndex && "text-foreground")}>
                  {step.title}
                </span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Panel - Work */}
        <main className="p-8 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            <h1 className="font-display text-2xl font-bold mb-2">{steps[currentStepIndex].title}</h1>
            <p className="text-muted-foreground mb-8">
              {currentStep === "dates" && "Choose your pickup and return dates"}
              {currentStep === "pickup" && "Select where you'd like to pick up the vehicle"}
              {currentStep === "insurance" && "Choose your coverage level"}
              {currentStep === "review" && "Review your rental details before confirming"}
            </p>

            {/* Step Content */}
            {currentStep === "dates" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Rental Period</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-14 justify-start text-left font-normal">
                        <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div>
                          {bookingData.dateRange?.from && bookingData.dateRange?.to ? (
                            <div>
                              <span className="font-medium">
                                {format(bookingData.dateRange.from, "MMM d")} – {format(bookingData.dateRange.to, "MMM d, yyyy")}
                              </span>
                              <p className="text-sm text-muted-foreground">{days} days</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Select dates</span>
                          )}
                        </div>
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
                      <SelectTrigger className="h-12">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupTimes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Return Time</Label>
                    <Select value={bookingData.returnTime} onValueChange={(v) => setBookingData({ ...bookingData, returnTime: v })}>
                      <SelectTrigger className="h-12">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupTimes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "pickup" && (
              <div className="space-y-4">
                <RadioGroup value={bookingData.pickupLocation} onValueChange={(v) => setBookingData({ ...bookingData, pickupLocation: v })}>
                  {pickupLocations.map((loc) => (
                    <div 
                      key={loc.id} 
                      className={cn(
                        "flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        bookingData.pickupLocation === loc.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setBookingData({ ...bookingData, pickupLocation: loc.id })}
                    >
                      <RadioGroupItem value={loc.id} id={loc.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <label htmlFor={loc.id} className="font-medium cursor-pointer">{loc.name}</label>
                          {loc.popular && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Popular</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{loc.address}</p>
                      </div>
                      <span className={cn("text-sm font-medium", loc.fee > 0 ? "text-foreground" : "text-green-600")}>
                        {loc.fee > 0 ? `+$${loc.fee}` : "Free"}
                      </span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentStep === "insurance" && (
              <div className="space-y-4">
                <RadioGroup value={bookingData.insurance} onValueChange={(v) => setBookingData({ ...bookingData, insurance: v })}>
                  {insuranceOptions.map((opt) => (
                    <div 
                      key={opt.id} 
                      className={cn(
                        "flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all relative",
                        bookingData.insurance === opt.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setBookingData({ ...bookingData, insurance: opt.id })}
                    >
                      {opt.recommended && (
                        <span className="absolute -top-3 left-4 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                          Recommended
                        </span>
                      )}
                      <RadioGroupItem value={opt.id} id={opt.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{opt.icon}</span>
                          <label htmlFor={opt.id} className="font-medium cursor-pointer">{opt.name}</label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
                      </div>
                      <span className={cn("text-sm font-medium", opt.price > 0 ? "text-foreground" : "text-green-600")}>
                        {opt.price > 0 ? `+$${opt.price}/day` : "Included"}
                      </span>
                    </div>
                  ))}
                </RadioGroup>

                {bookingData.insurance === "basic" && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">Basic coverage has limitations</p>
                      <p className="text-amber-700 mt-1">You'll be responsible for damage up to $1,500. Consider upgrading for peace of mind.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="p-5 rounded-xl border bg-card">
                  <h3 className="font-semibold mb-4">Rental Summary</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Vehicle</dt>
                      <dd className="font-medium">{carTitle}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Pickup</dt>
                      <dd>{format(bookingData.dateRange!.from!, "MMM d")} at {bookingData.pickupTime}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Return</dt>
                      <dd>{format(bookingData.dateRange!.to!, "MMM d")} at {bookingData.returnTime}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration</dt>
                      <dd>{days} days</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Location</dt>
                      <dd>{pickupLocations.find(l => l.id === bookingData.pickupLocation)?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Insurance</dt>
                      <dd>{insuranceOptions.find(i => i.id === bookingData.insurance)?.name}</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Security deposit (refundable)</p>
                  <p className="font-semibold">${depositAmount}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" size="lg" onClick={currentStepIndex === 0 ? onCancel : handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStepIndex === 0 ? "Cancel" : "Back"}
              </Button>
              <Button size="lg" onClick={handleNext} disabled={!canProceed() || createBooking.isPending}>
                {createBooking.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {currentStep === "review" ? "Confirm Rental" : "Continue"}
                {currentStep !== "review" && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </main>

        {/* Right Panel - Intelligence */}
        <aside className="border-l bg-muted/30 p-6">
          <div className="sticky top-6">
            <h3 className="font-semibold mb-4">Price Breakdown</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {useWeeklyRate ? (
                    <>{weeks} week{weeks > 1 ? "s" : ""} + {extraDays} day{extraDays !== 1 ? "s" : ""}</>
                  ) : (
                    <>{days} day{days !== 1 ? "s" : ""} × ${car.price_daily}</>
                  )}
                </span>
                <span>${basePrice}</span>
              </div>
              
              {pickupFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span>${pickupFee}</span>
                </div>
              )}
              
              {insurancePrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance ({days}d)</span>
                  <span>${insurancePrice}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${totalPrice}</span>
              </div>
            </div>

            {useWeeklyRate && (
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-700">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Weekly rate applied!</span>
                </div>
                <p className="text-xs text-green-600 mt-1">You're saving ${(days * car.price_daily) - basePrice} with the weekly discount.</p>
              </div>
            )}

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Free cancellation</p>
                  <p className="text-xs text-muted-foreground">Up to 48 hours before pickup</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Verified vehicle</p>
                  <p className="text-xs text-muted-foreground">Inspected and maintained regularly</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={currentStepIndex === 0 ? onCancel : handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStepIndex === 0 ? "Cancel" : "Back"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length - 1}
            </span>
          </div>
          <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${((currentStepIndex + 1) / (steps.length - 1)) * 100}%` }} 
            />
          </div>
        </header>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4">
            <h1 className="font-display text-xl font-bold mb-4">{steps[currentStepIndex].title}</h1>

            {/* Mobile step content - same as desktop but in scrollable area */}
            {currentStep === "dates" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rental Period</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12 justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {bookingData.dateRange?.from && bookingData.dateRange?.to ? (
                          <span>{format(bookingData.dateRange.from, "MMM d")} – {format(bookingData.dateRange.to, "MMM d")}</span>
                        ) : "Select dates"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={bookingData.dateRange}
                        onSelect={(range) => range && setBookingData({ ...bookingData, dateRange: range })}
                        disabled={{ before: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Pickup</Label>
                    <Select value={bookingData.pickupTime} onValueChange={(v) => setBookingData({ ...bookingData, pickupTime: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {pickupTimes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Return</Label>
                    <Select value={bookingData.returnTime} onValueChange={(v) => setBookingData({ ...bookingData, returnTime: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {pickupTimes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {days > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">{days} days × ${car.price_daily}/day</p>
                    <p className="text-2xl font-bold">${basePrice}</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === "pickup" && (
              <RadioGroup value={bookingData.pickupLocation} onValueChange={(v) => setBookingData({ ...bookingData, pickupLocation: v })} className="space-y-3">
                {pickupLocations.map((loc) => (
                  <div 
                    key={loc.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                      bookingData.pickupLocation === loc.id ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <RadioGroupItem value={loc.id} id={`m-${loc.id}`} />
                    <label htmlFor={`m-${loc.id}`} className="flex-1 cursor-pointer">
                      <span className="font-medium">{loc.name}</span>
                      <p className="text-sm text-muted-foreground">{loc.address}</p>
                    </label>
                    <span className={cn("text-sm font-medium", loc.fee > 0 ? "" : "text-green-600")}>
                      {loc.fee > 0 ? `+$${loc.fee}` : "Free"}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentStep === "insurance" && (
              <RadioGroup value={bookingData.insurance} onValueChange={(v) => setBookingData({ ...bookingData, insurance: v })} className="space-y-3">
                {insuranceOptions.map((opt) => (
                  <div 
                    key={opt.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-all relative",
                      bookingData.insurance === opt.id ? "border-primary bg-primary/5" : "border-border",
                      opt.recommended && "mt-4"
                    )}
                  >
                    {opt.recommended && (
                      <span className="absolute -top-3 left-4 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                    <RadioGroupItem value={opt.id} id={`m-${opt.id}`} />
                    <label htmlFor={`m-${opt.id}`} className="flex-1 cursor-pointer">
                      <span className="font-medium">{opt.name}</span>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </label>
                    <span className={cn("text-sm font-medium", opt.price > 0 ? "" : "text-green-600")}>
                      {opt.price > 0 ? `+$${opt.price}/day` : "Included"}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentStep === "review" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border">
                  <h3 className="font-semibold mb-3">{carTitle}</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Dates</dt>
                      <dd>{format(bookingData.dateRange!.from!, "MMM d")} – {format(bookingData.dateRange!.to!, "MMM d")}</dd>
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
                    <div className="flex justify-between text-lg font-bold">
                      <dt>Total</dt>
                      <dd className="text-primary">${totalPrice}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Mobile Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold">${totalPrice}</p>
          </div>
          <Button size="lg" onClick={handleNext} disabled={!canProceed() || createBooking.isPending}>
            {createBooking.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {currentStep === "review" ? "Confirm Rental" : "Continue"}
            {currentStep !== "review" && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </footer>
      </div>
    </div>
  );
}
