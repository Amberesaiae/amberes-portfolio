import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ZoomIn, ExternalLink, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PADX, CONTENT_GRID, SPAN } from '../../styles/layoutTokens';
import type { ProjectData } from '../../data/projects';

function Viewfinder() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FFB000]/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FFB000]/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FFB000]/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FFB000]/40" />
    </div>
  );
}

export default function ProjectRow({
  project,
  isActive,
  onToggle,
  onImageClick,
}: {
  project: ProjectData;
  isActive: boolean;
  onToggle: () => void;
  onImageClick: (src: string, title: string) => void;
}) {
  const hasImage = !project.omitImage;
  const rowRef = useRef<HTMLDivElement>(null);

  // Removed aggressive auto-scroll behavior that was causing jumpiness
  // Users can scroll manually if needed

  return (
    <div
      ref={rowRef}
      className={cn(
        'relative border-b border-white/5 last:border-b-0 transition-all duration-700',
        isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFB000] shadow-[0_0_20px_rgba(255,176,0,0.4)]" />
      )}

      <Viewfinder />

      <button
        onClick={onToggle}
        className="group relative z-10 w-full py-6 md:py-8 px-6 md:px-12 text-left transition-all duration-500"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
          <div className="w-24 hidden xl:flex items-center gap-4">
            <span className="font-mono text-[10px] text-white/50 tracking-[0.3em] uppercase">ID</span>
            <span className="font-mono text-[11px] text-[#FFB000] tracking-[0.15em] group-hover:drop-shadow-[0_0_8px_rgba(255,176,0,0.4)] transition-all">
              {project.id.split('-')[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className={cn(
              'font-serif text-lg md:text-2xl tracking-tight transition-all duration-700 uppercase leading-tight',
              isActive ? 'text-[#FFB000] drop-shadow-[0_0_10px_rgba(255,176,0,0.3)]' : 'text-white/90 group-hover:text-[#FFB000] group-hover:drop-shadow-[0_0_8px_rgba(255,176,0,0.2)]'
            )}>
              {project.title}
            </h3>

            <div className="flex items-center gap-10">
              <div className="hidden lg:flex items-center gap-8 text-white/60 font-mono text-[11px] uppercase tracking-[0.25em]">
                <span>{project.year}</span>
                <div className="h-4 w-[1px] bg-white/20" />
                <span className="text-white/40">{project.category}</span>
              </div>
              <span className={cn(
                "font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 border transition-colors",
                isActive ? "border-[#FFB000] text-[#FFB000] bg-[#FFB000]/5" : "border-white/10 text-white/50 group-hover:text-white/70 group-hover:border-white/20"
              )}>
                {project.status === 'shipped' ? 'SHIPPED' : 'PENDING'}
              </span>
            </div>
          </div>

          <div className={cn(
            'w-10 h-10 flex items-center justify-center transition-all duration-700 border',
            isActive ? 'border-[#FFB000] bg-[#FFB000] text-black' : 'border-white/10 text-white/30 group-hover:border-white/20 group-hover:text-white/60'
          )}>
            <ArrowRight className={cn('w-4 h-4 transition-transform', isActive ? 'rotate-90' : 'group-hover:translate-x-1')} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0a0a0a]/95 backdrop-blur-3xl border-t border-white/5"
          >
            <div className={cn("pt-8 pb-12 md:pt-12 md:pb-16", PADX.page)}>
              <div className={CONTENT_GRID}>
                <div className={SPAN['7'] + " space-y-10"}>
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 text-[#FFB000]/50">
                      <div className="w-2 h-[1px] bg-current" />
                      <h4 className="text-[10px] uppercase tracking-[0.35em] font-mono font-bold">PROJECT_LOG</h4>
                    </div>
                    <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                      {project.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-10 py-8 border-y border-white/10">
                    {Object.entries(project.spec || {}).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <p className="text-[#FFB000]/70 text-[9px] uppercase tracking-[0.25em] font-mono font-bold">{key}</p>
                        <p className="text-white/90 text-[11px] uppercase tracking-wide font-mono font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.stack.map((tech) => (
                      <span key={tech} className="text-white/50 text-[9px] font-mono uppercase tracking-[0.15em] border border-white/10 px-3 py-1.5 hover:border-[#FFB000]/40 hover:text-[#FFB000] transition-all">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-10 pt-6 border-t border-white/5">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-4"
                      >
                        <div className="w-10 h-10 border border-[#FFB000]/20 flex items-center justify-center group-hover/link:bg-[#FFB000] group-hover/link:text-black transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#FFB000] text-[10px] uppercase tracking-[0.25em] font-mono font-bold">LIVE_SITE</span>
                        </div>
                      </a>
                    )}
                    <Link
                      to={`/portfolio/${project.id}`}
                      className="group/link flex items-center gap-4"
                    >
                      <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover/link:border-white/50 transition-all">
                        <Database className="w-4 h-4 text-white/50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/80 text-[10px] uppercase tracking-[0.25em] font-mono font-bold">CASE_STUDY</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {hasImage && (
                  <div className={SPAN['5'] + " relative"}>
                    <div className="flex items-center gap-3 mb-4 text-white/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span className="text-[9px] uppercase tracking-[0.35em] font-mono font-bold">VISUAL_ASSET_01</span>
                    </div>
                    <button
                      onClick={() => onImageClick(project.image, project.title)}
                      className="relative w-full h-auto bg-[#050505] border border-white/10 overflow-hidden cursor-zoom-in group/img shadow-2xl rounded-sm"
                    >
                      <img
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        className="w-full h-auto block transition-transform duration-1000 group-hover/img:scale-105"
                      />
                      <Viewfinder />
                      <div className="absolute inset-0 bg-[#FFB000]/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/img:opacity-100 transition-all duration-700 scale-75 group-hover/img:scale-100">
                        <div className="bg-black/80 backdrop-blur-md border border-[#FFB000]/40 p-4 rounded-full">
                          <ZoomIn className="w-6 h-6 text-[#FFB000]" />
                        </div>
                      </div>
                    </button>
                    <div className="mt-4 flex justify-between items-center px-1">
                      <div className="h-[1px] flex-1 bg-white/5" />
                      <span className="text-[8px] text-white/20 font-mono tracking-[0.4em] uppercase ml-4">CONFIDENTIAL_ARCHIVE</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
