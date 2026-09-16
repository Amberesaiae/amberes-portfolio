import { useState } from 'react';
import { SendHorizonal, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/desktop/typography/Text';
import { cn } from '@/lib/utils';
import { MicButton } from './MicButton';
import { useSpeechInput } from './useSpeechInput';
import type { useSpeechOutput } from './useSpeechOutput';

interface Props {
  disabled: boolean;
  onSend: (text: string) => void;
  voice: Pick<
    ReturnType<typeof useSpeechOutput>,
    'supported' | 'enabled' | 'speaking' | 'toggle'
  >;
}

/**
 * Type it or say it.
 *
 * Dictation appends to whatever is already in the box rather than replacing it,
 * so speaking and typing can be mixed in one message — which is what people
 * actually do when a word will not transcribe.
 */
export function ChatComposer({ disabled, onSend, voice }: Props) {
  const [text, setText] = useState('');
  const speech = useSpeechInput((final) =>
    setText((prev) => (prev ? `${prev.trim()} ${final}` : final)),
  );

  const submit = () => {
    if (!text.trim()) return;
    speech.stop();
    onSend(text);
    setText('');
  };

  return (
    <div className="sticky bottom-0 z-10 shrink-0 border-t border-border bg-background p-3">
      <div className="flex items-end gap-2">
        <Textarea
          value={speech.interim ? `${text} ${speech.interim}`.trim() : text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder="Tell me something. Share an idea?"
          className="min-h-[52px] resize-none bg-foreground/[0.03]"
        />

        {voice.supported && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={voice.toggle}
            aria-pressed={voice.enabled}
            aria-label={voice.enabled ? 'Mute the assistant' : 'Hear the assistant'}
            title={voice.enabled ? 'Mute the assistant' : 'Hear the assistant'}
            className={cn('size-9 shrink-0 rounded-full', voice.enabled && 'text-primary')}
          >
            {voice.enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </Button>
        )}

        {speech.supported && <MicButton listening={speech.listening} onToggle={speech.toggle} />}

        <Button
          size="icon"
          onClick={submit}
          disabled={disabled || !text.trim()}
          aria-label="Send"
          className="size-9 shrink-0 rounded-full"
        >
          <SendHorizonal className="size-4" />
        </Button>
      </div>

      <Label className="mt-2 block text-subtle-foreground">
        {speech.listening
          ? 'Listening — speak now'
          : speech.supported
            ? 'Enter to send · or press the mic and talk'
            : 'Enter to send'}
      </Label>
    </div>
  );
}
