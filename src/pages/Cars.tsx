import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, usePanelContext } from "@/components/layout/ThreePanelLayout";
import { CarCard } from "@/components/cars/CarCard";
import { CarFiltersBar } from "@/components/cars/CarFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { CarDetailPanel } from "@/components/panels/CarDetailPanel";
import { useCars, useVehicleTypes } from "@/hooks/useCars";
import type { CarFilters } from "@/types/listings";

// Default right panel content when no car is selected
function CarsDefaultRightPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Comparison</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">$45</div>
            <div className="text-xs text-muted-foreground">Avg. Daily</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">$280</div>
            <div className="text-xs text-muted-foreground">Avg. Weekly</div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Popular Types</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>SUV</span><span className="text-muted-foreground">Best for trips</span></li>
          <li className="flex justify-between"><span>Sedan</span><span className="text-muted-foreground">City driving</span></li>
          <li className="flex justify-between"><span>Compact</span><span className="text-muted-foreground">Budget option</span></li>
        </ul>
      </div>
    </div>
  );
}

// Inner content component that can use panel context
function CarsContent() {
  const [filters, setFilters] = useState<CarFilters>({});
  const { data, isLoading, error } = useCars(filters);
  const { data: vehicleTypes = [] } = useVehicleTypes();
  const { setRightPanelContent } = usePanelContext();

  const handleCarSelect = (car: any) => {
    setRightPanelContent(<CarDetailPanel car={car} />);
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
    <ThreePanelLayout rightPanelContent={<CarsDefaultRightPanel />}>
      <CarsContent />
    </ThreePanelLayout>
  );
}
