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
import { format } from "date-fns";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

function AdminEventsContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventRow | null>(null);

  const { data, isLoading } = useAdminListings("events", { search, status, page });
  const deleteMutation = useDeleteListing("events");
  const toggleStatusMutation = useToggleListingStatus("events");

  const columns: Column<EventRow>[] = [
    {
      key: "name",
      header: "Event",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
            {item.primary_image_url ? (
              <img src={item.primary_image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">🎉</div>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground line-clamp-1">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.address || "No location"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "event_type",
      header: "Type",
      render: (item) => item.event_type ? (
        <Badge variant="secondary">{item.event_type}</Badge>
      ) : null,
    },
    {
      key: "event_start_time",
      header: "Date",
      render: (item) => (
        <span className="text-sm">
          {item.event_start_time ? format(new Date(item.event_start_time), "MMM d, yyyy") : "TBD"}
        </span>
      ),
    },
    {
      key: "ticket_price_min",
      header: "Price",
      render: (item) => (
        <span className="font-medium">
          {item.ticket_price_min ? (
            item.ticket_price_max && item.ticket_price_max !== item.ticket_price_min
              ? `$${item.ticket_price_min} - $${item.ticket_price_max}`
              : `$${item.ticket_price_min}`
          ) : "Free"}
        </span>
      ),
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

  const handleEdit = (item: EventRow) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: EventRow) => {
    deleteMutation.mutate(item.id);
  };

  const handleToggleStatus = (item: EventRow) => {
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
        title="Events"
        subtitle={`${data?.total || 0} listings`}
        searchPlaceholder="Search events..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateClick={handleCreate}
        createLabel="Add Event"
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
          data={(data?.listings as EventRow[]) || []}
          columns={columns}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          getStatus={(item) => item.is_active}
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
        type="events"
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        listing={editingItem}
      />
    </div>
  );
}

export default function AdminEvents() {
  return (
    <AdminLayout>
      <AdminEventsContent />
    </AdminLayout>
  );
}
