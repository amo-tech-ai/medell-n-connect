import { useState, useEffect } from 'react';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { MobileNav } from '@/components/layout/MobileNav';
import { ChatTabs } from '@/components/chat/ChatTabs';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatWelcome } from '@/components/chat/ChatWelcome';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatRightPanel } from '@/components/chat/ChatRightPanel';
import { useChat } from '@/hooks/useChat';
import { ChatTab } from '@/types/chat';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelRightClose, Sparkles, Maximize2, X } from 'lucide-react';

export default function Chat() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<ChatTab>('concierge');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  const {
    messages,
    conversations,
    currentConversation,
    isLoading,
    isStreaming,
    fetchConversations,
    createConversation,
    selectConversation,
    sendMessage,
    cancelStream,
    archiveConversation,
    setCurrentConversation,
    setMessages,
  } = useChat(activeTab);

  // Fetch conversations when tab changes (only if logged in)
  useEffect(() => {
    if (user) {
      fetchConversations();
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [user, activeTab, fetchConversations, setCurrentConversation, setMessages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleTabChange = (tab: ChatTab) => {
    setActiveTab(tab);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleNewChat = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Navigation Panel */}
        <div className="w-[280px] flex-shrink-0">
          <LeftPanel />
        </div>

        {/* Conversations Panel */}
        <div className={cn(
          "border-r border-border bg-muted/30 transition-all duration-300 overflow-hidden",
          showLeftPanel ? "w-[280px]" : "w-0"
        )}>
          <div className="w-[280px] h-screen">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Conversations</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLeftPanel(false)}
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>
            <ConversationList
              conversations={conversations}
              currentConversation={currentConversation}
              onSelect={selectConversation}
              onNew={handleNewChat}
              onArchive={archiveConversation}
            />
          </div>
        </div>

        {/* Main Chat Panel */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Chat Header with AI Icon */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {!showLeftPanel && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLeftPanel(true)}
                  >
                    <PanelLeftClose className="w-4 h-4 rotate-180" />
                  </Button>
                )}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">AI Concierge</h1>
                  <p className="text-xs text-muted-foreground">Context Aware • Always here</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Maximize2 className="w-4 h-4" />
                </Button>
                {!showRightPanel && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowRightPanel(true)}
                  >
                    <PanelRightClose className="w-4 h-4 rotate-180" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <ChatTabs activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
          </div>

          {/* Messages or Welcome */}
          {messages.length === 0 ? (
            <ChatWelcome activeTab={activeTab} onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatMessageList messages={messages} isStreaming={isStreaming} />
          )}

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            onCancel={cancelStream}
            isLoading={isLoading}
            isStreaming={isStreaming}
            placeholder={`Ask about ${activeTab === 'concierge' ? 'Medellín' : activeTab}...`}
          />
        </main>

        {/* Right Context Panel */}
        <div className={cn(
          "border-l border-border bg-muted/30 transition-all duration-300 overflow-hidden",
          showRightPanel ? "w-[320px]" : "w-0"
        )}>
          <div className="w-[320px] h-screen">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold capitalize">{activeTab} Context</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRightPanel(false)}
              >
                <PanelRightClose className="w-4 h-4" />
              </Button>
            </div>
            <ChatRightPanel activeTab={activeTab} />
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden min-h-screen">
        <div className="w-16 flex-shrink-0">
          <LeftPanel collapsed />
        </div>
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex justify-center">
            <ChatTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          {messages.length === 0 ? (
            <ChatWelcome activeTab={activeTab} onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatMessageList messages={messages} isStreaming={isStreaming} />
          )}
          <ChatInput
            onSend={sendMessage}
            onCancel={cancelStream}
            isLoading={isLoading}
            isStreaming={isStreaming}
          />
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen pb-20">
        <main className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
          <div className="px-4 py-3 border-b border-border overflow-x-auto">
            <ChatTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          {messages.length === 0 ? (
            <ChatWelcome activeTab={activeTab} onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatMessageList messages={messages} isStreaming={isStreaming} />
          )}
          <ChatInput
            onSend={sendMessage}
            onCancel={cancelStream}
            isLoading={isLoading}
            isStreaming={isStreaming}
          />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
