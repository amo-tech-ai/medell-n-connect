import { useRef, useEffect } from 'react';
import { Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export function ChatMessageList({ messages, isStreaming }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollRef}>
      <div className="space-y-4 py-4 max-w-3xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            )}
            
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50'
              )}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
                {isStreaming && message.role === 'assistant' && messages[messages.length - 1].id === message.id && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />
                )}
              </p>
              {message.role === 'assistant' && message.agent_name && (
                <p className="text-xs text-muted-foreground mt-2 capitalize">
                  {message.agent_name.replace('_', ' ')}
                </p>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
