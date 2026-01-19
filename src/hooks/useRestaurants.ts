import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Restaurant, RestaurantFilters } from "@/types/restaurant";

export function useRestaurants(filters: RestaurantFilters = {}) {
  return useQuery({
    queryKey: ["restaurants", filters],
    queryFn: async () => {
      let query = supabase
        .from("restaurants")
        .select("*", { count: "exact" })
        .eq("is_active", true);

      // Apply search filter
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,cuisine_types.cs.{${filters.search}}`
        );
      }

      // Apply cuisine filter
      if (filters.cuisines?.length) {
        query = query.overlaps("cuisine_types", filters.cuisines);
      }

      // Apply price level filter
      if (filters.priceLevel?.length) {
        query = query.in("price_level", filters.priceLevel);
      }

      // Apply dietary options filter
      if (filters.dietaryOptions?.length) {
        query = query.overlaps("dietary_options", filters.dietaryOptions);
      }

      // Apply ambiance filter
      if (filters.ambiance?.length) {
        query = query.overlaps("ambiance", filters.ambiance);
      }

      // Apply open now filter
      if (filters.openNow) {
        query = query.eq("is_open_now", true);
      }

      // Apply sorting
      const sortBy = filters.sortBy || "rating";
      const sortOrder = filters.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc", nullsFirst: false });

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        restaurants: data as Restaurant[],
        total: count || 0,
        page,
        limit,
      };
    },
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!id,
  });
}

export function useFeaturedRestaurants(limit = 4) {
  return useQuery({
    queryKey: ["restaurants", "featured", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .eq("is_verified", true)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      return data as Restaurant[];
    },
  });
}

export function useCuisineTypes() {
  return useQuery({
    queryKey: ["cuisineTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("cuisine_types")
        .eq("is_active", true);

      if (error) throw error;

      // Get unique cuisine types with counts
      const counts: Record<string, number> = {};
      (data || []).forEach((restaurant) => {
        (restaurant.cuisine_types || []).forEach((cuisine: string) => {
          counts[cuisine] = (counts[cuisine] || 0) + 1;
        });
      });

      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    },
  });
}

export function useDietaryOptions() {
  return useQuery({
    queryKey: ["dietaryOptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("dietary_options")
        .eq("is_active", true);

      if (error) throw error;

      // Get unique dietary options
      const options = new Set<string>();
      (data || []).forEach((restaurant) => {
        (restaurant.dietary_options || []).forEach((option: string) => {
          options.add(option);
        });
      });

      return Array.from(options).sort();
    },
  });
}
