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
  trip_id?: string | null;
  notes?: string;
  tags?: string[];
  is_favorite?: boolean;
  priority?: number;
  saved_at: string;
}

interface UseSavedPlacesOptions {
  locationType?: string;
  tripId?: string | null;
  includeGlobal?: boolean; // Include places with no trip (global favorites)
}

export function useSavedPlaces(options: UseSavedPlacesOptions = {}) {
  const { user } = useAuth();
  const { locationType, tripId, includeGlobal = true } = options;

  return useQuery({
    queryKey: ["savedPlaces", user?.id, locationType, tripId, includeGlobal],
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

      // Trip scoping logic
      if (tripId) {
        if (includeGlobal) {
          // Include both trip-specific and global (null trip_id) items
          query = query.or(`trip_id.eq.${tripId},trip_id.is.null`);
        } else {
          // Only trip-specific items
          query = query.eq("trip_id", tripId);
        }
      } else if (!includeGlobal) {
        // Only global items (no trip)
        query = query.is("trip_id", null);
      }
      // If no tripId and includeGlobal is true, return all items

      const { data, error } = await query;
      if (error) throw error;
      return data as SavedPlace[];
    },
    enabled: !!user,
  });
}

// Legacy hook for backward compatibility
export function useSavedPlacesLegacy(locationType?: string) {
  return useSavedPlaces({ locationType });
}

export function useIsSaved(locationId: string, locationType: string, tripId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["isSaved", user?.id, locationId, locationType, tripId],
    queryFn: async () => {
      if (!user) return false;

      let query = supabase
        .from("saved_places")
        .select("id")
        .eq("user_id", user.id)
        .eq("location_id", locationId)
        .eq("location_type", locationType);

      // Check for specific trip or global save
      if (tripId) {
        query = query.or(`trip_id.eq.${tripId},trip_id.is.null`);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!locationId,
  });
}

interface ToggleSaveParams {
  locationId: string;
  locationType: string;
  isSaved: boolean;
  tripId?: string | null;
}

export function useToggleSave() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ locationId, locationType, isSaved, tripId }: ToggleSaveParams) => {
      if (!user) throw new Error("Must be logged in to save");

      if (isSaved) {
        // Remove from saved
        let deleteQuery = supabase
          .from("saved_places")
          .delete()
          .eq("user_id", user.id)
          .eq("location_id", locationId)
          .eq("location_type", locationType);

        // If tripId is provided, only delete the trip-specific save
        if (tripId) {
          deleteQuery = deleteQuery.eq("trip_id", tripId);
        }

        const { error } = await deleteQuery;

        if (error) throw error;
        return { saved: false };
      } else {
        // Add to saved with optional trip context
        const { error } = await supabase.from("saved_places").insert({
          user_id: user.id,
          location_id: locationId,
          location_type: locationType,
          trip_id: tripId || null,
        });

        if (error) throw error;
        return { saved: true, tripId };
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savedPlaces"] });
      queryClient.invalidateQueries({
        queryKey: ["isSaved", user?.id, variables.locationId],
      });

      const message = data.saved
        ? data.tripId
          ? "Saved to trip"
          : "Saved to favorites"
        : "Removed from favorites";
      toast.success(message);
    },
    onError: (error) => {
      toast.error("Failed to update favorites");
      console.error("Save toggle error:", error);
    },
  });
}
