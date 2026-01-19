import type { Json } from "@/integrations/supabase/types";

// Restaurant types - aligned with Supabase schema
export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  cuisine_types: string[];
  price_level: number; // 1-4
  address: string | null;
  city: string | null;
  country: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  hours_of_operation: Json;
  dietary_options: string[] | null;
  ambiance: string[] | null;
  images: Json | null;
  primary_image_url: string | null;
  rating: number | null;
  rating_count: number | null;
  is_open_now: boolean | null;
  is_active: boolean;
  is_verified: boolean;
  tags: string[] | null;
  subcategory: string | null;
  source: string;
  external_id: string | null;
  google_place_id: string | null;
  yelp_id: string | null;
  details: Json | null;
  data_freshness: string | null;
  cache_expires_at: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

export interface RestaurantFilters {
  search?: string;
  cuisines?: string[];
  priceLevel?: number[];
  neighborhoods?: string[];
  dietaryOptions?: string[];
  ambiance?: string[];
  openNow?: boolean;
  sortBy?: "rating" | "price_level" | "created_at";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
