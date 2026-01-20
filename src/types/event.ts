import type { Database } from "@/integrations/supabase/types";

export type Event = Database["public"]["Tables"]["events"]["Row"];

export interface EventFilters {
  eventType?: string;
  dateFrom?: string;
  dateTo?: string;
  isFree?: boolean;
  city?: string;
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
