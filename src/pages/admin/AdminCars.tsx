import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ListingDataTable, StatusBadge, Column } from "@/components/admin/ListingDataTable";
import { ListingFormDialog } from "@/components/admin/ListingFormDialog";
import { useAdminListings, useDeleteListing, useToggleListingStatus } from "@/hooks/useAdminListings";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/integrations/supabase/types";
import { useDebounce } from "@/hooks/useDebounce";

type CarRentalRow = Database["public"]["Tables"]["car_rentals"]["Row"];

function AdminCarsContent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarRentalRow | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useAdminListings("car_rentals", { search: debouncedSearch, status, page });
  const deleteMutation = useDeleteListing("car_rentals");
  const toggleStatusMutation = useToggleListingStatus("car_rentals");

  const columns: Column<CarRentalRow>[] = useMemo(() => [
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
  ], []);

  const handleView = (item: CarRentalRow) => {
    navigate(`/cars/${item.id}`);
  };

  const handleEdit = (item: CarRentalRow) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: CarRentalRow) => {
    deleteMutation.mutate(item.id);
  };

  const handleToggleStatus = (item: CarRentalRow) => {
    toggleStatusMutation.mutate({ id: item.id, isActive: item.status !== "active" });
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Car Rentals"
        subtitle={`${data?.total || 0} listings`}
        searchPlaceholder="Search vehicles..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateClick={handleCreate}
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
          onView={handleView}
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

      {/* Form Dialog */}
      <ListingFormDialog
        type="car_rentals"
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        listing={editingItem}
      />
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
