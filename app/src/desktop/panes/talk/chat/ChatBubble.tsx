import { ThinkingOrb } from '@/components/thinking-orbs';
import { useEffectsEnabled } from '@/desktop/effects/useEffectsEnabled';
import { Body } from '@/desktop/typography/Text';
import { cn } from '@/lib/utils';
import type { ChatMessage } from './useChat';

/** One turn. The orb marks the assistant's side so the two never blur. */
export function ChatBubble({ message }: { message: ChatMessage }) {
  const mine = message.role === 'user';
  const { heavy } = useEffectsEnabled();

  return (
    <li className={cn('flex gap-2.5', mine && 'flex-row-reverse')}>
      {!mine && (
        <span className="mt-0.5 size-6 shrink-0">
          {heavy ? (
            <ThinkingOrb state="breathing" size={20} theme="auto" speed={0.5} />
          ) : (
            <span className="block size-4 translate-y-1 rounded-full border border-primary/70" />
          )}
        </span>
      )}

      <Body
        className={cn(
          'max-w-[82%] rounded-xl px-3 py-2 text-[0.8125rem] leading-relaxed',
          mine
            ? 'bg-primary text-primary-foreground'
            : 'bg-foreground/[0.06] text-foreground/85',
        )}
      >
        {message.content}
      </Body>
    </li>
  );
}
