import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaneProps } from '@/desktop/config/panes';
import { PaneBody } from '@/desktop/panes/PaneBody';
import { WorkCards } from '@/desktop/widgets/WorkCards';
import { useIsMobile } from '@/desktop/providers/useIsMobile';
import { Body, Display, Title } from '@/desktop/typography/Text';
import { useProjects } from '@/hooks/useContent';
import { ProjectDetail } from './ProjectDetail';

/**
 * The same cards as the desktop, with room to read them.
 *
 * A live site leaves. A software build stays and opens its page, because
 * there is nowhere else to send you. Grid and list are the same cards in
 * one column or two — the scroll is what turns them, either way.
 */
export default function WorkPane({ arg, view = 'grid' }: PaneProps) {
  const [openId, setOpenId] = useState<string | null>(arg ?? null);
  const all = useProjects();
  const mobile = useIsMobile();
  const columns = view === 'grid' && !mobile ? 2 : 1;

  useEffect(() => {
    if (arg) setOpenId(arg);
  }, [arg]);

  const software = all.filter((project) => !(project.link && project.favicon));
  const selected = software.find((project) => project.id === openId);

  if (selected) {
    return (
      <PaneBody className="px-0 py-0">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-glass/80 px-3 py-2 backdrop-blur-sm">
          <Button variant="ghost" size="sm" onClick={() => setOpenId(null)}>
            <ChevronLeft />
            All work
          </Button>
          <Title as="h2" className="min-w-0 flex-1 truncate">
            {selected.title}
          </Title>
        </div>
        <div className="px-6 pt-6 sm:px-8">
          <ProjectDetail project={selected} />
        </div>
      </PaneBody>
    );
  }

  return (
    <PaneBody>
      <header className="mb-7">
        <Display>Work</Display>
        <Body className="mt-3">
          A live site opens where it is deployed. A software build opens its notes here.
        </Body>
      </header>

      <WorkCards variant="pane" columns={columns} onOpenSoftware={setOpenId} />
    </PaneBody>
  );
}
