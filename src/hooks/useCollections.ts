import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Collection } from "@/types/saved";

export function useCollections() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["collections", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Collection[];
    },
    enabled: !!user,
  });
}

export function useCollection(collectionId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: async () => {
      if (!user || !collectionId) return null;

      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("id", collectionId)
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .single();

      if (error) throw error;
      return data as Collection;
    },
    enabled: !!user && !!collectionId,
  });
}

export function useCreateCollection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      emoji?: string;
      color?: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data: collection, error } = await supabase
        .from("collections")
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description,
          emoji: data.emoji,
          color: data.color,
        })
        .select()
        .single();

      if (error) throw error;
      return collection as Collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created");
    },
    onError: (error) => {
      toast.error("Failed to create collection");
      console.error("Create collection error:", error);
    },
  });
}

export function useUpdateCollection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      description?: string;
      emoji?: string;
      color?: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data: collection, error } = await supabase
        .from("collections")
        .update(data)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return collection as Collection;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection", data.id] });
      toast.success("Collection updated");
    },
    onError: (error) => {
      toast.error("Failed to update collection");
      console.error("Update collection error:", error);
    },
  });
}

export function useDeleteCollection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      if (!user) throw new Error("Must be logged in");

      // Soft delete
      const { error } = await supabase
        .from("collections")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", collectionId)
        .eq("user_id", user.id);

      if (error) throw error;
      return collectionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete collection");
      console.error("Delete collection error:", error);
    },
  });
}

export function useAddToCollection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      savedPlaceId,
      collectionId,
    }: {
      savedPlaceId: string;
      collectionId: string | null;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("saved_places")
        .update({ collection_id: collectionId })
        .eq("id", savedPlaceId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPlaces"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Item updated");
    },
    onError: (error) => {
      toast.error("Failed to update item");
      console.error("Add to collection error:", error);
    },
  });
}

export function useUpdateSavedPlaceNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      savedPlaceId,
      notes,
    }: {
      savedPlaceId: string;
      notes: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("saved_places")
        .update({ notes })
        .eq("id", savedPlaceId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPlaces"] });
      toast.success("Notes saved");
    },
    onError: (error) => {
      toast.error("Failed to save notes");
      console.error("Update notes error:", error);
    },
  });
}
