import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, useThreePanelContext } from "@/components/explore/ThreePanelLayout";
import { CarCard } from "@/components/cars/CarCard";
import { CarFiltersBar } from "@/components/cars/CarFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useCars, useVehicleTypes } from "@/hooks/useCars";
import type { CarFilters, Car } from "@/types/listings";
import type { SelectedItem } from "@/context/ThreePanelContext";

function CarsContent() {
  const [filters, setFilters] = useState<CarFilters>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading, error } = useCars(filters);
  const { data: vehicleTypes = [] } = useVehicleTypes();
  const { openDetailPanel } = useThreePanelContext();

  const handleCarSelect = (car: Car) => {
    setSelectedId(car.id);
    const selectedItem: SelectedItem = {
      type: "car",
      id: car.id,
      data: car,
    };
    openDetailPanel(selectedItem);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Car Rentals</h1>
        <p className="text-muted-foreground mt-1">Find the perfect vehicle for your adventure</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cars..."
            className="pl-10"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <CarFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          vehicleTypes={vehicleTypes}
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <ListingSkeleton count={6} />
      ) : error ? (
        <EmptyState
          title="Error loading cars"
          description="Something went wrong. Please try again."
          action={{ label: "Retry", onClick: () => window.location.reload() }}
        />
      ) : !data?.cars.length ? (
        <EmptyState
          title="No cars found"
          description="Try adjusting your filters to see more results."
          action={{ label: "Clear filters", onClick: () => setFilters({}) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.cars.map((car) => (
            <CarCard 
              key={car.id} 
              car={car}
              isSelected={selectedId === car.id}
              onSelect={() => handleCarSelect(car)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Cars() {
  return (
    <ThreePanelLayout>
      <CarsContent />
    </ThreePanelLayout>
  );
}
