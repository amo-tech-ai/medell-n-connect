// Types for saved places and collections
export interface SavedPlace {
  id: string;
  user_id: string;
  location_id: string;
  location_type: 'apartment' | 'car' | 'restaurant' | 'event';
  collection_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  is_favorite?: boolean | null;
  priority?: number | null;
  saved_at: string;
  last_viewed_at?: string | null;
  view_count?: number | null;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
  color?: string | null;
  cover_image_url?: string | null;
  is_public?: boolean | null;
  item_count?: number | null;
  share_token?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Enriched saved place with resource details
export interface EnrichedSavedPlace extends SavedPlace {
  resource?: {
    title: string;
    image: string;
    rating?: number;
    price?: string;
    location?: string;
    type: 'apartment' | 'car' | 'restaurant' | 'event';
  };
}

export type LocationType = 'apartment' | 'car' | 'restaurant' | 'event' | 'all';
