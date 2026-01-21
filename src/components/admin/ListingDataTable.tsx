import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Eye, Power } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface ListingDataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  getStatus?: (item: T) => boolean;
}

export function ListingDataTable<T extends { id: string }>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  getStatus,
}: ListingDataTableProps<T>) {
  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  const handleDelete = () => {
    if (deleteItem && onDelete) {
      onDelete(deleteItem);
      setDeleteItem(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">📭</span>
        </div>
        <h3 className="font-medium text-foreground mb-1">No listings found</h3>
        <p className="text-sm text-muted-foreground">
          Create your first listing or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className={col.className}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key as string] ?? "-")}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(item)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onToggleStatus && getStatus && (
                        <DropdownMenuItem onClick={() => onToggleStatus(item)}>
                          <Power className="w-4 h-4 mr-2" />
                          {getStatus(item) ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => setDeleteItem(item)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Helper component for status badges
export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge 
      variant={isActive ? "default" : "secondary"}
      className={cn(
        "font-normal",
        isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
