import { Home, Plane, Compass, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatTab } from '@/types/chat';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatTabsProps {
  activeTab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
}

const tabs: { id: ChatTab; icon: typeof Home; label: string; description: string }[] = [
  { id: 'concierge', icon: Home, label: 'Concierge', description: 'General lifestyle Q&A' },
  { id: 'trips', icon: Plane, label: 'Trips', description: 'Trip planning chat' },
  { id: 'explore', icon: Compass, label: 'Explore', description: 'Discovery with map' },
  { id: 'bookings', icon: CalendarCheck, label: 'Bookings', description: 'Reservation management' },
];

export function ChatTabs({ activeTab, onTabChange }: ChatTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
      {tabs.map((tab) => (
        <Tooltip key={tab.id}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{tab.label}</p>
            <p className="text-xs text-muted-foreground">{tab.description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
