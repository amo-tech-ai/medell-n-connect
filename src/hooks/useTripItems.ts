import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { TripItem, AddToTripInput } from "@/types/trip";
import type { Json } from "@/integrations/supabase/types";

export function useAddTripItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: AddToTripInput) => {
      if (!user?.id) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("trip_items")
        .insert({
          trip_id: input.trip_id,
          item_type: input.item_type,
          source_id: input.source_id,
          title: input.title,
          description: input.description || null,
          start_at: input.start_at || null,
          end_at: input.end_at || null,
          location_name: input.location_name || null,
          address: input.address || null,
          latitude: input.latitude || null,
          longitude: input.longitude || null,
          metadata: (input.metadata as Json) || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as TripItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trip", data.trip_id] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useUpdateTripItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      trip_id,
      ...updates
    }: Partial<TripItem> & { id: string; trip_id: string }) => {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.start_at !== undefined) updateData.start_at = updates.start_at;
      if (updates.end_at !== undefined) updateData.end_at = updates.end_at;
      if (updates.location_name !== undefined) updateData.location_name = updates.location_name;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
      if (updates.longitude !== undefined) updateData.longitude = updates.longitude;
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata as Json;

      const { data, error } = await supabase
        .from("trip_items")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, trip_id } as TripItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trip", data.trip_id] });
    },
  });
}

export function useDeleteTripItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, trip_id }: { id: string; trip_id: string }) => {
      const { error } = await supabase
        .from("trip_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { trip_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trip", data.trip_id] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
