import type { ProjectData } from '@/data/projects';
import { ImageSlot } from '@/desktop/components/ImageSlot';

/**
 * Three slots per project, filled or not. They are placeholders today; dropping
 * real screenshots into `gallery` in projects.ts is the only change needed.
 */
export function ProjectGallery({ project }: { project: ProjectData }) {
  const shots = project.gallery?.length ? project.gallery.slice(0, 3) : [undefined, undefined, undefined];

  return (
    <div className="grid grid-cols-3 gap-2">
      {shots.map((src, i) => (
        <ImageSlot
          key={src ?? i}
          src={src}
          alt={src ? `${project.title} screenshot ${i + 1}` : ''}
          hint={`0${i + 1}`}
          sizes="(max-width: 768px) 30vw, 260px"
        />
      ))}
    </div>
  );
}
