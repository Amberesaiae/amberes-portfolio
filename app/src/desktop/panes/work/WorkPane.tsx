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
 * Two kinds of work, told two different ways.
 *
 * A live website gets a favicon and a link — you go and use it. Local software
 * has nowhere to send you, so it gets a card and a detail view. Nothing appears
 * in both places, which is what stops this window repeating itself.
 */
export default function WorkPane({ arg, view = 'grid' }: PaneProps) {
  const [openId, setOpenId] = useState<string | null>(arg ?? null);
  const all = useProjects();

  const live = all.filter((p) => p.link && p.favicon);
  const software = all.filter((p) => !(p.link && p.favicon));
  const selected = software.find((p) => p.id === openId);

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
      <SiteFaviconGrid sites={live} />

      <Eyebrow>Software · {software.length}</Eyebrow>

      <div className="mt-3">
        {view === 'grid' ? (
          <CardGrid>
            {software.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={() => setOpenId(project.id)} />
            ))}
          </CardGrid>
        ) : (
          <ul className="divide-y divide-border">
            {software.map((project) => (
              <ProjectRow key={project.id} project={project} onOpen={() => setOpenId(project.id)} />
            ))}
          </ul>
        )}
      </div>
    </PaneBody>
  );
}
