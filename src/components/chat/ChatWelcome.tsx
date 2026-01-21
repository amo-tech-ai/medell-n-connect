import { Sparkles, Plane, Compass, CalendarCheck } from 'lucide-react';
import { ChatTab } from '@/types/chat';

interface ChatWelcomeProps {
  activeTab: ChatTab;
  onSuggestionClick: (suggestion: string) => void;
}

const tabContent: Record<ChatTab, {
  icon: typeof Sparkles;
  title: string;
  description: string;
  suggestions: string[];
}> = {
  concierge: {
    icon: Sparkles,
    title: 'Where to today?',
    description: 'Ask me anything about Medellín - neighborhoods, culture, safety, or lifestyle tips.',
    suggestions: [
      "What's a good neighborhood for digital nomads?",
      "How much should I budget for a month?",
      "Best day trips from Medellín",
      "Help me understand Colombian culture",
    ],
  },
  trips: {
    icon: Plane,
    title: 'Plan Your Trip',
    description: 'Let me help you create the perfect itinerary for your Medellín adventure.',
    suggestions: [
      "Plan a 5-day Medellín itinerary",
      "What should I do on my first day?",
      "Best weekend trip from the city",
      "Create a coffee region tour",
    ],
  },
  explore: {
    icon: Compass,
    title: 'Discover Medellín',
    description: 'Find the best restaurants, events, activities, and hidden gems around you.',
    suggestions: [
      "Find me a rooftop bar with views",
      "What events are happening this weekend?",
      "Best coworking cafes in Laureles",
      "Romantic dinner spots in El Poblado",
    ],
  },
  bookings: {
    icon: CalendarCheck,
    title: 'Manage Reservations',
    description: 'Book restaurants, apartments, cars, and events through natural conversation.',
    suggestions: [
      "Book a table for dinner tonight",
      "Show me my upcoming reservations",
      "Find available apartments next month",
      "Cancel my car rental",
    ],
  },
};

export function ChatWelcome({ activeTab, onSuggestionClick }: ChatWelcomeProps) {
  const content = tabContent[activeTab];
  const Icon = content.icon;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-display font-bold text-foreground text-center">
        {content.title}
      </h2>
      <p className="text-muted-foreground text-center mt-3 max-w-md">
        {content.description}
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {content.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-3 bg-card border border-border rounded-xl text-sm text-left hover:border-primary hover:text-primary transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
