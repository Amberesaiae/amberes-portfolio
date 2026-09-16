import { environmentItems } from '@/components/about/aboutData';
import { Label, Mono } from '@/desktop/typography/Text';

/** What the work is actually made of. Two columns, no badges, no logos. */
export function EnvironmentTable() {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 rounded-lg border border-border bg-white/[0.02] p-4">
      {environmentItems.map((item) => (
        <div key={item.key} className="contents">
          <dt>
            <Label className="text-muted-foreground/60">{item.key}</Label>
          </dt>
          <dd>
            <Mono className="text-foreground/80">{item.value}</Mono>
          </dd>
        </div>
      ))}
    </dl>
  );
}
