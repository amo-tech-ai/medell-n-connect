import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThreePanelLayout } from "@/components/explore/ThreePanelLayout";
import { TripWizard } from "@/components/trips/TripWizard";

function TripNewContent() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        onClick={() => navigate("/trips")}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Trips
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Create New Trip</h1>
        <p className="text-muted-foreground mt-1">Plan your next adventure in Medellín</p>
      </div>

      <TripWizard />
    </div>
  );
}

export default function TripNew() {
  return (
    <ThreePanelLayout>
      <TripNewContent />
    </ThreePanelLayout>
  );
}
