import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SavedPlace {
  id: string;
  user_id: string;
  location_id: string;
  location_type: string;
  collection_id?: string;
  notes?: string;
  tags?: string[];
  is_favorite?: boolean;
  priority?: number;
  saved_at: string;
}

export function useSavedPlaces(locationType?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["savedPlaces", user?.id, locationType],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("saved_places")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (locationType) {
        query = query.eq("location_type", locationType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SavedPlace[];
    },
    enabled: !!user,
  });
}

export function useIsSaved(locationId: string, locationType: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["isSaved", user?.id, locationId, locationType],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("saved_places")
        .select("id")
        .eq("user_id", user.id)
        .eq("location_id", locationId)
        .eq("location_type", locationType)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!locationId,
  });
}

export function useToggleSave() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      locationId,
      locationType,
      isSaved,
    }: {
      locationId: string;
      locationType: string;
      isSaved: boolean;
    }) => {
      if (!user) throw new Error("Must be logged in to save");

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from("saved_places")
          .delete()
          .eq("user_id", user.id)
          .eq("location_id", locationId)
          .eq("location_type", locationType);

        if (error) throw error;
        return { saved: false };
      } else {
        // Add to saved
        const { error } = await supabase.from("saved_places").insert({
          user_id: user.id,
          location_id: locationId,
          location_type: locationType,
        });

        if (error) throw error;
        return { saved: true };
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savedPlaces"] });
      queryClient.invalidateQueries({
        queryKey: ["isSaved", user?.id, variables.locationId],
      });

      toast.success(data.saved ? "Saved to favorites" : "Removed from favorites");
    },
    onError: (error) => {
      toast.error("Failed to update favorites");
      console.error("Save toggle error:", error);
    },
  });
}
