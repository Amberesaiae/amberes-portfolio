import { ArrowUpRight } from 'lucide-react';
import type { ProjectData } from '@/data/projects';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { MediaCard } from '@/desktop/panes/MediaCard';
import { StatusDot } from './StatusDot';

/** A door, not a summary: one picture, a name, and when it happened. */
export function ProjectCard({ project, onOpen }: { project: ProjectData; onOpen: () => void }) {
  const media = project.cardIcon ? (
    <span className="flex size-full items-center justify-center bg-foreground/[0.04]">
      <img src={project.cardIcon} alt="" aria-hidden="true" className="size-14 object-contain" />
    </span>
  ) : (
    <ImageSlot
      className="size-full rounded-none border-0"
      ratio="16 / 10"
      src={project.image}
      alt={project.title}
      hint={project.title}
      sizes="(max-width: 768px) 90vw, 300px"
    />
  );

  return (
    <MediaCard
      title={project.title}
      meta={`${project.year} · ${project.category}`}
      onOpen={onOpen}
      leading={<StatusDot status={project.status} />}
      trailing={
        project.link ? (
          <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
        ) : undefined
      }
      media={media}
    />
  );
}
