import { Link } from 'react-router-dom';
import { MapPin, Calendar, Bookmark, Lightbulb, Clock, DollarSign, Plane, Plus, ExternalLink } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ChatTab } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripContext } from '@/context/TripContext';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const { activeTrip, upcomingTrips, hasActiveTrip } = useTripContext();

  const getTimeUntilTrip = (startDate: string) => {
    const start = parseISO(startDate);
    const today = new Date();
    const days = differenceInDays(start, today);
    if (days < 0) return 'In progress';
    if (days === 0) return 'Starts today!';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  if (!user) {
    return (
      <div className="p-4 rounded-xl bg-muted/50 text-center">
        <Plane className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-3">Sign in to plan trips</p>
        <Button size="sm" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="font-semibold text-sm mb-3">Active Trip Context</h3>
        {hasActiveTrip && activeTrip ? (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activeTrip.title}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {format(parseISO(activeTrip.start_date), 'MMM d')} -{' '}
                    {format(parseISO(activeTrip.end_date), 'MMM d')}
                  </span>
                </div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {getTimeUntilTrip(activeTrip.start_date)}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" asChild>
                <Link to={`/trips/${activeTrip.id}`}>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-primary/10">
              🤖 AI knows about this trip and can help you plan!
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">No active trip selected</p>
            <Button variant="link" size="sm" className="mt-2" asChild>
              <Link to="/trips/new">
                <Plus className="w-4 h-4 mr-1" />
                Create a trip
              </Link>
            </Button>
          </div>
        )}
      </div>

      {upcomingTrips.length > 0 && !hasActiveTrip && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Upcoming Trips</h3>
          <div className="space-y-2">
            {upcomingTrips.slice(0, 3).map((trip) => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm font-medium">{trip.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {getTimeUntilTrip(trip.start_date)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
