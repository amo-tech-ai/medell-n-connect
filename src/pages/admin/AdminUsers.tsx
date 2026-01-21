import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { UserRoleDialog } from "@/components/admin/UserRoleDialog";
import { useAdminUsers, type UserWithRoles } from "@/hooks/useAdminUsers";
import { useDebounce } from "@/hooks/useDebounce";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings2, Shield, ShieldCheck, ShieldAlert, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ElementType; color: string }> = {
  user: { label: "User", icon: User, color: "bg-muted text-muted-foreground" },
  moderator: { label: "Moderator", icon: Shield, color: "bg-blue-100 text-blue-700" },
  admin: { label: "Admin", icon: ShieldCheck, color: "bg-amber-100 text-amber-700" },
  super_admin: { label: "Super Admin", icon: ShieldAlert, color: "bg-red-100 text-red-700" },
};

function AdminUsersContent() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, refetch } = useAdminUsers({
    search: debouncedSearch,
    role: roleFilter,
    page,
  });

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const handleManageRoles = (user: UserWithRoles) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    refetch();
  };

  const renderRoleBadges = (roles: UserRole[]) => {
    if (roles.length === 0) {
      return (
        <Badge variant="secondary" className="font-normal">
          <User className="w-3 h-3 mr-1" />
          User
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => {
          const config = ROLE_CONFIG[role];
          const Icon = config.icon;
          return (
            <Badge key={role} className={cn("font-normal", config.color)}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <AdminHeader
          title="User Management"
          subtitle="Loading..."
          searchPlaceholder="Search users..."
          searchValue={search}
          onSearchChange={setSearch}
        />
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="User Management"
        subtitle={`${data?.total || 0} users`}
        searchPlaceholder="Search users..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="p-6 space-y-4">
        {/* Role Filter */}
        <Tabs value={roleFilter} onValueChange={setRoleFilter}>
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="user">Standard</TabsTrigger>
            <TabsTrigger value="moderator">Moderators</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="super_admin">Super Admins</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Users Table */}
        {data?.users && data.users.length > 0 ? (
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getInitials(user.full_name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.full_name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderRoleBadges(user.roles)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.last_active_at
                        ? format(new Date(user.last_active_at), "MMM d, yyyy")
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManageRoles(user)}
                        className="gap-2"
                      >
                        <Settings2 className="w-4 h-4" />
                        Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No users found</h3>
            <p className="text-sm text-muted-foreground">
              {search ? "Try adjusting your search query" : "No users match the selected filter"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <AdminPagination
            currentPage={page}
            totalPages={data.totalPages}
            totalItems={data.total}
            itemsPerPage={data.limit}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Role Management Dialog */}
      <UserRoleDialog
        user={selectedUser}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}

export default function AdminUsers() {
  return (
    <AdminLayout requiredRole="super_admin">
      <AdminUsersContent />
    </AdminLayout>
  );
}
