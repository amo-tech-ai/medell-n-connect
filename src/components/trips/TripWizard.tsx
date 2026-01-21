import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Calendar, MapPin, DollarSign, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCreateTrip } from "@/hooks/useTrips";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

type WizardStep = "details" | "dates" | "budget" | "review";

const steps: { id: WizardStep; title: string }[] = [
  { id: "details", title: "Trip Details" },
  { id: "dates", title: "Dates" },
  { id: "budget", title: "Budget" },
  { id: "review", title: "Review" },
];

export function TripWizard() {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();
  const [currentStep, setCurrentStep] = useState<WizardStep>("details");

  // Form state
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("Medellín, Colombia");
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 7),
    to: addDays(new Date(), 14),
  });
  const [budget, setBudget] = useState<number | undefined>();
  const [currency, setCurrency] = useState("USD");

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case "details":
        return title.trim().length > 0;
      case "dates":
        return dateRange?.from && dateRange?.to;
      case "budget":
        return true; // Budget is optional
      case "review":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
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

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    try {
      const trip = await createTrip.mutateAsync({
        title,
        destination: destination || undefined,
        description: description || undefined,
        start_date: format(dateRange.from, "yyyy-MM-dd"),
        end_date: format(dateRange.to, "yyyy-MM-dd"),
        budget,
        currency,
      });

      toast.success("Trip created successfully!");
      navigate(`/trips/${trip.id}`);
    } catch (error) {
      toast.error("Failed to create trip");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1"
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
                {index + 1}
              </div>
              {index < steps.length - 1 && (
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
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <span
              key={step.id}
              className={cn(
                step.id === currentStep
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStepIndex].title}</CardTitle>
          <CardDescription>
            {currentStep === "details" && "Tell us about your trip"}
            {currentStep === "dates" && "When are you traveling?"}
            {currentStep === "budget" && "Set your budget (optional)"}
            {currentStep === "review" && "Review your trip details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === "details" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Trip Name *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer in Medellín"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    className="pl-10"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What's this trip about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {currentStep === "dates" && (
            <div className="space-y-2">
              <Label>Travel Dates</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick your dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {currentStep === "budget" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Total Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    className="pl-10"
                    placeholder="e.g., 2000"
                    value={budget || ""}
                    onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  placeholder="USD"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === "review" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3">Trip Summary</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{title}</dd>
                  </div>
                  {destination && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Destination</dt>
                      <dd className="font-medium">{destination}</dd>
                    </div>
                  )}
                  {dateRange?.from && dateRange?.to && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Dates</dt>
                      <dd className="font-medium">
                        {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                      </dd>
                    </div>
                  )}
                  {budget && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Budget</dt>
                      <dd className="font-medium">
                        {currency} {budget.toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep === "review" ? (
          <Button
            onClick={handleSubmit}
            disabled={createTrip.isPending}
          >
            {createTrip.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Create Trip
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
