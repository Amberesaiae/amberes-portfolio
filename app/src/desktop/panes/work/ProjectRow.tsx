import { ChevronRight } from 'lucide-react';
import type { ProjectData } from '@/data/projects';
import { IconWell } from '@/desktop/components/IconWell';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { Mono, Title } from '@/desktop/typography/Text';
import { StatusDot } from './StatusDot';

interface Props {
  project: ProjectData;
  onOpen: () => void;
}

/**
 * One piece of software, shaped exactly like a live site above it.
 *
 * Same mark, same title, same second line, same 36px target — the only
 * difference is where it goes. A site has an arrow and leaves; software has a
 * chevron and opens its own page here, because there is nowhere to send you and
 * the writing is the way in. Two kinds of thing, one kind of row, and the icon
 * is what makes a name in a list into something recognisable.
 */
export function ProjectRow({ project, onOpen }: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full items-center gap-3.5 py-3 text-left outline-none"
      >
        {project.cardIcon ? (
          <span className="size-9 shrink-0 overflow-hidden rounded-lg border border-border">
            <IconWell src={project.cardIcon} className="p-1" />
          </span>
        ) : (
          <ImageSlot
            className="size-9 shrink-0"
            ratio="1 / 1"
            src={project.image}
            alt=""
            hint={project.title}
            sizes="36px"
          />
        )}

        <span className="min-w-0 flex-1">
          <Title className="truncate text-[0.9rem] transition-colors group-hover:text-primary">
            {project.title}
          </Title>
          <Mono className="mt-0.5 block truncate text-subtle-foreground">
            {project.year} · {project.category}
            {project.client ? ` · ${project.client}` : ''}
          </Mono>
        </span>

        {/* The state of the thing, kept next to the way in rather than in front
            of the name, where it was competing with the icon. */}
        <StatusDot status={project.status} />

        <ChevronRight className="size-4 shrink-0 text-subtle-foreground transition-colors group-hover:text-primary" />
      </button>
    </li>
  );
}
