import apartment1 from "@/assets/apartment-1.jpg";
import restaurant1 from "@/assets/restaurant-1.jpg";
import event1 from "@/assets/event-1.jpg";
import car1 from "@/assets/car-1.jpg";

export type PlaceCategory = "apartments" | "restaurants" | "events" | "cars";

export interface Place {
  id: string;
  type: PlaceCategory;
  name: string;
  neighborhood: string;
  description: string;
  image: string;
  rating: number;
  price: string;
  priceLevel: number;
  distance: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
  saved?: boolean;
}

export const neighborhoods = [
  "El Poblado",
  "Laureles",
  "Envigado",
  "Belén",
  "La Candelaria",
  "Sabaneta",
];

export const categories: { id: PlaceCategory; label: string; icon: string }[] = [
  { id: "apartments", label: "Stays", icon: "🏠" },
  { id: "restaurants", label: "Food", icon: "🍽️" },
  { id: "events", label: "Events", icon: "🎉" },
  { id: "cars", label: "Cars", icon: "🚗" },
];

export const mockPlaces: Place[] = [
  {
    id: "apt-1",
    type: "apartments",
    name: "Luxe Penthouse El Poblado",
    neighborhood: "El Poblado",
    description: "Stunning penthouse with panoramic city views, private terrace, and modern amenities.",
    image: apartment1,
    rating: 4.9,
    price: "$150/night",
    priceLevel: 3,
    distance: "0.3 mi",
    tags: ["WiFi", "Pool", "Gym", "Terrace"],
    coordinates: { lat: 6.2088, lng: -75.5742 },
  },
  {
    id: "apt-2",
    type: "apartments",
    name: "Modern Studio Laureles",
    neighborhood: "Laureles",
    description: "Cozy studio perfect for digital nomads, fast WiFi, walking distance to cafes.",
    image: apartment1,
    rating: 4.7,
    price: "$65/night",
    priceLevel: 2,
    distance: "1.2 mi",
    tags: ["WiFi", "Kitchen", "Workspace"],
    coordinates: { lat: 6.2450, lng: -75.5950 },
  },
  {
    id: "rest-1",
    type: "restaurants",
    name: "El Cielo",
    neighborhood: "El Poblado",
    description: "Michelin-recognized molecular gastronomy experience celebrating Colombian flavors.",
    image: restaurant1,
    rating: 4.9,
    price: "$$$$",
    priceLevel: 4,
    distance: "0.2 mi",
    tags: ["Fine Dining", "Tasting Menu", "Reservations Required"],
    coordinates: { lat: 6.2100, lng: -75.5700 },
  },
  {
    id: "rest-2",
    type: "restaurants",
    name: "Carmen",
    neighborhood: "El Poblado",
    description: "Contemporary Colombian cuisine in an elegant setting. Perfect for date nights.",
    image: restaurant1,
    rating: 4.8,
    price: "$$$",
    priceLevel: 3,
    distance: "0.4 mi",
    tags: ["Colombian", "Romantic", "Patio"],
    coordinates: { lat: 6.2080, lng: -75.5680 },
  },
  {
    id: "event-1",
    type: "events",
    name: "Feria de las Flores",
    neighborhood: "La Candelaria",
    description: "Annual flower festival celebrating Medellín's culture with parades and silleteros.",
    image: event1,
    rating: 4.8,
    price: "Free",
    priceLevel: 0,
    distance: "2.1 mi",
    tags: ["Festival", "Cultural", "Family-Friendly"],
    coordinates: { lat: 6.2518, lng: -75.5636 },
  },
  {
    id: "event-2",
    type: "events",
    name: "Rooftop Salsa Night",
    neighborhood: "El Poblado",
    description: "Weekly salsa dancing with live band overlooking the city lights.",
    image: event1,
    rating: 4.6,
    price: "$20",
    priceLevel: 1,
    distance: "0.5 mi",
    tags: ["Nightlife", "Dancing", "Live Music"],
    coordinates: { lat: 6.2095, lng: -75.5725 },
  },
  {
    id: "car-1",
    type: "cars",
    name: "Ferrari 488 Spider",
    neighborhood: "El Poblado",
    description: "Experience the mountain roads in style with this stunning convertible.",
    image: car1,
    rating: 5.0,
    price: "$450/day",
    priceLevel: 4,
    distance: "0.8 mi",
    tags: ["Luxury", "Convertible", "Insurance Included"],
    coordinates: { lat: 6.2070, lng: -75.5690 },
  },
  {
    id: "car-2",
    type: "cars",
    name: "Toyota 4Runner",
    neighborhood: "Envigado",
    description: "Perfect for exploring Guatapé, coffee region, and mountain adventures.",
    image: car1,
    rating: 4.7,
    price: "$85/day",
    priceLevel: 2,
    distance: "1.5 mi",
    tags: ["SUV", "4x4", "GPS"],
    coordinates: { lat: 6.1719, lng: -75.5863 },
  },
];

export const getPlacesByCategory = (category: PlaceCategory) =>
  mockPlaces.filter((place) => place.type === category);

export const getPlaceById = (id: string) =>
  mockPlaces.find((place) => place.id === id);
