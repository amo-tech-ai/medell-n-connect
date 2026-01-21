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

type ApartmentRow = Database["public"]["Tables"]["apartments"]["Row"];

const apartmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().default("Medellín"),
  bedrooms: z.coerce.number().min(0).max(20).default(1),
  bathrooms: z.coerce.number().min(0).max(10).default(1),
  size_sqm: z.coerce.number().min(0).optional(),
  price_monthly: z.coerce.number().min(0).optional(),
  price_weekly: z.coerce.number().min(0).optional(),
  price_daily: z.coerce.number().min(0).optional(),
  deposit_amount: z.coerce.number().min(0).optional(),
  minimum_stay_days: z.coerce.number().min(1).default(30),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),
  furnished: z.boolean().default(true),
  pet_friendly: z.boolean().default(false),
  parking_included: z.boolean().default(false),
  utilities_included: z.boolean().default(false),
  wifi_speed: z.coerce.number().min(0).optional(),
  amenities: z.string().optional(),
  building_amenities: z.string().optional(),
  images: z.string().optional(),
});

type ApartmentFormValues = z.infer<typeof apartmentSchema>;

interface ApartmentFormProps {
  apartment?: ApartmentRow | null;
  onSubmit: (data: Partial<ApartmentRow>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const neighborhoods = [
  "El Poblado", "Laureles", "Envigado", "Sabaneta", "Belén",
  "La Floresta", "Manila", "Conquistadores", "Estadio", "Centro"
];

export function ApartmentForm({ apartment, onSubmit, onCancel, isLoading }: ApartmentFormProps) {
  const form = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: {
      title: apartment?.title || "",
      neighborhood: apartment?.neighborhood || "",
      description: apartment?.description || "",
      address: apartment?.address || "",
      city: apartment?.city || "Medellín",
      bedrooms: apartment?.bedrooms || 1,
      bathrooms: apartment?.bathrooms || 1,
      size_sqm: apartment?.size_sqm || undefined,
      price_monthly: apartment?.price_monthly ? Number(apartment.price_monthly) : undefined,
      price_weekly: apartment?.price_weekly ? Number(apartment.price_weekly) : undefined,
      price_daily: apartment?.price_daily ? Number(apartment.price_daily) : undefined,
      deposit_amount: apartment?.deposit_amount ? Number(apartment.deposit_amount) : undefined,
      minimum_stay_days: apartment?.minimum_stay_days || 30,
      status: (apartment?.status as "active" | "inactive" | "pending") || "active",
      featured: apartment?.featured || false,
      verified: apartment?.verified || false,
      furnished: apartment?.furnished ?? true,
      pet_friendly: apartment?.pet_friendly || false,
      parking_included: apartment?.parking_included || false,
      utilities_included: apartment?.utilities_included || false,
      wifi_speed: apartment?.wifi_speed || undefined,
      amenities: apartment?.amenities?.join(", ") || "",
      building_amenities: apartment?.building_amenities?.join(", ") || "",
      images: apartment?.images?.join("\n") || "",
    },
  });

  const handleSubmit = (values: ApartmentFormValues) => {
    const data: Partial<ApartmentRow> = {
      ...values,
      amenities: values.amenities ? values.amenities.split(",").map(s => s.trim()).filter(Boolean) : [],
      building_amenities: values.building_amenities ? values.building_amenities.split(",").map(s => s.trim()).filter(Boolean) : [],
      images: values.images ? values.images.split("\n").map(s => s.trim()).filter(Boolean) : [],
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
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Modern apartment in El Poblado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Neighborhood *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select neighborhood" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {neighborhoods.map(n => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
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
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the apartment..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={0.5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size_sqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wifi_speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WiFi (Mbps)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="price_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_weekly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weekly ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_daily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="80" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deposit_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimum_stay_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Stay (days)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features & Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="furnished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">Furnished</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pet_friendly"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">Pet Friendly</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parking_included"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">Parking</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="utilities_included"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">Utilities Incl.</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Input placeholder="WiFi, AC, Kitchen, Washer (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of apartment amenities</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="building_amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Amenities</FormLabel>
                  <FormControl>
                    <Input placeholder="Pool, Gym, Rooftop (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of building amenities</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Status & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status & Visibility</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="cursor-pointer">Featured</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verified"
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

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs</FormLabel>
                  <FormControl>
                    <Textarea placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" rows={4} {...field} />
                  </FormControl>
                  <FormDescription>One URL per line</FormDescription>
                  <FormMessage />
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
            {apartment ? "Update Apartment" : "Create Apartment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
