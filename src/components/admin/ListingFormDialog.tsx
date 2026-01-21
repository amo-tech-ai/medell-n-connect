import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApartmentForm, RestaurantForm, EventForm, CarForm } from "@/components/admin/forms";
import { useCreateListing, useUpdateListing, ListingType } from "@/hooks/useAdminListings";
import type { Database } from "@/integrations/supabase/types";

type ApartmentRow = Database["public"]["Tables"]["apartments"]["Row"];
type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];
type EventRow = Database["public"]["Tables"]["events"]["Row"];
type CarRentalRow = Database["public"]["Tables"]["car_rentals"]["Row"];

type ListingData = ApartmentRow | RestaurantRow | EventRow | CarRentalRow;

interface ListingFormDialogProps {
  type: ListingType;
  isOpen: boolean;
  onClose: () => void;
  listing?: ListingData | null;
}

const titles: Record<ListingType, { create: string; edit: string }> = {
  apartments: { create: "Create Apartment", edit: "Edit Apartment" },
  restaurants: { create: "Create Restaurant", edit: "Edit Restaurant" },
  events: { create: "Create Event", edit: "Edit Event" },
  car_rentals: { create: "Create Vehicle", edit: "Edit Vehicle" },
};

export function ListingFormDialog({ type, isOpen, onClose, listing }: ListingFormDialogProps) {
  const createMutation = useCreateListing(type);
  const updateMutation = useUpdateListing(type);

  const isEditing = !!listing;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (data: Partial<ListingData>) => {
    try {
      if (isEditing && listing) {
        await updateMutation.mutateAsync({ id: listing.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const renderForm = () => {
    const commonProps = {
      onSubmit: handleSubmit,
      onCancel: onClose,
      isLoading,
    };

    switch (type) {
      case "apartments":
        return <ApartmentForm {...commonProps} apartment={listing as ApartmentRow | null} />;
      case "restaurants":
        return <RestaurantForm {...commonProps} restaurant={listing as RestaurantRow | null} />;
      case "events":
        return <EventForm {...commonProps} event={listing as EventRow | null} />;
      case "car_rentals":
        return <CarForm {...commonProps} car={listing as CarRentalRow | null} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {isEditing ? titles[type].edit : titles[type].create}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {renderForm()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
