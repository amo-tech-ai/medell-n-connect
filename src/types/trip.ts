export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string | null;
  description: string | null;
  start_date: string;
  end_date: string;
  status: TripStatus;
  budget: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type TripStatus = "draft" | "active" | "completed" | "cancelled";

export interface TripItem {
  id: string;
  trip_id: string;
  item_type: TripItemType;
  source_id: string;
  title: string;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  location_name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export type TripItemType = 
  | "apartment" 
  | "car" 
  | "restaurant" 
  | "event" 
  | "activity" 
  | "transport" 
  | "note";

export interface TripFilters {
  status?: TripStatus[];
  search?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface TripWithItems extends Trip {
  items: TripItem[];
}

export interface CreateTripInput {
  title: string;
  destination?: string;
  description?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  currency?: string;
}

export interface AddToTripInput {
  trip_id: string;
  item_type: TripItemType;
  source_id: string;
  title: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  location_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  metadata?: Record<string, unknown>;
}
