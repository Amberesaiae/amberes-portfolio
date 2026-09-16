import type { ProjectData } from '@/data/projects';
import { Label, Mono } from '@/desktop/typography/Text';

const ROWS: { key: keyof NonNullable<ProjectData['spec']>; label: string }[] = [
  { key: 'role', label: 'Role' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'deployment', label: 'Deployment' },
  { key: 'performance', label: 'Performance' },
];

/** The build sheet. Data that was already in projects.ts and never shown. */
export function SpecGrid({ spec }: { spec: NonNullable<ProjectData['spec']> }) {
  const rows = ROWS.filter(({ key }) => spec[key]);
  if (rows.length === 0) return null;

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-lg border border-border bg-white/[0.02] p-4">
      {rows.map(({ key, label }) => (
        <div key={key} className="contents">
          <dt>
            <Label className="text-subtle-foreground">{label}</Label>
          </dt>
          <dd>
            <Mono className="text-foreground/80">{spec[key]}</Mono>
          </dd>
        </div>
      ))}
    </dl>
  );
}
