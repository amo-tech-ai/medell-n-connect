import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, useThreePanelContext } from "@/components/explore/ThreePanelLayout";
import { ApartmentCard } from "@/components/apartments/ApartmentCard";
import { ApartmentFiltersBar } from "@/components/apartments/ApartmentFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { useApartments, useNeighborhoods } from "@/hooks/useApartments";
import type { ApartmentFilters, Apartment } from "@/types/listings";
import type { SelectedItem } from "@/context/ThreePanelContext";

function ApartmentsContent() {
  const [filters, setFilters] = useState<ApartmentFilters>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading, error } = useApartments(filters);
  const { data: neighborhoods = [] } = useNeighborhoods();
  const { openDetailPanel } = useThreePanelContext();

  const handleApartmentSelect = (apartment: Apartment) => {
    setSelectedId(apartment.id);
    const selectedItem: SelectedItem = {
      type: "apartment",
      id: apartment.id,
      data: apartment,
    };
    openDetailPanel(selectedItem);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Apartments</h1>
        <p className="text-muted-foreground mt-1">Find your perfect home in Medellín</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search apartments..."
            className="pl-10"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <ApartmentFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          neighborhoods={neighborhoods}
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <ListingSkeleton count={6} />
      ) : error ? (
        <EmptyState
          title="Error loading apartments"
          description="Something went wrong. Please try again."
          action={{ label: "Retry", onClick: () => window.location.reload() }}
        />
      ) : !data?.apartments.length ? (
        <EmptyState
          title="No apartments found"
          description="Try adjusting your filters to see more results."
          action={{ label: "Clear filters", onClick: () => setFilters({}) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.apartments.map((apt) => (
            <ApartmentCard 
              key={apt.id} 
              apartment={apt}
              isSelected={selectedId === apt.id}
              onSelect={() => handleApartmentSelect(apt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Apartments() {
  return (
    <ThreePanelLayout>
      <ApartmentsContent />
    </ThreePanelLayout>
  );
}
