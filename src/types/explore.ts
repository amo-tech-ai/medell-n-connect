// Unified explore types for cross-category search

export type ExploreCategory = 'all' | 'restaurants' | 'stays' | 'events' | 'cars';

export interface ExplorePlaceResult {
  id: string;
  type: 'apartment' | 'car' | 'restaurant' | 'event';
  title: string;
  description: string;
  image: string;
  neighborhood: string;
  rating: number | null;
  price: string;
  priceLevel: number;
  tags: string[];
  coordinates: { lat: number; lng: number } | null;
}

export interface ExploreFilters {
  category: ExploreCategory;
  neighborhood: string;
  searchQuery: string;
  priceLevel?: number[];
  minRating?: number;
}

// Category to table type mapping
export const categoryTypeMap: Record<ExploreCategory, ('apartment' | 'car' | 'restaurant' | 'event')[]> = {
  all: ['apartment', 'car', 'restaurant', 'event'],
  stays: ['apartment'],
  cars: ['car'],
  restaurants: ['restaurant'],
  events: ['event'],
};
