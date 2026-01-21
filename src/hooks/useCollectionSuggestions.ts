import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SavedPlaceWithDetails {
  id: string;
  location_id: string;
  location_type: string;
  title?: string;
  cuisine_types?: string[];
  event_type?: string;
  neighborhood?: string;
  tags?: string[];
  price_level?: number;
  rating?: number;
}

export interface CollectionSuggestion {
  name: string;
  description: string;
  emoji: string;
  color: string;
  placeIds: string[];
  confidence: number;
  reasoning: string;
}

interface UseCollectionSuggestionsReturn {
  isLoading: boolean;
  suggestions: CollectionSuggestion[];
  getSuggestions: (savedPlaces: SavedPlaceWithDetails[]) => Promise<void>;
  clearSuggestions: () => void;
}

export function useCollectionSuggestions(): UseCollectionSuggestionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CollectionSuggestion[]>([]);

  const getSuggestions = useCallback(async (savedPlaces: SavedPlaceWithDetails[]) => {
    if (savedPlaces.length < 3) {
      toast.info("Save at least 3 places to get collection suggestions");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        'https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/ai-suggest-collections',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session?.access_token
              ? `Bearer ${session.access_token}`
              : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprd2NieXhpd2tsaWhlZ2podXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTUyNDIsImV4cCI6MjA4MTk5MTI0Mn0.XFif2SYWfDs-MD-HQbGJ2VC0GoCr_n5yd_HBx2MHUUY`,
          },
          body: JSON.stringify({ savedPlaces }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get suggestions');
      }

      const data = await response.json();
      
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
        if (data.suggestions.length > 0) {
          toast.success(`Found ${data.suggestions.length} collection ideas!`);
        } else {
          toast.info("No collection patterns detected yet. Keep saving places!");
        }
      }
    } catch (error) {
      console.error('Collection suggestions error:', error);
      toast.error('Failed to analyze saved places');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    isLoading,
    suggestions,
    getSuggestions,
    clearSuggestions,
  };
}
