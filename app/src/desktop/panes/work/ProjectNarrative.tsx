import type { ProjectData } from '@/data/projects';
import { Body, Title } from '@/desktop/typography/Text';

/** Challenge and solution, side by side where there is room. */
export function ProjectNarrative({ project }: { project: ProjectData }) {
  if (!project.challenge && !project.solution) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {project.challenge && (
        <section className="space-y-2">
          <Title as="h3">The problem</Title>
          <Body>{project.challenge}</Body>
        </section>
      )}
      {project.solution && (
        <section className="space-y-2">
          <Title as="h3">What I built</Title>
          <Body>{project.solution}</Body>
        </section>
      )}
    </div>
  );
}
