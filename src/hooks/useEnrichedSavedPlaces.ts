import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { EnrichedSavedPlace, LocationType } from "@/types/saved";

export function useEnrichedSavedPlaces(
  locationType?: LocationType,
  collectionId?: string | null
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["enrichedSavedPlaces", user?.id, locationType, collectionId],
    queryFn: async () => {
      if (!user) return [];

      // Fetch saved places
      let query = supabase
        .from("saved_places")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (locationType && locationType !== "all") {
        query = query.eq("location_type", locationType);
      }

      if (collectionId) {
        query = query.eq("collection_id", collectionId);
      }

      const { data: savedPlaces, error } = await query;
      if (error) throw error;

      if (!savedPlaces || savedPlaces.length === 0) {
        return [] as EnrichedSavedPlace[];
      }

      // Group by type to batch fetch
      const byType: Record<string, string[]> = {};
      savedPlaces.forEach((sp) => {
        if (!byType[sp.location_type]) byType[sp.location_type] = [];
        byType[sp.location_type].push(sp.location_id);
      });

      // Fetch resources for each type
      const resources: Record<string, Record<string, any>> = {};

      // Apartments
      if (byType["apartment"]?.length) {
        const { data } = await supabase
          .from("apartments")
          .select("id, title, images, rating, price_monthly, price_daily, neighborhood")
          .in("id", byType["apartment"]);
        if (data) {
          resources["apartment"] = {};
          data.forEach((item) => {
            resources["apartment"][item.id] = {
              title: item.title,
              image: item.images?.[0] || "",
              rating: item.rating,
              price: item.price_monthly
                ? `$${item.price_monthly.toLocaleString()}/mo`
                : item.price_daily
                ? `$${item.price_daily}/day`
                : "",
              location: item.neighborhood,
              type: "apartment" as const,
            };
          });
        }
      }

      // Cars
      if (byType["car"]?.length) {
        const { data } = await supabase
          .from("car_rentals")
          .select("id, make, model, year, images, rating, price_daily")
          .in("id", byType["car"]);
        if (data) {
          resources["car"] = {};
          data.forEach((item) => {
            resources["car"][item.id] = {
              title: `${item.year || ""} ${item.make} ${item.model}`.trim(),
              image: item.images?.[0] || "",
              rating: item.rating,
              price: `$${item.price_daily}/day`,
              location: "Medellín",
              type: "car" as const,
            };
          });
        }
      }

      // Restaurants
      if (byType["restaurant"]?.length) {
        const { data } = await supabase
          .from("restaurants")
          .select("id, name, primary_image_url, rating, price_level, city")
          .in("id", byType["restaurant"]);
        if (data) {
          resources["restaurant"] = {};
          data.forEach((item) => {
            resources["restaurant"][item.id] = {
              title: item.name,
              image: item.primary_image_url || "",
              rating: item.rating,
              price: "$".repeat(item.price_level),
              location: item.city || "Medellín",
              type: "restaurant" as const,
            };
          });
        }
      }

      // Events
      if (byType["event"]?.length) {
        const { data } = await supabase
          .from("events")
          .select("id, name, primary_image_url, rating, ticket_price_min, city, event_start_time")
          .in("id", byType["event"]);
        if (data) {
          resources["event"] = {};
          data.forEach((item) => {
            resources["event"][item.id] = {
              title: item.name,
              image: item.primary_image_url || "",
              rating: item.rating,
              price: item.ticket_price_min
                ? `From $${item.ticket_price_min.toLocaleString()}`
                : "Free",
              location: item.city || "Medellín",
              type: "event" as const,
            };
          });
        }
      }

      // Enrich saved places with resource data
      const enriched: EnrichedSavedPlace[] = savedPlaces.map((sp) => ({
        ...sp,
        location_type: sp.location_type as EnrichedSavedPlace["location_type"],
        resource: resources[sp.location_type]?.[sp.location_id],
      }));

      return enriched;
    },
    enabled: !!user,
  });
}

export function useSavedPlacesCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["savedPlacesCount", user?.id],
    queryFn: async () => {
      if (!user) return { total: 0, byType: {} };

      const { data, error } = await supabase
        .from("saved_places")
        .select("location_type")
        .eq("user_id", user.id);

      if (error) throw error;

      const byType: Record<string, number> = {};
      let total = 0;

      data?.forEach((item) => {
        byType[item.location_type] = (byType[item.location_type] || 0) + 1;
        total++;
      });

      return { total, byType };
    },
    enabled: !!user,
  });
}
