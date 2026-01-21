import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TripItem } from '@/types/trip';

interface RouteLeg {
  distanceMeters: number;
  durationSeconds: number;
  startLocation: { latitude: number; longitude: number };
  endLocation: { latitude: number; longitude: number };
  polyline: string;
}

export interface DirectionsResult {
  success: boolean;
  legs: RouteLeg[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  overviewPolyline: string;
  waypointOrder?: number[];
  error?: string;
}

interface UseGoogleDirectionsReturn {
  isLoading: boolean;
  error: string | null;
  result: DirectionsResult | null;
  getDirections: (items: TripItem[], optimizeOrder?: boolean) => Promise<DirectionsResult | null>;
  clearResult: () => void;
}

export function useGoogleDirections(): UseGoogleDirectionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DirectionsResult | null>(null);

  const getDirections = useCallback(async (
    items: TripItem[],
    optimizeOrder = false
  ): Promise<DirectionsResult | null> => {
    // Filter items with valid coordinates
    const validItems = items.filter(
      item => item.latitude !== null && item.longitude !== null
    );

    if (validItems.length < 2) {
      setError('Need at least 2 locations with coordinates');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        'https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/google-directions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session?.access_token
              ? `Bearer ${session.access_token}`
              : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprd2NieXhpd2tsaWhlZ2podXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTUyNDIsImV4cCI6MjA4MTk5MTI0Mn0.XFif2SYWfDs-MD-HQbGJ2VC0GoCr_n5yd_HBx2MHUUY`,
          },
          body: JSON.stringify({
            waypoints: validItems.map(item => ({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              title: item.title,
            })),
            optimizeOrder,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get directions');
      }

      const data: DirectionsResult = await response.json();
      setResult(data);
      return data;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get directions';
      setError(message);
      console.error('Directions error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    getDirections,
    clearResult,
  };
}
