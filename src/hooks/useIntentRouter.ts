import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatTab } from '@/types/chat';

export type IntentCategory = 
  | 'housing_search' | 'housing_details'
  | 'car_rental' | 'car_booking'
  | 'restaurant_discovery' | 'restaurant_booking'
  | 'event_discovery' | 'event_tickets'
  | 'trip_planning' | 'trip_modification' | 'trip_question'
  | 'booking_status' | 'booking_modification' | 'booking_help'
  | 'local_knowledge' | 'safety_tips' | 'cultural_info'
  | 'general_greeting' | 'general_question';

export interface RouterResult {
  intent: IntentCategory;
  targetAgent: ChatTab;
  confidence: number;
  entities: Record<string, unknown>;
  suggestedResponse?: string;
  requiresAuth?: boolean;
  reasoning?: string;
}

interface UseIntentRouterOptions {
  currentTab?: ChatTab;
  conversationHistory?: Array<{ role: string; content: string }>;
  userContext?: {
    hasActiveTrip?: boolean;
    hasPendingBookings?: boolean;
    currentPage?: string;
  };
}

export function useIntentRouter() {
  const [isRouting, setIsRouting] = useState(false);
  const [lastResult, setLastResult] = useState<RouterResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const routeMessage = useCallback(async (
    message: string,
    options: UseIntentRouterOptions = {}
  ): Promise<RouterResult | null> => {
    setIsRouting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-router`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session?.access_token 
              ? `Bearer ${session.access_token}` 
              : '',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            message,
            currentTab: options.currentTab,
            conversationHistory: options.conversationHistory,
            userContext: options.userContext,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Router error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const routerResult: RouterResult = {
          ...result.data,
          targetAgent: result.data.targetAgent as ChatTab,
        };
        setLastResult(routerResult);
        return routerResult;
      }

      throw new Error(result.error || 'Unknown router error');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to route message';
      setError(errorMessage);
      console.error('Intent router error:', err);
      
      // Return fallback result
      const fallback: RouterResult = {
        intent: 'general_question',
        targetAgent: options.currentTab || 'concierge',
        confidence: 0.5,
        entities: {},
        reasoning: 'Fallback due to routing error',
      };
      setLastResult(fallback);
      return fallback;
    } finally {
      setIsRouting(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  return {
    routeMessage,
    isRouting,
    lastResult,
    error,
    clearResult,
  };
}
