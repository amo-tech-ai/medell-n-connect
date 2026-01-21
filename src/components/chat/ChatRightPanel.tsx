import { MapPin, Calendar, Bookmark, Lightbulb, Clock, DollarSign } from 'lucide-react';
import { ChatTab } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatRightPanelProps {
  activeTab: ChatTab;
}

export function ChatRightPanel({ activeTab }: ChatRightPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {activeTab === 'concierge' && <ConciergePanel />}
        {activeTab === 'trips' && <TripsPanel />}
        {activeTab === 'explore' && <ExplorePanel />}
        {activeTab === 'bookings' && <BookingsPanel />}
      </div>
    </ScrollArea>
  );
}

function ConciergePanel() {
  const suggestions = [
    { title: 'Safety Tips', icon: Lightbulb },
    { title: 'Budget Guide', icon: DollarSign },
    { title: 'Best Neighborhoods', icon: MapPin },
    { title: 'Local Events', icon: Calendar },
  ];

  return (
    <>
      <div>
        <h3 className="font-semibold text-sm mb-3">Quick Topics</h3>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((item) => (
            <button
              key={item.title}
              className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Popular Questions</h3>
        <div className="space-y-2">
          {[
            'Is Medellín safe for solo travelers?',
            'Best time of year to visit?',
            'How to get around the city?',
          ].map((q) => (
            <button
              key={q}
              className="w-full text-left text-sm p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function TripsPanel() {
  return (
    <>
      <div>
        <h3 className="font-semibold text-sm mb-3">Active Trip</h3>
        <div className="p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">No active trip</p>
          <Button variant="link" size="sm" className="mt-2">
            Create a trip
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Trip Ideas</h3>
        <div className="space-y-2">
          {[
            { title: '5-Day City Explorer', duration: '5 days' },
            { title: 'Coffee Region Adventure', duration: '3 days' },
            { title: 'Weekend in Guatapé', duration: '2 days' },
          ].map((trip) => (
            <div
              key={trip.title}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium">{trip.title}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="w-3 h-3" />
                {trip.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ExplorePanel() {
  return (
    <>
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {['Restaurants', 'Bars', 'Coffee', 'Activities', 'Events'].map((cat) => (
            <Badge key={cat} variant="secondary" className="cursor-pointer">
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Neighborhoods</h3>
        <div className="space-y-2">
          {['El Poblado', 'Laureles', 'Envigado', 'La Candelaria'].map((n) => (
            <button
              key={n}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Map coming soon</p>
      </div>
    </>
  );
}

function BookingsPanel() {
  return (
    <>
      <div>
        <h3 className="font-semibold text-sm mb-3">Upcoming</h3>
        <div className="p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">No upcoming bookings</p>
          <Button variant="link" size="sm" className="mt-2">
            Browse listings
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
        <div className="space-y-2">
          {[
            { title: 'Book a restaurant', icon: Calendar },
            { title: 'Find an apartment', icon: MapPin },
            { title: 'View saved places', icon: Bookmark },
          ].map((action) => (
            <button
              key={action.title}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
            >
              <action.icon className="w-4 h-4 text-primary" />
              <span className="text-sm">{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
