import { useCallback, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const OPENER: ChatMessage = {
  id: 'opener',
  role: 'assistant',
  content:
    'Ask me anything about his work — what he has built, what he used, whether he is free. Or describe what you need and I will help you shape it.',
};

/**
 * The conversation, and the one request that moves it forward.
 *
 * The endpoint is the only thing that knows the key; this sends the thread and
 * appends whatever comes back, keeping an error as a message in the thread
 * rather than a banner, so the failure reads as part of the conversation.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([OPENER]);
  const [sending, setSending] = useState(false);
  const counter = useRef(0);

  const id = () => {
    counter.current += 1;
    return `m${counter.current}`;
  };

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const outgoing: ChatMessage = { id: id(), role: 'user', content: trimmed };
      const thread = [...messages, outgoing];
      setMessages(thread);
      setSending(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: thread
              .filter((m) => m.id !== 'opener')
              .map(({ role, content }) => ({ role, content })),
          }),
        });

        const data = (await res.json().catch(() => ({}))) as { reply?: string; message?: string };

        setMessages((prev) => [
          ...prev,
          {
            id: id(),
            role: 'assistant',
            content:
              data.reply ??
              data.message ??
              'That did not go through. The contact form always works.',
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: id(),
            role: 'assistant',
            content: 'No connection. The contact form will still reach him.',
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [messages, sending],
  );

  const reset = useCallback(() => setMessages([OPENER]), []);

  return { messages, sending, send, reset };
}
