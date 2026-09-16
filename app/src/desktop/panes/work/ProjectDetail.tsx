import { ArrowUpRight, Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProjectData } from '@/data/projects';
import { Body, Label } from '@/desktop/typography/Text';
import { ProjectGallery } from './ProjectGallery';
import { ProjectNarrative } from './ProjectNarrative';
import { SpecGrid } from './SpecGrid';

/** The expanded half of a project row. */
export function ProjectDetail({ project }: { project: ProjectData }) {
  return (
    <div className="space-y-6 pb-7 pl-7 pr-1">
      <Body>{project.description}</Body>

      {!project.omitImage && <ProjectGallery project={project} />}

      <ProjectNarrative project={project} />

      {project.metrics && project.metrics.length > 0 && (
        <ul className="space-y-1.5">
          {project.metrics.map((m) => (
            <li key={m} className="type-small flex gap-2.5 text-muted-foreground">
              <span aria-hidden="true" className="text-primary">
                —
              </span>
              {m}
            </li>
          ))}
        </ul>
      )}

      {project.spec && <SpecGrid spec={project.spec} />}

      {project.stack.length > 0 && (
        <div>
          <Label className="mb-2 block text-subtle-foreground">Stack</Label>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li key={item}>
                <Badge variant="outline" className="type-mono border-border text-muted-foreground">
                  {item}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(project.link || project.github) && (
        <div className="flex flex-wrap gap-2">
          {project.link && (
            <Button asChild size="sm" className="type-label">
              <a href={project.link} target="_blank" rel="noreferrer noopener">
                {project.url ?? 'Visit'}
                <ArrowUpRight />
              </a>
            </Button>
          )}
          {project.github && (
            <Button asChild variant="outline" size="sm" className="type-label">
              <a href={project.github} target="_blank" rel="noreferrer noopener">
                <Code2 />
                Source
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
