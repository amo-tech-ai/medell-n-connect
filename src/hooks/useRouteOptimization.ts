import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { TripItem } from '@/types/trip';

interface OptimizationResult {
  optimizedOrder: string[];
  explanation: string;
  savings: {
    distanceKm: number;
    timeMinutes: number;
  };
}

interface UseRouteOptimizationReturn {
  isOptimizing: boolean;
  optimizeRoute: (items: TripItem[], dayDate: string) => Promise<OptimizationResult | null>;
  lastResult: OptimizationResult | null;
}

export function useRouteOptimization(): UseRouteOptimizationReturn {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastResult, setLastResult] = useState<OptimizationResult | null>(null);

  const optimizeRoute = useCallback(async (
    items: TripItem[], 
    dayDate: string
  ): Promise<OptimizationResult | null> => {
    if (items.length < 2) {
      toast.info("Need at least 2 activities to optimize the route");
      return null;
    }

    setIsOptimizing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-optimize-route`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session?.access_token 
              ? `Bearer ${session.access_token}`
              : `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            items: items.map(item => ({
              id: item.id,
              title: item.title,
              latitude: item.latitude,
              longitude: item.longitude,
              item_type: item.item_type,
              start_at: item.start_at,
            })),
            dayDate,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
          return null;
        }
        if (response.status === 402) {
          toast.error("AI credits exhausted. Please add credits to continue.");
          return null;
        }
        throw new Error('Failed to optimize route');
      }

      const result = await response.json() as OptimizationResult;
      setLastResult(result);
      
      return result;
    } catch (error) {
      console.error('Route optimization error:', error);
      toast.error('Failed to optimize route');
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return {
    isOptimizing,
    optimizeRoute,
    lastResult,
  };
}
