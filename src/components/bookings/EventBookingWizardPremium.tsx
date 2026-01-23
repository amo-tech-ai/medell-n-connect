import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Ticket, Check, ArrowRight, ArrowLeft, Loader2, Minus, Plus, Calendar, MapPin, Users, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

interface EventBookingWizardPremiumProps {
  event: {
    id: string;
    name: string;
    event_start_time: string;
    event_end_time?: string;
    address?: string;
    venue_name?: string;
    ticket_price_min?: number;
    ticket_price_max?: number;
    primary_image_url?: string;
    category?: string;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "tickets" | "quantity" | "review" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "tickets", title: "Select Tickets" },
  { id: "quantity", title: "How Many?" },
  { id: "review", title: "Review" },
  { id: "confirmation", title: "Confirmed" },
];

export function EventBookingWizardPremium({ event, onComplete, onCancel }: EventBookingWizardPremiumProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [currentStep, setCurrentStep] = useState<WizardStep>("tickets");
  
  const ticketTypes = [
    { 
      id: "general", 
      name: "General Admission", 
      price: event.ticket_price_min || 25, 
      description: "Standard entry to the event",
      perks: ["Event access", "Standing area"]
    },
    { 
      id: "vip", 
      name: "VIP Experience", 
      price: event.ticket_price_max || 75, 
      description: "Premium experience with exclusive perks",
      perks: ["Priority entry", "Reserved seating", "Complimentary drink", "Meet & greet access"],
      recommended: true
    },
  ];

  const [bookingData, setBookingData] = useState({
    ticketType: "general",
    quantity: 2,
  });
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const selectedTicket = ticketTypes.find(t => t.id === bookingData.ticketType)!;
  const totalPrice = selectedTicket.price * bookingData.quantity;
  const eventDate = new Date(event.event_start_time);

  const canProceed = () => {
    switch (currentStep) {
      case "tickets":
        return bookingData.ticketType;
      case "quantity":
        return bookingData.quantity > 0 && bookingData.quantity <= 10;
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
          booking_type: "event",
          resource_id: event.id,
          resource_title: event.name,
          start_date: event.event_start_time.split("T")[0],
          start_time: format(eventDate, "h:mm a"),
          quantity: bookingData.quantity,
          unit_price: selectedTicket.price,
          total_price: totalPrice,
          currency: "USD",
          metadata: { ticket_type: bookingData.ticketType },
        });
        
        setConfirmation({ code: booking.confirmation_code || "" });
        setCurrentStep("confirmation");
        toast.success("Tickets purchased!");
      } catch (error) {
        toast.error("Failed to purchase tickets");
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

  const adjustQuantity = (delta: number) => {
    setBookingData(prev => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + delta)),
    }));
  };

  // Confirmation screen
  if (currentStep === "confirmation" && confirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">You're In!</h1>
          <p className="text-muted-foreground mb-2">{event.name}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {bookingData.quantity} × {selectedTicket.name}
          </p>
          
          <div className="p-6 rounded-xl bg-muted/50 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your Confirmation</p>
            <p className="text-3xl font-mono font-bold tracking-wider">{confirmation.code}</p>
          </div>

          <div className="p-4 rounded-lg border mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{format(eventDate, "EEEE, MMMM d, yyyy")}</p>
                <p className="text-sm text-muted-foreground">{format(eventDate, "h:mm a")}</p>
              </div>
            </div>
            {event.venue_name && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{event.venue_name}</p>
                  {event.address && <p className="text-sm text-muted-foreground">{event.address}</p>}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={() => navigate("/bookings")} className="w-full">
              View My Tickets
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
              Back to Event
            </Button>
            
            {event.primary_image_url && (
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                <img src={event.primary_image_url} alt={event.name} className="w-full h-full object-cover" />
              </div>
            )}
            
            <h2 className="font-display text-xl font-semibold mb-2">{event.name}</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(eventDate, "EEEE, MMM d")}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{format(eventDate, "h:mm a")}</span>
              </div>
              {event.venue_name && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue_name}</span>
                </div>
              )}
            </div>
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
              {currentStep === "tickets" && "Choose your ticket type"}
              {currentStep === "quantity" && "Select the number of tickets you need"}
              {currentStep === "review" && "Review your order before purchasing"}
            </p>

            {/* Step Content */}
            {currentStep === "tickets" && (
              <div className="space-y-4">
                <RadioGroup value={bookingData.ticketType} onValueChange={(v) => setBookingData({ ...bookingData, ticketType: v })}>
                  {ticketTypes.map((ticket) => (
                    <div 
                      key={ticket.id}
                      className={cn(
                        "relative p-5 rounded-xl border-2 cursor-pointer transition-all",
                        bookingData.ticketType === ticket.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setBookingData({ ...bookingData, ticketType: ticket.id })}
                    >
                      {ticket.recommended && (
                        <span className="absolute -top-3 left-4 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                          Best Value
                        </span>
                      )}
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value={ticket.id} id={ticket.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Ticket className="w-4 h-4 text-muted-foreground" />
                            <label htmlFor={ticket.id} className="font-semibold cursor-pointer">{ticket.name}</label>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                          <ul className="space-y-1">
                            {ticket.perks.map((perk, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <Check className="w-3 h-3 text-green-600" />
                                <span>{perk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <span className="text-2xl font-bold">${ticket.price}</span>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentStep === "quantity" && (
              <div className="space-y-8">
                <div className="text-center">
                  <Label className="text-base font-medium mb-6 block">Number of Tickets</Label>
                  <div className="flex items-center justify-center gap-6 py-6">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-14 h-14 rounded-full"
                      onClick={() => adjustQuantity(-1)} 
                      disabled={bookingData.quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="w-24 text-center">
                      <span className="text-6xl font-bold">{bookingData.quantity}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-14 h-14 rounded-full"
                      onClick={() => adjustQuantity(1)} 
                      disabled={bookingData.quantity >= 10}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Maximum 10 tickets per order</p>
                </div>

                <div className="p-6 rounded-xl bg-muted/50 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Ticket className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{bookingData.quantity} × {selectedTicket.name}</span>
                  </div>
                  <p className="text-4xl font-bold">${totalPrice}</p>
                </div>

                {bookingData.quantity >= 4 && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Group booking!</p>
                      <p className="text-sm text-green-700">Great choice for enjoying with friends.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="p-5 rounded-xl border bg-card">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Event</dt>
                      <dd className="font-medium text-right max-w-[200px]">{event.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd>{format(eventDate, "EEEE, MMM d, yyyy")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Time</dt>
                      <dd>{format(eventDate, "h:mm a")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Ticket Type</dt>
                      <dd>{selectedTicket.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Quantity</dt>
                      <dd>{bookingData.quantity} ticket{bookingData.quantity > 1 ? "s" : ""}</dd>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <dt>Total</dt>
                      <dd className="text-primary">${totalPrice}</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Your tickets will be available in your bookings immediately after purchase. 
                    Show your confirmation code at the venue entrance.
                  </p>
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
                {currentStep === "review" ? "Purchase Tickets" : "Continue"}
                {currentStep !== "review" && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </main>

        {/* Right Panel - Intelligence */}
        <aside className="border-l bg-muted/30 p-6">
          <div className="sticky top-6">
            <h3 className="font-semibold mb-4">Order Total</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {bookingData.quantity} × {selectedTicket.name}
                </span>
                <span>${selectedTicket.price * bookingData.quantity}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${totalPrice}</span>
              </div>
            </div>

            {bookingData.ticketType === "vip" && (
              <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">VIP Perks Included</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {selectedTicket.perks.map((perk, i) => (
                    <li key={i}>• {perk}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Ticket className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Instant delivery</p>
                  <p className="text-xs text-muted-foreground">Tickets delivered to your account immediately</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Verified tickets</p>
                  <p className="text-xs text-muted-foreground">100% authentic, guaranteed entry</p>
                </div>
              </div>
            </div>

            {event.category && (
              <div className="mt-6 p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="font-medium capitalize">{event.category}</p>
              </div>
            )}
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

            {currentStep === "tickets" && (
              <RadioGroup value={bookingData.ticketType} onValueChange={(v) => setBookingData({ ...bookingData, ticketType: v })} className="space-y-3">
                {ticketTypes.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all",
                      bookingData.ticketType === ticket.id ? "border-primary bg-primary/5" : "border-border",
                      ticket.recommended && "mt-4"
                    )}
                  >
                    {ticket.recommended && (
                      <span className="absolute -top-3 left-4 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                        Best Value
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={ticket.id} id={`m-${ticket.id}`} className="mt-1" />
                      <label htmlFor={`m-${ticket.id}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold">{ticket.name}</span>
                          <span className="text-xl font-bold">${ticket.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                      </label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentStep === "quantity" && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-6 py-8">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-12 h-12 rounded-full"
                    onClick={() => adjustQuantity(-1)} 
                    disabled={bookingData.quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-5xl font-bold w-16 text-center">{bookingData.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-12 h-12 rounded-full"
                    onClick={() => adjustQuantity(1)} 
                    disabled={bookingData.quantity >= 10}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">{bookingData.quantity} × {selectedTicket.name}</p>
                  <p className="text-3xl font-bold mt-1">${totalPrice}</p>
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border">
                  <h3 className="font-semibold mb-3">{event.name}</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd>{format(eventDate, "MMM d, yyyy")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Time</dt>
                      <dd>{format(eventDate, "h:mm a")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tickets</dt>
                      <dd>{bookingData.quantity} × {selectedTicket.name}</dd>
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
            {currentStep === "review" ? "Purchase" : "Continue"}
            {currentStep !== "review" && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </footer>
      </div>
    </div>
  );
}
