import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  granted_at: string;
  expires_at: string | null;
}

export function useAdminAuth() {
  const { user, loading: authLoading } = useAuth();

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        return [];
      }
      return data as UserRoleRecord[];
    },
    enabled: !!user?.id,
  });

  const hasRole = (role: UserRole): boolean => {
    if (!roles) return false;
    return roles.some((r) => r.role === role && (!r.expires_at || new Date(r.expires_at) > new Date()));
  };

  const isAdmin = hasRole("admin") || hasRole("super_admin");
  const isModerator = hasRole("moderator") || isAdmin;
  const isSuperAdmin = hasRole("super_admin");

  return {
    user,
    roles,
    isAdmin,
    isModerator,
    isSuperAdmin,
    hasRole,
    loading: authLoading || rolesLoading,
  };
}
