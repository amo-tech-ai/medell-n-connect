import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Fetches preview images for all collections
export function useCollectionPreviews() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["collectionPreviews", user?.id],
    queryFn: async () => {
      if (!user) return {};

      // Get all saved places with collection IDs
      const { data: savedPlaces, error: savedError } = await supabase
        .from("saved_places")
        .select("collection_id, location_id, location_type")
        .eq("user_id", user.id)
        .not("collection_id", "is", null);

      if (savedError) throw savedError;

      // Group by collection
      const byCollection: Record<string, { id: string; type: string }[]> = {};
      for (const place of savedPlaces) {
        if (!place.collection_id) continue;
        if (!byCollection[place.collection_id]) {
          byCollection[place.collection_id] = [];
        }
        byCollection[place.collection_id].push({
          id: place.location_id,
          type: place.location_type,
        });
      }

      // Fetch images for each type
      const previews: Record<string, string[]> = {};

      for (const [collectionId, items] of Object.entries(byCollection)) {
        const images: string[] = [];
        const slicedItems = items.slice(0, 4);

        for (const item of slicedItems) {
          let imageUrl: string | null = null;

          if (item.type === "apartment") {
            const { data } = await supabase
              .from("apartments")
              .select("images")
              .eq("id", item.id)
              .single();
            if (data?.images?.[0]) imageUrl = data.images[0];
          } else if (item.type === "restaurant") {
            const { data } = await supabase
              .from("restaurants")
              .select("primary_image_url")
              .eq("id", item.id)
              .single();
            if (data?.primary_image_url) imageUrl = data.primary_image_url;
          } else if (item.type === "car") {
            const { data } = await supabase
              .from("car_rentals")
              .select("images")
              .eq("id", item.id)
              .single();
            if (data?.images?.[0]) imageUrl = data.images[0];
          } else if (item.type === "event") {
            const { data } = await supabase
              .from("events")
              .select("primary_image_url")
              .eq("id", item.id)
              .single();
            if (data?.primary_image_url) imageUrl = data.primary_image_url;
          }

          if (imageUrl) images.push(imageUrl);
        }

        previews[collectionId] = images;
      }

      return previews;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
