import { Label, Mono, Small } from '@/desktop/typography/Text';

/**
 * What he is open to, and how long a reply takes. Edit the three lines below —
 * they are the only thing on the site that goes stale on its own.
 */
const OPEN_TO = ['Contract web work', 'Marine engineering roles', 'Collaborations'];
const RESPONSE = 'Usually within a day or two';

export function ContactAvailability() {
  return (
    <div className="rounded-lg border border-border bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        <Label className="text-foreground/80">Open to work</Label>
      </div>

      <ul className="mb-3 space-y-1">
        {OPEN_TO.map((item) => (
          <li key={item}>
            <Small className="text-[0.75rem] text-muted-foreground">— {item}</Small>
          </li>
        ))}
      </ul>

      <Mono className="text-muted-foreground/70">{RESPONSE}</Mono>
    </div>
  );
}
