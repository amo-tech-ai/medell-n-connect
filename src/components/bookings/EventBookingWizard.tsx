import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Ticket, Users, Check, ArrowRight, ArrowLeft, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

interface EventBookingWizardProps {
  event: {
    id: string;
    name: string;
    event_start_time: string;
    address?: string;
    ticket_price_min?: number;
    ticket_price_max?: number;
  };
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "tickets" | "quantity" | "review" | "confirmation";

const steps: { id: WizardStep; title: string }[] = [
  { id: "tickets", title: "Ticket Type" },
  { id: "quantity", title: "Quantity" },
  { id: "review", title: "Review" },
  { id: "confirmation", title: "Confirmed" },
];

export function EventBookingWizard({ event, onComplete, onCancel }: EventBookingWizardProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [currentStep, setCurrentStep] = useState<WizardStep>("tickets");
  
  const ticketTypes = [
    { id: "general", name: "General Admission", price: event.ticket_price_min || 25, description: "Standard entry" },
    { id: "vip", name: "VIP", price: event.ticket_price_max || 75, description: "Priority entry + exclusive perks" },
  ];

  const [bookingData, setBookingData] = useState({
    ticketType: "general",
    quantity: 1,
  });
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const selectedTicket = ticketTypes.find(t => t.id === bookingData.ticketType)!;
  const totalPrice = selectedTicket.price * bookingData.quantity;

  const canProceed = () => {
    switch (currentStep) {
      case "tickets":
        return bookingData.ticketType;
      case "quantity":
        return bookingData.quantity > 0;
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
          start_time: format(new Date(event.event_start_time), "h:mm a"),
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

  return (
    <div className="max-w-md mx-auto">
      {currentStep !== "confirmation" && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Step {currentStepIndex + 1} of {steps.length - 1}</span>
            <span className="font-medium">{steps[currentStepIndex].title}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${((currentStepIndex + 1) / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>
      )}

      <Card>
        {currentStep !== "confirmation" && (
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <CardDescription>
              {format(new Date(event.event_start_time), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {currentStep === "tickets" && (
            <div className="space-y-2">
              <Label>Select Ticket Type</Label>
              <RadioGroup value={bookingData.ticketType} onValueChange={(v) => setBookingData({ ...bookingData, ticketType: v })}>
                {ticketTypes.map((ticket) => (
                  <div key={ticket.id} className={cn("flex items-center space-x-3 p-4 rounded-lg border cursor-pointer", bookingData.ticketType === ticket.id && "ring-2 ring-primary bg-primary/5")}>
                    <RadioGroupItem value={ticket.id} id={ticket.id} />
                    <label htmlFor={ticket.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{ticket.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                    </label>
                    <span className="font-bold text-lg">${ticket.price}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === "quantity" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Number of Tickets</Label>
                <div className="flex items-center justify-center gap-4 py-4">
                  <Button variant="outline" size="icon" onClick={() => setBookingData({ ...bookingData, quantity: Math.max(1, bookingData.quantity - 1) })} disabled={bookingData.quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-4xl font-bold w-16 text-center">{bookingData.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setBookingData({ ...bookingData, quantity: Math.min(10, bookingData.quantity + 1) })} disabled={bookingData.quantity >= 10}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">{bookingData.quantity} × {selectedTicket.name} @ ${selectedTicket.price}</p>
                <p className="text-2xl font-bold mt-1">${totalPrice}</p>
              </div>
            </div>
          )}

          {currentStep === "review" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Event</dt>
                    <dd className="font-medium text-right">{event.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd>{format(new Date(event.event_start_time), "MMM d, yyyy")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Time</dt>
                    <dd>{format(new Date(event.event_start_time), "h:mm a")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ticket Type</dt>
                    <dd>{selectedTicket.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Quantity</dt>
                    <dd>{bookingData.quantity}</dd>
                  </div>
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
              <h2 className="text-xl font-bold mb-2">Tickets Purchased!</h2>
              <p className="text-muted-foreground mb-1">{event.name}</p>
              <p className="text-sm text-muted-foreground mb-4">{bookingData.quantity} × {selectedTicket.name}</p>
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
            {currentStep === "review" ? "Purchase Tickets" : "Next"}
            {currentStep !== "review" && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}
    </div>
  );
}
