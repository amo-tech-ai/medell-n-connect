import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThreePanelLayout, usePanelContext } from "@/components/layout/ThreePanelLayout";
import { ApartmentCard } from "@/components/apartments/ApartmentCard";
import { ApartmentFiltersBar } from "@/components/apartments/ApartmentFilters";
import { ListingSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { ApartmentDetailPanel } from "@/components/panels/ApartmentDetailPanel";
import { useApartments, useNeighborhoods } from "@/hooks/useApartments";
import type { ApartmentFilters } from "@/types/listings";

// Default right panel content when no apartment is selected
function ApartmentsDefaultRightPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">$1,200</div>
            <div className="text-xs text-muted-foreground">Avg. Monthly</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">85%</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Top Neighborhoods</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>El Poblado</span><span className="text-muted-foreground">24 listings</span></li>
          <li className="flex justify-between"><span>Laureles</span><span className="text-muted-foreground">18 listings</span></li>
          <li className="flex justify-between"><span>Envigado</span><span className="text-muted-foreground">12 listings</span></li>
        </ul>
      </div>
    </div>
  );
}

// Inner content component that can use panel context
function ApartmentsContent() {
  const [filters, setFilters] = useState<ApartmentFilters>({});
  const { data, isLoading, error } = useApartments(filters);
  const { data: neighborhoods = [] } = useNeighborhoods();
  const { setRightPanelContent } = usePanelContext();

  const handleApartmentSelect = (apartment: any) => {
    setRightPanelContent(<ApartmentDetailPanel apartment={apartment} />);
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
    <ThreePanelLayout rightPanelContent={<ApartmentsDefaultRightPanel />}>
      <ApartmentsContent />
    </ThreePanelLayout>
  );
}
