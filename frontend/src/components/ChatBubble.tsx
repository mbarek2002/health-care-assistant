import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
  return (
    <div className={cn("flex w-full mb-4 animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm", 
        isUser 
          ? "bg-[hsl(var(--chat-user-bg))] text-[hsl(var(--chat-user-fg))] rounded-br-sm" 
          : "bg-[hsl(var(--chat-assistant-bg))] text-[hsl(var(--chat-assistant-fg))] rounded-bl-sm border border-border"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message}</p>
        {timestamp && (
          <span className={cn("text-xs mt-1 block", 
            isUser ? "text-[hsl(var(--chat-user-fg))]/70" : "text-muted-foreground"
          )}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
