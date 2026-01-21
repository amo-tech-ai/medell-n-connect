import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ListingDataTable, StatusBadge, Column } from "@/components/admin/ListingDataTable";
import { ListingFormDialog } from "@/components/admin/ListingFormDialog";
import { useAdminListings, useDeleteListing, useToggleListingStatus } from "@/hooks/useAdminListings";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/integrations/supabase/types";

type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];

function AdminRestaurantsContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RestaurantRow | null>(null);

  const { data, isLoading } = useAdminListings("restaurants", { search, status, page });
  const deleteMutation = useDeleteListing("restaurants");
  const toggleStatusMutation = useToggleListingStatus("restaurants");

  const priceLevelDisplay = (level: number) => "$".repeat(level);

  const columns: Column<RestaurantRow>[] = [
    {
      key: "name",
      header: "Restaurant",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
            {item.primary_image_url ? (
              <img src={item.primary_image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground line-clamp-1">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.address || "No address"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "cuisine_types",
      header: "Cuisine",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.cuisine_types?.slice(0, 2).map((cuisine) => (
            <Badge key={cuisine} variant="secondary" className="text-xs">{cuisine}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: "price_level",
      header: "Price",
      render: (item) => <span className="font-medium text-primary">{priceLevelDisplay(item.price_level)}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      render: (item) => <span>⭐ {item.rating?.toFixed(1) || "N/A"} ({item.rating_count || 0})</span>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => <StatusBadge isActive={item.is_active} />,
    },
    {
      key: "is_verified",
      header: "Verified",
      render: (item) => item.is_verified ? <Badge className="bg-blue-100 text-blue-700">Verified</Badge> : null,
    },
  ];

  const handleEdit = (item: RestaurantRow) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: RestaurantRow) => {
    deleteMutation.mutate(item.id);
  };

  const handleToggleStatus = (item: RestaurantRow) => {
    toggleStatusMutation.mutate({ id: item.id, isActive: !item.is_active });
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
        title="Restaurants"
        subtitle={`${data?.total || 0} listings`}
        searchPlaceholder="Search restaurants..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateClick={handleCreate}
        createLabel="Add Restaurant"
      />

      <div className="p-6 space-y-4">
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>

        <ListingDataTable
          data={(data?.listings as RestaurantRow[]) || []}
          columns={columns}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          getStatus={(item) => item.is_active}
        />

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

      <ListingFormDialog
        type="restaurants"
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        listing={editingItem}
      />
    </div>
  );
}

export default function AdminRestaurants() {
  return (
    <AdminLayout>
      <AdminRestaurantsContent />
    </AdminLayout>
  );
}
