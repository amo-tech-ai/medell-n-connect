import type { Database } from "@/integrations/supabase/types";

export type Event = Database["public"]["Tables"]["events"]["Row"];

export interface EventFilters {
  eventType?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  isFree?: boolean;
  city?: string;
  neighborhood?: string;
  priceRange?: string;
  search?: string;
}

export const EVENT_TYPES = [
  { value: "concert", label: "Concerts" },
  { value: "festival", label: "Festivals" },
  { value: "sports", label: "Sports" },
  { value: "tech", label: "Tech & Networking" },
  { value: "social", label: "Social & Meetups" },
  { value: "culture", label: "Culture & Arts" },
  { value: "food", label: "Food & Drink" },
  { value: "nightlife", label: "Nightlife" },
] as const;

export type EventType = typeof EVENT_TYPES[number]["value"];
