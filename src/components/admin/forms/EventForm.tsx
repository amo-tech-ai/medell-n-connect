import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

const eventSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  event_type: z.string().optional(),
  event_start_time: z.string().min(1, "Start time is required"),
  event_end_time: z.string().optional(),
  address: z.string().optional(),
  city: z.string().default("Medellín"),
  ticket_price_min: z.coerce.number().min(0).optional(),
  ticket_price_max: z.coerce.number().min(0).optional(),
  ticket_url: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  tags: z.string().optional(),
  is_active: z.boolean().default(true),
  is_verified: z.boolean().default(false),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  primary_image_url: z.string().url().optional().or(z.literal("")),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: EventRow | null;
  onSubmit: (data: Partial<EventRow>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const eventTypes = [
  "Concert", "Festival", "Party", "Sports", "Theater", "Comedy",
  "Workshop", "Conference", "Exhibition", "Food & Drink", "Nightlife", "Other"
];

export function EventForm({ event, onSubmit, onCancel, isLoading }: EventFormProps) {
  const formatDateTimeLocal = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      event_type: event?.event_type || "",
      event_start_time: formatDateTimeLocal(event?.event_start_time || null),
      event_end_time: formatDateTimeLocal(event?.event_end_time || null),
      address: event?.address || "",
      city: event?.city || "Medellín",
      ticket_price_min: event?.ticket_price_min ? Number(event.ticket_price_min) : undefined,
      ticket_price_max: event?.ticket_price_max ? Number(event.ticket_price_max) : undefined,
      ticket_url: event?.ticket_url || "",
      website: event?.website || "",
      phone: event?.phone || "",
      email: event?.email || "",
      tags: event?.tags?.join(", ") || "",
      is_active: event?.is_active ?? true,
      is_verified: event?.is_verified || false,
      latitude: event?.latitude ? Number(event.latitude) : undefined,
      longitude: event?.longitude ? Number(event.longitude) : undefined,
      primary_image_url: event?.primary_image_url || "",
    },
  });

  const handleSubmit = (values: EventFormValues) => {
    const data: Partial<EventRow> = {
      name: values.name,
      description: values.description || null,
      event_type: values.event_type || null,
      event_start_time: values.event_start_time ? new Date(values.event_start_time).toISOString() : new Date().toISOString(),
      event_end_time: values.event_end_time ? new Date(values.event_end_time).toISOString() : null,
      address: values.address || null,
      city: values.city,
      ticket_price_min: values.ticket_price_min || null,
      ticket_price_max: values.ticket_price_max || null,
      ticket_url: values.ticket_url || null,
      website: values.website || null,
      phone: values.phone || null,
      email: values.email || null,
      tags: values.tags ? values.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
      is_active: values.is_active,
      is_verified: values.is_verified,
      latitude: values.latitude || null,
      longitude: values.longitude || null,
      primary_image_url: values.primary_image_url || null,
    };
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Event Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Feria de las Flores" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the event..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="event_start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date & Time *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tickets & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ticket_price_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="0 for free" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticket_price_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticket_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://tickets.com/event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location & Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location & Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address / Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Parque Norte, Medellín" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="6.2476" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="-75.5658" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+57 300 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="info@event.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://event.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Status & Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status & Media</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Music, Outdoor, Family-friendly (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primary_image_url"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Primary Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/event.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="cursor-pointer">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_verified"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="cursor-pointer">Verified</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {event ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
