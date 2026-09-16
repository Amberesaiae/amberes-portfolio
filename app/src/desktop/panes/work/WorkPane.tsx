import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaneProps } from '@/desktop/config/panes';
import { CardGrid } from '@/desktop/panes/CardGrid';
import { PaneBody } from '@/desktop/panes/PaneBody';
import { Eyebrow } from '@/desktop/typography/Eyebrow';
import { Title } from '@/desktop/typography/Text';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import { ProjectRow } from './ProjectRow';
import { SiteFaviconGrid } from './SiteFaviconGrid';
import { useProjects } from '@/hooks/useContent';

/**
 * Two ways in, one way through.
 *
 * Grid and list are only the index; either way a project opens the same detail
 * *inside this window*, with a back arrow — not a modal over a window, and not
 * a second route.
 */
export default function WorkPane({ arg, view = 'grid' }: PaneProps) {
  const [openId, setOpenId] = useState<string | null>(arg ?? null);
  const projects = useProjects();
  const selected = projects.find((p) => p.id === openId);

  if (selected) {
    return (
      <PaneBody className="px-0 py-0">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-glass/80 px-2 py-1.5 backdrop-blur-sm">
          <Button variant="ghost" size="sm" className="type-label" onClick={() => setOpenId(null)}>
            <ChevronLeft />
            All work
          </Button>
          <Title className="truncate text-[0.875rem]">{selected.title}</Title>
        </div>
        <div className="px-6 pt-6 sm:px-8">
          <ProjectDetail project={selected} />
        </div>
      </PaneBody>
    );
  }

  return (
    <PaneBody>
      <Eyebrow>{projects.length} projects</Eyebrow>

      <div className="mt-4">
        <SiteFaviconGrid projects={projects} />
      </div>

      {view === 'grid' ? (
        <CardGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => setOpenId(project.id)} />
          ))}
        </CardGrid>
      ) : (
        <ul className="divide-y divide-border">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} onOpen={() => setOpenId(project.id)} />
          ))}
        </ul>
      )}
    </PaneBody>
  );
}
