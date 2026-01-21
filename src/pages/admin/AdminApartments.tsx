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

type ApartmentRow = Database["public"]["Tables"]["apartments"]["Row"];

function AdminApartmentsContent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApartmentRow | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useAdminListings("apartments", { search: debouncedSearch, status, page });
  const deleteMutation = useDeleteListing("apartments");
  const toggleStatusMutation = useToggleListingStatus("apartments");

  const columns: Column<ApartmentRow>[] = useMemo(() => [
    {
      key: "title",
      header: "Property",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.neighborhood}</p>
          </div>
        </div>
      ),
    },
    {
      key: "bedrooms",
      header: "Beds/Baths",
      render: (item) => (
        <span className="text-sm">
          {item.bedrooms} bed • {item.bathrooms} bath
        </span>
      ),
    },
    {
      key: "price_monthly",
      header: "Price",
      render: (item) => (
        <span className="font-medium">
          ${item.price_monthly?.toLocaleString() || "N/A"}/mo
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

  const handleView = (item: ApartmentRow) => {
    navigate(`/apartments/${item.id}`);
  };

  const handleEdit = (item: ApartmentRow) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: ApartmentRow) => {
    deleteMutation.mutate(item.id);
  };

  const handleToggleStatus = (item: ApartmentRow) => {
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
        title="Apartments"
        subtitle={`${data?.total || 0} listings`}
        searchPlaceholder="Search apartments..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateClick={handleCreate}
        createLabel="Add Apartment"
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
          data={(data?.listings as ApartmentRow[]) || []}
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
        type="apartments"
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        listing={editingItem}
      />
    </div>
  );
}

export default function AdminApartments() {
  return (
    <AdminLayout>
      <AdminApartmentsContent />
    </AdminLayout>
  );
}
