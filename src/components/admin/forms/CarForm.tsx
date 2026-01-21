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

type CarRentalRow = Database["public"]["Tables"]["car_rentals"]["Row"];

const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1990).max(2030).optional(),
  vehicle_type: z.string().default("sedan"),
  transmission: z.string().default("automatic"),
  fuel_type: z.string().default("gasoline"),
  color: z.string().optional(),
  seats: z.coerce.number().min(1).max(20).default(5),
  doors: z.coerce.number().min(1).max(6).default(4),
  description: z.string().optional(),
  price_daily: z.coerce.number().min(0),
  price_weekly: z.coerce.number().min(0).optional(),
  price_monthly: z.coerce.number().min(0).optional(),
  deposit_amount: z.coerce.number().min(0).optional(),
  minimum_rental_days: z.coerce.number().min(1).default(1),
  mileage_limit_daily: z.coerce.number().min(0).optional(),
  unlimited_mileage: z.boolean().default(false),
  insurance_included: z.boolean().default(false),
  delivery_available: z.boolean().default(false),
  has_ac: z.boolean().default(true),
  has_gps: z.boolean().default(false),
  has_bluetooth: z.boolean().default(true),
  status: z.enum(["active", "inactive", "maintenance"]).default("active"),
  featured: z.boolean().default(false),
  rental_company: z.string().optional(),
  features: z.string().optional(),
  images: z.string().optional(),
});

type CarFormValues = z.infer<typeof carSchema>;

interface CarFormProps {
  car?: CarRentalRow | null;
  onSubmit: (data: Partial<CarRentalRow>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const vehicleTypes = ["sedan", "suv", "hatchback", "pickup", "van", "luxury", "sports", "convertible"];
const transmissionTypes = ["automatic", "manual"];
const fuelTypes = ["gasoline", "diesel", "hybrid", "electric"];

export function CarForm({ car, onSubmit, onCancel, isLoading }: CarFormProps) {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      make: car?.make || "",
      model: car?.model || "",
      year: car?.year || new Date().getFullYear(),
      vehicle_type: car?.vehicle_type || "sedan",
      transmission: car?.transmission || "automatic",
      fuel_type: car?.fuel_type || "gasoline",
      color: car?.color || "",
      seats: car?.seats || 5,
      doors: car?.doors || 4,
      description: car?.description || "",
      price_daily: car?.price_daily ? Number(car.price_daily) : 0,
      price_weekly: car?.price_weekly ? Number(car.price_weekly) : undefined,
      price_monthly: car?.price_monthly ? Number(car.price_monthly) : undefined,
      deposit_amount: car?.deposit_amount ? Number(car.deposit_amount) : undefined,
      minimum_rental_days: car?.minimum_rental_days || 1,
      mileage_limit_daily: car?.mileage_limit_daily || undefined,
      unlimited_mileage: car?.unlimited_mileage || false,
      insurance_included: car?.insurance_included || false,
      delivery_available: car?.delivery_available || false,
      has_ac: car?.has_ac ?? true,
      has_gps: car?.has_gps || false,
      has_bluetooth: car?.has_bluetooth ?? true,
      status: (car?.status as "active" | "inactive" | "maintenance") || "active",
      featured: car?.featured || false,
      rental_company: car?.rental_company || "",
      features: car?.features?.join(", ") || "",
      images: car?.images?.join("\n") || "",
    },
  });

  const handleSubmit = (values: CarFormValues) => {
    const data: Partial<CarRentalRow> = {
      ...values,
      features: values.features ? values.features.split(",").map(s => s.trim()).filter(Boolean) : [],
      images: values.images ? values.images.split("\n").map(s => s.trim()).filter(Boolean) : [],
    };
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make *</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model *</FormLabel>
                  <FormControl>
                    <Input placeholder="Corolla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input type="number" min={1990} max={2030} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="White" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transmissionTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuel_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rental_company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rental Company</FormLabel>
                  <FormControl>
                    <Input placeholder="AutoRent Medellín" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seats</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={20} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doors</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the vehicle..." rows={3} {...field} />
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
            <CardTitle className="text-lg">Pricing & Terms</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="price_daily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Rate ($) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
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
                  <FormLabel>Weekly Rate ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rate ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
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
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimum_rental_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Rental Days</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage_limit_daily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Mileage Limit</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="km/day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unlimited_mileage"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="cursor-pointer">Unlimited Mileage</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insurance_included"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="cursor-pointer">Insurance Incl.</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="has_ac"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">Air Conditioning</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_gps"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">GPS Navigation</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_bluetooth"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">Bluetooth</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery_available"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="cursor-pointer">Delivery Available</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Features</FormLabel>
                  <FormControl>
                    <Input placeholder="Backup camera, USB ports, Sunroof (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of additional features</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Status & Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status & Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        <SelectItem value="maintenance">Maintenance</SelectItem>
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
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs</FormLabel>
                  <FormControl>
                    <Textarea placeholder="https://example.com/car1.jpg&#10;https://example.com/car2.jpg" rows={4} {...field} />
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
            {car ? "Update Vehicle" : "Create Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
