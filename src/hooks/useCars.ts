import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Car, CarFilters } from "@/types/listings";

export function useCars(filters: CarFilters = {}) {
  return useQuery({
    queryKey: ["cars", filters],
    queryFn: async () => {
      let query = supabase
        .from("car_rentals")
        .select("*")
        .eq("status", "active");

      // Apply search filter
      if (filters.search) {
        query = query.or(
          `make.ilike.%${filters.search}%,model.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Apply vehicle type filter
      if (filters.vehicleTypes?.length) {
        query = query.in("vehicle_type", filters.vehicleTypes);
      }

      // Apply transmission filter
      if (filters.transmission?.length) {
        query = query.in("transmission", filters.transmission);
      }

      // Apply price range filter
      if (filters.priceRange?.min !== undefined) {
        query = query.gte("price_daily", filters.priceRange.min);
      }
      if (filters.priceRange?.max !== undefined) {
        query = query.lte("price_daily", filters.priceRange.max);
      }

      // Apply unlimited mileage filter
      if (filters.unlimitedMileage !== undefined) {
        query = query.eq("unlimited_mileage", filters.unlimitedMileage);
      }

      // Apply insurance included filter
      if (filters.insuranceIncluded !== undefined) {
        query = query.eq("insurance_included", filters.insuranceIncluded);
      }

      // Apply date availability filter
      if (filters.pickupDateStart) {
        query = query.lte("available_from", filters.pickupDateStart);
      }
      if (filters.pickupDateEnd) {
        query = query.gte("available_to", filters.pickupDateEnd);
      }

      // Apply sorting
      const sortBy = filters.sortBy || "price_daily";
      const sortOrder = filters.sortOrder || "asc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        cars: data as Car[],
        total: count || 0,
        page,
        limit,
      };
    },
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_rentals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Car;
    },
    enabled: !!id,
  });
}

export function useFeaturedCars(limit = 4) {
  return useQuery({
    queryKey: ["cars", "featured", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_rentals")
        .select("*")
        .eq("status", "active")
        .eq("featured", true)
        .order("rating", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Car[];
    },
  });
}

export function useVehicleTypes() {
  return useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_rentals")
        .select("vehicle_type")
        .eq("status", "active");

      if (error) throw error;

      // Get unique vehicle types with counts
      const counts = (data || []).reduce((acc, car) => {
        const type = car.vehicle_type || "other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(counts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);
    },
  });
}
