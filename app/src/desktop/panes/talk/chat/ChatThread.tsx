import { useEffect, useRef } from 'react';
import { ThinkingOrb } from '@/components/thinking-orbs';
import { useEffectsEnabled } from '@/desktop/effects/useEffectsEnabled';
import { Label } from '@/desktop/typography/Text';
import { ChatBubble } from './ChatBubble';
import type { ChatMessage } from './useChat';

/** The transcript, pinned to the newest line. */
export function ChatThread({ messages, sending }: { messages: ChatMessage[]; sending: boolean }) {
  const end = useRef<HTMLDivElement>(null);
  const { heavy } = useEffectsEnabled();

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
      <ul className="space-y-3">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {sending && (
          <li className="flex items-center gap-2.5">
            <span className="size-6 shrink-0">
              {heavy ? (
                <ThinkingOrb state="working" size={20} theme="auto" />
              ) : (
                <span className="block size-4 translate-y-1 animate-pulse rounded-full bg-primary/70" />
              )}
            </span>
            <Label className="text-subtle-foreground">Thinking</Label>
          </li>
        )}
      </ul>
      <div ref={end} />
    </div>
  );
}
