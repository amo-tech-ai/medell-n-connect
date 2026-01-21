import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Shield, ShieldCheck, ShieldAlert, User } from "lucide-react";
import { useAssignRole, useRevokeRole, type UserWithRoles } from "@/hooks/useAdminUsers";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type UserRole = Database["public"]["Enums"]["user_role"];

const AVAILABLE_ROLES: { value: UserRole; label: string; icon: React.ElementType; color: string }[] = [
  { value: "moderator", label: "Moderator", icon: Shield, color: "bg-blue-100 text-blue-700" },
  { value: "admin", label: "Admin", icon: ShieldCheck, color: "bg-amber-100 text-amber-700" },
  { value: "super_admin", label: "Super Admin", icon: ShieldAlert, color: "bg-red-100 text-red-700" },
];

interface UserRoleDialogProps {
  user: UserWithRoles | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserRoleDialog({ user, isOpen, onClose }: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const assignRoleMutation = useAssignRole();
  const revokeRoleMutation = useRevokeRole();

  if (!user) return null;

  const availableToAssign = AVAILABLE_ROLES.filter(
    (r) => !user.roles.includes(r.value)
  );

  const handleAssignRole = async () => {
    if (!selectedRole) return;
    await assignRoleMutation.mutateAsync({ userId: user.id, role: selectedRole });
    setSelectedRole("");
  };

  const handleRevokeRole = async (role: UserRole) => {
    await revokeRoleMutation.mutateAsync({ userId: user.id, role });
  };

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

  const isLoading = assignRoleMutation.isPending || revokeRoleMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage User Roles</DialogTitle>
          <DialogDescription>
            Assign or revoke roles for this user. Changes take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user.full_name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {user.full_name || "No name"}
              </p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          {/* Current Roles */}
          <div>
            <h4 className="text-sm font-medium mb-3">Current Roles</h4>
            {user.roles.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">Standard user (no special roles)</span>
              </div>
            ) : (
              <div className="space-y-2">
                {user.roles.map((role) => {
                  const roleInfo = AVAILABLE_ROLES.find((r) => r.value === role);
                  if (!roleInfo) return null;
                  const Icon = roleInfo.icon;

                  return (
                    <div
                      key={role}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <Badge className={cn("font-normal", roleInfo.color)}>
                          {roleInfo.label}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeRole(role)}
                        disabled={isLoading}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {revokeRoleMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Role */}
          {availableToAssign.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Add Role</h4>
              <div className="flex gap-2">
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToAssign.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <role.icon className="w-4 h-4" />
                          {role.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignRole}
                  disabled={!selectedRole || isLoading}
                >
                  {assignRoleMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
