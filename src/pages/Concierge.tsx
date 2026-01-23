import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, MessageCircle, Plus, Clock, Home, Plane, Compass, 
  CalendarCheck, Archive, ChevronRight, MapPin, UtensilsCrossed, Building2, Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useTripContext } from "@/context/TripContext";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ConversationList } from "@/components/chat/ConversationList";
import type { ChatTab, Conversation } from "@/types/chat";
import { format, formatDistanceToNow } from "date-fns";

// Quick action cards for the Intelligence panel
const quickActions = [
  { icon: UtensilsCrossed, label: "Find Restaurant", query: "Find a restaurant in El Poblado" },
  { icon: Building2, label: "Find Apartment", query: "Find an apartment for next month" },
  { icon: Car, label: "Rent a Car", query: "Find a car to rent" },
  { icon: MapPin, label: "Things to Do", query: "What events are happening this weekend?" },
];

export default function Concierge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeTrip } = useTripContext();
  const [activeTab, setActiveTab] = useState<ChatTab>("concierge");
  
  const {
    messages,
    conversations,
    currentConversation,
    isLoading,
    isStreaming,
    fetchConversations,
    sendMessage,
    cancelStream,
    createConversation,
    selectConversation,
    archiveConversation,
    setCurrentConversation,
    setMessages,
  } = useChat(activeTab);

  // Fetch conversations on mount and tab change
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, activeTab, fetchConversations]);

  const handleTabChange = (tab: ChatTab) => {
    setActiveTab(tab);
    setCurrentConversation(null);
    setMessages([]);
  };

  const handleNewChat = useCallback(async () => {
    setCurrentConversation(null);
    setMessages([]);
  }, [setCurrentConversation, setMessages]);

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            AI Concierge
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to access your personal AI assistant for exploring Medellín.
          </p>
          <Button size="lg" onClick={() => navigate("/login")}>
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop 3-Panel Layout */}
      <div className="hidden lg:grid lg:grid-cols-[320px_1fr_380px] min-h-screen">
        {/* LEFT PANEL: Context */}
        <aside className="border-r border-border bg-secondary/30 flex flex-col h-screen">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">AI Concierge</h1>
                <p className="text-xs text-muted-foreground">Your personal Medellín guide</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <ChatTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              <Button 
                onClick={handleNewChat}
                className="w-full justify-start gap-2 mb-4"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
                New Conversation
              </Button>
              
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-all",
                        currentConversation?.id === conv.id
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-card border border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <p className="font-medium text-sm text-foreground line-clamp-1">
                        {conv.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conv.last_message_at 
                          ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })
                          : "New conversation"
                        }
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Back Link */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}>
              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Home
            </Button>
          </div>
        </aside>

        {/* CENTER PANEL: Work */}
        <main className="flex flex-col h-screen">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              <ChatWelcome activeTab={activeTab} onSuggestionClick={handleSuggestionClick} />
            ) : (
              <ChatMessageList messages={messages} isStreaming={isStreaming} />
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border bg-background">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={sendMessage}
                onCancel={cancelStream}
                isLoading={isLoading}
                isStreaming={isStreaming}
                placeholder="Ask me anything about Medellín..."
              />
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Intelligence */}
        <aside className="border-l border-border bg-secondary/30 flex flex-col h-screen">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground">Intelligence</h2>
            <p className="text-sm text-muted-foreground mt-1">Context & quick actions</p>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Active Trip Context */}
              {activeTrip && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Active Trip</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{activeTrip.title}</p>
                  {activeTrip.start_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(activeTrip.start_date), "MMM d")} - {activeTrip.end_date && format(new Date(activeTrip.end_date), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-center"
                    >
                      <action.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* AI Insight */}
              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">AI Insight</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I can help you discover restaurants, plan trips, find apartments, or book experiences in Medellín. Just ask!
                </p>
              </div>

              {/* Tab-Specific Context */}
              {activeTab === "explore" && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Popular Areas</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["El Poblado", "Laureles", "Envigado", "El Centro"].map((area) => (
                      <Badge key={area} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Booking Help</h4>
                  <p className="text-xs text-muted-foreground">
                    I can help you manage reservations, cancel bookings, or find new availability.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col pb-20">
        {/* Header */}
        <header className="p-4 border-b border-border bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="font-semibold text-foreground">AI Concierge</h1>
            </div>
          </div>
          <ChatTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </header>

        {/* Chat Area */}
        <div className="flex-1 min-h-0">
          {messages.length === 0 ? (
            <div className="p-4">
              <ChatWelcome activeTab={activeTab} onSuggestionClick={handleSuggestionClick} />
            </div>
          ) : (
            <ChatMessageList messages={messages} isStreaming={isStreaming} />
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background">
          <ChatInput
            onSend={sendMessage}
            onCancel={cancelStream}
            isLoading={isLoading}
            isStreaming={isStreaming}
            placeholder="Ask me anything..."
          />
        </div>
      </div>
    </div>
  );
}
