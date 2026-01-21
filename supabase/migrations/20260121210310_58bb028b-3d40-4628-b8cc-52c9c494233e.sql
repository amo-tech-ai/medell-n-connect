-- Add trip_id column to saved_places to scope saves to specific trips
ALTER TABLE public.saved_places 
ADD COLUMN trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL;

-- Create index for efficient trip-scoped queries
CREATE INDEX idx_saved_places_trip_id ON public.saved_places(trip_id);

-- Add composite index for user + trip queries
CREATE INDEX idx_saved_places_user_trip ON public.saved_places(user_id, trip_id);

-- Comment explaining the column
COMMENT ON COLUMN public.saved_places.trip_id IS 'Optional trip context - when set, the saved place is scoped to this trip. NULL means global favorites.';