import { ChevronRight } from 'lucide-react';
import type { ProjectData } from '@/data/projects';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { Label, Title } from '@/desktop/typography/Text';
import { StatusDot } from './StatusDot';

interface Props {
  project: ProjectData;
  onOpen: () => void;
}

/** The dense form of a project. Same destination as the card. */
export function ProjectRow({ project, onOpen }: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full items-center gap-3.5 py-4 text-left outline-none"
      >
        <StatusDot status={project.status} />

        {/* The same mark that identifies the site in the favicon grid, so one
            is learnable from the other. */}
        {project.link && (
          <SiteFavicon
            src={project.favicon}
            label={project.title}
            className="size-7 shrink-0 text-[11px]"
          />
        )}

        <span className="min-w-0 flex-1">
          <Title className="truncate transition-colors group-hover:text-primary">
            {project.title}
          </Title>
          <Label className="mt-1 block truncate text-muted-foreground/80">
            {project.year} · {project.category}
            {project.client ? ` · ${project.client}` : ''}
          </Label>
        </span>

        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      </button>
    </li>
  );
}
