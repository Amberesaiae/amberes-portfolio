import { Label, Small, Title } from '@/desktop/typography/Text';

export interface TimelineEntry {
  period: string;
  heading: string;
  meta: string;
  description?: string;
}

/** One shape for both experience and education, so they read as one system. */
export function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-5">
      {entries.map((e) => (
        <li key={`${e.period}-${e.heading}`} className="space-y-1">
          <Label className="block text-subtle-foreground">
            {e.period} · {e.meta}
          </Label>
          <Title className="text-[0.95rem]">{e.heading}</Title>
          {e.description && <Small>{e.description}</Small>}
        </li>
      ))}
    </ol>
  );
}
