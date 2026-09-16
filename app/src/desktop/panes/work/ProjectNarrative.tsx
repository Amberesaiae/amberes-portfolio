import type { ProjectData } from '@/data/projects';
import { Body, Label } from '@/desktop/typography/Text';

/** Challenge and solution, side by side where there is room. */
export function ProjectNarrative({ project }: { project: ProjectData }) {
  if (!project.challenge && !project.solution) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {project.challenge && (
        <section className="space-y-2">
          <Label className="text-subtle-foreground">The problem</Label>
          <Body className="text-[0.8125rem] text-foreground/70">{project.challenge}</Body>
        </section>
      )}
      {project.solution && (
        <section className="space-y-2">
          <Label className="text-subtle-foreground">What I built</Label>
          <Body className="text-[0.8125rem] text-foreground/70">{project.solution}</Body>
        </section>
      )}
    </div>
  );
}
