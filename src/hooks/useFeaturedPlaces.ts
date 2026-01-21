import { useFeaturedApartments } from "./useApartments";
import { useFeaturedRestaurants } from "./useRestaurants";
import { useFeaturedEvents } from "./useEvents";
import { useFeaturedCars } from "./useCars";
import type { Place } from "@/lib/mockData";

// Map database records to the Place interface for unified display
export function useFeaturedPlaces(limit = 4) {
  const apartments = useFeaturedApartments(limit);
  const restaurants = useFeaturedRestaurants(limit);
  const events = useFeaturedEvents(limit);
  const cars = useFeaturedCars(limit);

  const isLoading = apartments.isLoading || restaurants.isLoading || events.isLoading || cars.isLoading;
  const isError = apartments.isError || restaurants.isError || events.isError || cars.isError;

  // Transform data to Place interface
  const places: Place[] = [];

  // Add apartments
  apartments.data?.slice(0, 1).forEach((apt) => {
    places.push({
      id: apt.id,
      type: "apartments",
      name: apt.title,
      neighborhood: apt.neighborhood,
      description: apt.description || "",
      image: apt.images?.[0] || "/placeholder.svg",
      rating: apt.rating || 0,
      price: apt.price_monthly ? `$${apt.price_monthly}/mo` : apt.price_daily ? `$${apt.price_daily}/night` : "Contact",
      priceLevel: apt.price_monthly && apt.price_monthly > 2000 ? 3 : apt.price_monthly && apt.price_monthly > 1000 ? 2 : 1,
      distance: "—",
      tags: apt.amenities?.slice(0, 3) || [],
      coordinates: { lat: Number(apt.latitude) || 6.2088, lng: Number(apt.longitude) || -75.5742 },
    });
  });

  // Add restaurants
  restaurants.data?.slice(0, 1).forEach((rest) => {
    places.push({
      id: rest.id,
      type: "restaurants",
      name: rest.name,
      neighborhood: rest.city || "Medellín",
      description: rest.description || "",
      image: rest.primary_image_url || "/placeholder.svg",
      rating: rest.rating || 0,
      price: "$".repeat(rest.price_level || 2),
      priceLevel: rest.price_level || 2,
      distance: "—",
      tags: rest.cuisine_types?.slice(0, 3) || [],
      coordinates: { lat: Number(rest.latitude) || 6.2088, lng: Number(rest.longitude) || -75.5742 },
    });
  });

  // Add events
  events.data?.slice(0, 1).forEach((evt) => {
    places.push({
      id: evt.id,
      type: "events",
      name: evt.name,
      neighborhood: evt.city || "Medellín",
      description: evt.description || "",
      image: evt.primary_image_url || "/placeholder.svg",
      rating: evt.rating || 0,
      price: evt.ticket_price_min ? `$${evt.ticket_price_min}` : "Free",
      priceLevel: evt.ticket_price_min && evt.ticket_price_min > 50 ? 2 : 1,
      distance: "—",
      tags: evt.tags?.slice(0, 3) || [],
      coordinates: { lat: Number(evt.latitude) || 6.2088, lng: Number(evt.longitude) || -75.5742 },
    });
  });

  // Add cars
  cars.data?.slice(0, 1).forEach((car) => {
    places.push({
      id: car.id,
      type: "cars",
      name: `${car.make} ${car.model}`,
      neighborhood: "Medellín",
      description: car.description || "",
      image: car.images?.[0] || "/placeholder.svg",
      rating: car.rating || 0,
      price: `$${car.price_daily}/day`,
      priceLevel: car.price_daily > 200 ? 4 : car.price_daily > 100 ? 3 : 2,
      distance: "—",
      tags: car.features?.slice(0, 3) || [],
      coordinates: { lat: 6.2088, lng: -75.5742 },
    });
  });

  return {
    data: places,
    isLoading,
    isError,
  };
}
