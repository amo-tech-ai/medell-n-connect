import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Booking, BookingFilters, CreateBookingInput, BookingStatus } from "@/types/booking";
import type { Json } from "@/integrations/supabase/types";

export function useBookings(filters: BookingFilters = {}) {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["bookings", user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return { bookings: [], total: 0 };

      let query = supabase
        .from("bookings")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      // Apply status filter
      if (filters.status?.length) {
        query = query.in("status", filters.status);
      }

      // Apply type filter
      if (filters.booking_type?.length) {
        query = query.in("booking_type", filters.booking_type);
      }

      // Apply tab filter
      if (filters.tab === "upcoming") {
        query = query.gte("start_date", today).neq("status", "cancelled");
      } else if (filters.tab === "past") {
        query = query.lt("start_date", today).neq("status", "cancelled");
      } else if (filters.tab === "cancelled") {
        query = query.eq("status", "cancelled");
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(
          `resource_title.ilike.%${filters.search}%,confirmation_code.ilike.%${filters.search}%`
        );
      }

      // Apply date range filter
      if (filters.dateRange?.start) {
        query = query.gte("start_date", filters.dateRange.start);
      }
      if (filters.dateRange?.end) {
        query = query.lte("start_date", filters.dateRange.end);
      }

      // Order by start date
      query = query.order("start_date", { ascending: true });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        bookings: data as Booking[],
        total: count || 0,
      };
    },
    enabled: !!user?.id,
  });
}

export function useBooking(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Booking | null;
    },
    enabled: !!id && !!user?.id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!user?.id) throw new Error("Must be logged in to create a booking");

      // Generate confirmation code
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let confirmationCode = "";
      for (let i = 0; i < 8; i++) {
        confirmationCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          booking_type: input.booking_type,
          resource_id: input.resource_id,
          resource_title: input.resource_title,
          start_date: input.start_date,
          end_date: input.end_date || null,
          start_time: input.start_time || null,
          end_time: input.end_time || null,
          party_size: input.party_size || 1,
          quantity: input.quantity || 1,
          unit_price: input.unit_price || null,
          total_price: input.total_price || null,
          currency: input.currency || "USD",
          special_requests: input.special_requests || null,
          notes: input.notes || null,
          metadata: (input.metadata as Json) || null,
          trip_id: input.trip_id || null,
          status: "confirmed" as BookingStatus,
          payment_status: "pending",
          confirmation_code: confirmationCode,
          confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Booking> & { id: string }) => {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      // Only include defined fields
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
      if (updates.end_date !== undefined) updateData.end_date = updates.end_date;
      if (updates.start_time !== undefined) updateData.start_time = updates.start_time;
      if (updates.end_time !== undefined) updateData.end_time = updates.end_time;
      if (updates.party_size !== undefined) updateData.party_size = updates.party_size;
      if (updates.special_requests !== undefined) updateData.special_requests = updates.special_requests;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata as Json;

      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", data.id] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled" as BookingStatus,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpcomingBookings(limit = 5) {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["bookings", "upcoming", user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_date", today)
        .neq("status", "cancelled")
        .order("start_date", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user?.id,
  });
}
