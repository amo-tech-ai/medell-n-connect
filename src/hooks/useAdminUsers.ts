import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_active_at: string | null;
  roles: UserRole[];
}

interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export function useAdminUsers(filters: UserFilters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      // Fetch profiles
      let profilesQuery = supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, created_at, last_active_at", { count: "exact" });

      if (filters.search) {
        profilesQuery = profilesQuery.or(
          `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`
        );
      }

      const { data: profiles, count, error: profilesError } = await profilesQuery
        .order("created_at", { ascending: false })
        .range(from, to);

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        return { users: [], total: 0, page, limit, totalPages: 0 };
      }

      // Fetch roles for these users
      const userIds = profiles.map((p) => p.id);
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      if (rolesError) throw rolesError;

      // Map roles to users
      const rolesByUser: Record<string, UserRole[]> = {};
      (rolesData || []).forEach((r) => {
        if (!rolesByUser[r.user_id]) {
          rolesByUser[r.user_id] = [];
        }
        rolesByUser[r.user_id].push(r.role);
      });

      // Filter by role if specified
      let usersWithRoles: UserWithRoles[] = profiles.map((p) => ({
        ...p,
        roles: rolesByUser[p.id] || [],
      }));

      if (filters.role && filters.role !== "all") {
        usersWithRoles = usersWithRoles.filter((u) =>
          filters.role === "user"
            ? u.roles.length === 0
            : u.roles.includes(filters.role as UserRole)
        );
      }

      return {
        users: usersWithRoles,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      // Check if role already exists
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", role)
        .maybeSingle();

      if (existing) {
        throw new Error("User already has this role");
      }

      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success("Role assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign role");
    },
  });
}

export function useRevokeRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success("Role revoked successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to revoke role");
    },
  });
}

export function useUserRoles(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
