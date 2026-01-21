import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ListingDataTable, StatusBadge, Column } from "@/components/admin/ListingDataTable";
import { useAdminListings, useDeleteListing, useToggleListingStatus } from "@/hooks/useAdminListings";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type CarRentalRow = Database["public"]["Tables"]["car_rentals"]["Row"];

function AdminCarsContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminListings("car_rentals", { search, status, page });
  const deleteMutation = useDeleteListing("car_rentals");
  const toggleStatusMutation = useToggleListingStatus("car_rentals");

  const columns: Column<CarRentalRow>[] = [
    {
      key: "make",
      header: "Vehicle",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={`${item.make} ${item.model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">🚗</div>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground line-clamp-1">
              {item.make} {item.model}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.year} • {item.vehicle_type}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "transmission",
      header: "Transmission",
      render: (item) => (
        <Badge variant="secondary" className="capitalize">
          {item.transmission}
        </Badge>
      ),
    },
    {
      key: "seats",
      header: "Seats",
      render: (item) => (
        <span>{item.seats} passengers</span>
      ),
    },
    {
      key: "price_daily",
      header: "Price",
      render: (item) => (
        <span className="font-medium">
          ${item.price_daily}/day
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge isActive={item.status === "active"} />,
    },
    {
      key: "featured",
      header: "Featured",
      render: (item) => item.featured ? <Badge className="bg-accent text-accent-foreground">Featured</Badge> : null,
    },
  ];

  const handleEdit = (item: CarRentalRow) => {
    toast.info(`Edit functionality coming soon for: ${item.make} ${item.model}`);
  };

  const handleDelete = (item: CarRentalRow) => {
    deleteMutation.mutate(item.id);
  };

  const handleToggleStatus = (item: CarRentalRow) => {
    toggleStatusMutation.mutate({ id: item.id, isActive: item.status !== "active" });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Car Rentals"
        subtitle={`${data?.total || 0} listings`}
        searchPlaceholder="Search vehicles..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateClick={() => toast.info("Create form coming soon")}
        createLabel="Add Vehicle"
      />

      <div className="p-6 space-y-4">
        {/* Status Filter */}
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Table */}
        <ListingDataTable
          data={(data?.listings as CarRentalRow[]) || []}
          columns={columns}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          getStatus={(item) => item.status === "active"}
        />

        {/* Pagination */}
        {data && (
          <AdminPagination
            currentPage={page}
            totalPages={data.totalPages}
            totalItems={data.total}
            itemsPerPage={data.limit}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminCars() {
  return (
    <AdminLayout>
      <AdminCarsContent />
    </AdminLayout>
  );
}
