import { useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactPane from '@/desktop/panes/contact/ContactPane';
import { ChatComposer } from './chat/ChatComposer';
import { ChatThread } from './chat/ChatThread';
import { useChat } from './chat/useChat';
import { useSpeechOutput } from './chat/useSpeechOutput';

/**
 * Two ways to reach him, in one window.
 *
 * Talk is the fast one — ask a question, describe a job, speak it if typing is
 * slower. Write is the certain one: it goes straight to his inbox and works
 * whether or not the assistant is configured or reachable. The tab order says
 * which is which without a word of explanation.
 */
export default function TalkPane() {
  const chat = useChat();
  const voice = useSpeechOutput();
  const spokenRef = useRef<string | null>(null);

  // Each assistant reply is spoken once, and only while the voice is on.
  // The ref (not state) means re-renders never re-trigger a reading.
  useEffect(() => {
    const last = chat.messages[chat.messages.length - 1];
    if (last && last.role === 'assistant' && last.id !== 'opener' && last.id !== spokenRef.current) {
      spokenRef.current = last.id;
      voice.speak(last.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.messages]);

  return (
    <Tabs defaultValue="talk" className="flex h-full min-h-0 flex-col gap-0">
      <TabsList className="mx-4 mt-4 w-fit shrink-0 bg-foreground/[0.06]">
        <TabsTrigger value="talk" className="type-label">
          Talk
        </TabsTrigger>
        <TabsTrigger value="write" className="type-label">
          Write
        </TabsTrigger>
      </TabsList>

      <TabsContent value="talk" className="flex min-h-0 flex-1 flex-col">
        <ChatThread messages={chat.messages} sending={chat.sending} />
        <ChatComposer disabled={chat.sending} onSend={chat.send} voice={voice} />
      </TabsContent>

      <TabsContent value="write" className="min-h-0 flex-1 overflow-y-auto">
        <ContactPane />
      </TabsContent>
    </Tabs>
  );
}
