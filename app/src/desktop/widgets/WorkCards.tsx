import { useRef } from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import type { ProjectData } from '@/data/projects';
import { IconWell } from '@/desktop/components/IconWell';
import { ImageSlot } from '@/desktop/components/ImageSlot';
import { SiteFavicon } from '@/desktop/components/SiteFavicon';
import { StatusDot } from '@/desktop/panes/work/StatusDot';
import { useDesktopDispatch } from '@/desktop/providers/windowStore';
import { Label, Mono, Small, Title } from '@/desktop/typography/Text';
import { useProjects } from '@/hooks/useContent';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { useScrollTilt } from './useScrollTilt';

/**
 * A live site has somewhere to go. Software does not — its page is the way in.
 * Same test the old list used, so a project never appears as both.
 */
function isLive(project: ProjectData) {
  return Boolean(project.link && project.favicon);
}

interface CardsProps {
  /** `plate` scrolls inside the desktop widget. `pane` scrolls with the window. */
  variant: 'plate' | 'pane';
  /** Two columns once the container is wide enough. One column stays a stack. */
  columns: 1 | 2;
  onOpenSoftware: (id: string) => void;
}

/**
 * Every project, as a card.
 *
 * The desktop used to spend its largest plate on photographs that are not
 * work, and a second plate on a list you had to scroll a line at a time.
 * This is the one set: the live sites and the software, both of them, up
 * front. Scrolling rotates each card in perspective. Nothing rotates on its
 * own.
 */
export function WorkCards({ variant, columns, onOpenSoftware }: CardsProps) {
  const dispatch = useDesktopDispatch();
  const projects = useProjects();
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  useScrollTilt(stageRef, !reduced);

  const live = projects.filter(isLive);
  const software = projects.filter((project) => !isLive(project));
  const plate = variant === 'plate';

  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-col',
        plate && 'h-full flex-1 p-3.5 md:h-[480px] md:w-[min(860px,calc(100vw-420px))] md:flex-none md:p-4',
      )}
    >
      {plate && (
        <div className="mb-3 flex shrink-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <Title as="h2">Work</Title>
            <Small className="mt-1">
              {live.length} live · {software.length} software
            </Small>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'open', id: 'work' })}
            onPointerDown={(e) => e.stopPropagation()}
            className="type-small shrink-0 rounded-md px-2 py-1 font-medium text-foreground/85 transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            Open
          </button>
        </div>
      )}

      {/* Pointer-down stops here so a scroll is a scroll, not a plate drag. */}
      <div
        onPointerDown={plate ? (e) => e.stopPropagation() : undefined}
        className={cn(
          'min-h-0 flex-1',
          plate && 'overflow-y-auto overscroll-contain [touch-action:pan-y]',
        )}
      >
        <div
          ref={stageRef}
          className="@container px-1 py-2"
          style={reduced ? undefined : { perspective: '1200px', perspectiveOrigin: '50% 42%' }}
        >
          <ul
            className={cn(
              'grid grid-cols-1 gap-3 pb-10',
              columns === 2 && '@[520px]:grid-cols-2',
            )}
          >
            <Group
              title="Live sites"
              projects={live}
              plate={plate}
              onOpenSoftware={onOpenSoftware}
            />
            <Group
              title="Software"
              projects={software}
              plate={plate}
              onOpenSoftware={onOpenSoftware}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

function Group({
  title,
  projects,
  plate,
  onOpenSoftware,
}: {
  title: string;
  projects: ProjectData[];
  plate: boolean;
  onOpenSoftware: (id: string) => void;
}) {
  if (projects.length === 0) return null;

  return (
    <>
      <li className="col-span-full mt-5 first:mt-0 border-b border-border pb-2">
        <div className="flex items-baseline justify-between gap-3">
          <Title>{title}</Title>
          <Mono className="text-subtle-foreground">{projects.length}</Mono>
        </div>
      </li>
      {projects.map((project) => (
        <li
          key={project.id}
          data-tilt
          className="[transform-style:preserve-3d]"
          style={{ transformOrigin: 'center center' }}
        >
          <WorkCard project={project} plate={plate} onOpenSoftware={onOpenSoftware} />
        </li>
      ))}
    </>
  );
}

function WorkCard({
  project,
  plate,
  onOpenSoftware,
}: {
  project: ProjectData;
  plate: boolean;
  onOpenSoftware: (id: string) => void;
}) {
  const live = isLive(project);
  const meta = live
    ? [project.year, project.url].filter(Boolean).join(' · ')
    : [project.year, project.category, project.client].filter(Boolean).join(' · ');

  const face = (
    <>
      <span className="flex items-start gap-3">
        <Mark project={project} live={live} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <Label className="text-subtle-foreground">{live ? 'Live site' : project.category}</Label>
            <StatusDot status={project.status} />
          </span>
          <Title as="h4" className={cn('mt-1 min-w-0', plate ? 'truncate' : 'line-clamp-2')}>
            {project.title}
          </Title>
          <Mono className="mt-1 block truncate text-subtle-foreground">{meta}</Mono>
        </span>
        {live ? (
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-subtle-foreground transition-colors group-hover:text-primary" />
        ) : (
          <ChevronRight className="mt-0.5 size-4 shrink-0 text-subtle-foreground transition-colors group-hover:text-primary" />
        )}
      </span>
      <Small className={cn('mt-3', plate ? 'line-clamp-2' : 'line-clamp-4')}>{project.description}</Small>
    </>
  );

  const className = cn(
    'group flex h-full w-full flex-col rounded-xl border border-border bg-foreground/[0.04] p-3.5 text-left',
    'transition-colors hover:border-primary/50 hover:bg-foreground/[0.07]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  );

  if (live && project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {face}
        <span className="sr-only">Opens in a new tab</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={() => onOpenSoftware(project.id)} className={className}>
      {face}
    </button>
  );
}

function Mark({ project, live }: { project: ProjectData; live: boolean }) {
  if (live) {
    return (
      <SiteFavicon
        src={project.favicon}
        label={project.title}
        className="size-12 shrink-0 text-base"
      />
    );
  }

  if (project.cardIcon) {
    return (
      <span className="size-12 shrink-0 overflow-hidden rounded-lg">
        <IconWell src={project.cardIcon} className="p-1.5" />
      </span>
    );
  }

  return (
    <ImageSlot
      className="size-12 shrink-0 rounded-lg"
      ratio="1 / 1"
      src={project.image}
      alt=""
      sizes="48px"
    />
  );
}
