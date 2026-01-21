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

type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];

const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().default("Medellín"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  price_level: z.coerce.number().min(1).max(4).default(2),
  cuisine_types: z.string().min(1, "At least one cuisine type is required"),
  dietary_options: z.string().optional(),
  ambiance: z.string().optional(),
  tags: z.string().optional(),
  is_active: z.boolean().default(true),
  is_verified: z.boolean().default(false),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  primary_image_url: z.string().url().optional().or(z.literal("")),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

interface RestaurantFormProps {
  restaurant?: RestaurantRow | null;
  onSubmit: (data: Partial<RestaurantRow>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const cuisineOptions = [
  "Colombian", "Italian", "Mexican", "Japanese", "Chinese", "Thai",
  "French", "American", "Mediterranean", "Peruvian", "Seafood", "Steakhouse",
  "Vegetarian", "Vegan", "Fusion", "Cafe", "Bakery", "Fast Food"
];

export function RestaurantForm({ restaurant, onSubmit, onCancel, isLoading }: RestaurantFormProps) {
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      address: restaurant?.address || "",
      city: restaurant?.city || "Medellín",
      phone: restaurant?.phone || "",
      email: restaurant?.email || "",
      website: restaurant?.website || "",
      price_level: restaurant?.price_level || 2,
      cuisine_types: restaurant?.cuisine_types?.join(", ") || "",
      dietary_options: restaurant?.dietary_options?.join(", ") || "",
      ambiance: restaurant?.ambiance?.join(", ") || "",
      tags: restaurant?.tags?.join(", ") || "",
      is_active: restaurant?.is_active ?? true,
      is_verified: restaurant?.is_verified || false,
      latitude: restaurant?.latitude ? Number(restaurant.latitude) : undefined,
      longitude: restaurant?.longitude ? Number(restaurant.longitude) : undefined,
      primary_image_url: restaurant?.primary_image_url || "",
    },
  });

  const handleSubmit = (values: RestaurantFormValues) => {
    const data: Partial<RestaurantRow> = {
      name: values.name,
      description: values.description || null,
      address: values.address || null,
      city: values.city,
      phone: values.phone || null,
      email: values.email || null,
      website: values.website || null,
      price_level: values.price_level,
      cuisine_types: values.cuisine_types.split(",").map(s => s.trim()).filter(Boolean),
      dietary_options: values.dietary_options ? values.dietary_options.split(",").map(s => s.trim()).filter(Boolean) : [],
      ambiance: values.ambiance ? values.ambiance.split(",").map(s => s.trim()).filter(Boolean) : [],
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
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Restaurant Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="El Cielo" {...field} />
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
                    <Textarea placeholder="Describe the restaurant..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
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
                    <Input type="email" placeholder="info@restaurant.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://restaurant.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Cuisine & Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cuisine & Type</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cuisine_types"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Cuisine Types *</FormLabel>
                  <FormControl>
                    <Input placeholder="Colombian, Fusion, Seafood (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Options: {cuisineOptions.slice(0, 6).join(", ")}...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">$ - Budget</SelectItem>
                      <SelectItem value="2">$$ - Moderate</SelectItem>
                      <SelectItem value="3">$$$ - Upscale</SelectItem>
                      <SelectItem value="4">$$$$ - Fine Dining</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietary_options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Options</FormLabel>
                  <FormControl>
                    <Input placeholder="Vegetarian, Vegan, Gluten-free" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ambiance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambiance</FormLabel>
                  <FormControl>
                    <Input placeholder="Romantic, Casual, Trendy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Rooftop, Date Night, Family" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
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
          </CardContent>
        </Card>

        {/* Status & Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status & Media</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="primary_image_url"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Primary Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/restaurant.jpg" {...field} />
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
            {restaurant ? "Update Restaurant" : "Create Restaurant"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
