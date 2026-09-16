import { cn } from '@/lib/utils';
import type { ProjectData } from '@/data/projects';

const COLOUR: Record<ProjectData['status'], string> = {
  shipped: 'bg-emerald-400',
  'in-progress': 'bg-primary',
  experiment: 'bg-muted-foreground',
};

const LABEL: Record<ProjectData['status'], string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  experiment: 'Experiment',
};

export function StatusDot({ status }: { status: ProjectData['status'] }) {
  return (
    <span className="flex items-center" title={LABEL[status]}>
      <span className="sr-only">{LABEL[status]}</span>
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', COLOUR[status])} />
    </span>
  );
}
