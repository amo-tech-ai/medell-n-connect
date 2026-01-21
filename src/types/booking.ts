export type BookingType = "apartment" | "car" | "restaurant" | "event" | "tour";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface Booking {
  id: string;
  user_id: string;
  booking_type: BookingType;
  resource_id: string;
  resource_title: string;
  status: BookingStatus;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  party_size: number | null;
  quantity: number | null;
  unit_price: number | null;
  total_price: number | null;
  currency: string | null;
  payment_status: PaymentStatus | null;
  payment_method: string | null;
  payment_reference: string | null;
  confirmation_code: string | null;
  special_requests: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  trip_id: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFilters {
  status?: BookingStatus[];
  booking_type?: BookingType[];
  search?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  tab?: "upcoming" | "past" | "cancelled";
}

export interface CreateBookingInput {
  booking_type: BookingType;
  resource_id: string;
  resource_title: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  party_size?: number;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  currency?: string;
  special_requests?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  trip_id?: string;
}

// Generate a confirmation code
export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
