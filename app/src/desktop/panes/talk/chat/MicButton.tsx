import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  listening: boolean;
  onToggle: () => void;
}

/** Push to talk. Pulses while the recogniser is open so the state is obvious. */
export function MicButton({ listening, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={listening}
      aria-label={listening ? 'Stop listening' : 'Speak instead of typing'}
      title={listening ? 'Stop listening' : 'Speak instead of typing'}
      className={cn(
        'relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors',
        listening
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:border-primary/60 hover:text-foreground',
      )}
    >
      {listening && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" aria-hidden="true" />
      )}
      {listening ? <Square className="relative size-3.5" /> : <Mic className="relative size-4" />}
    </button>
  );
}
