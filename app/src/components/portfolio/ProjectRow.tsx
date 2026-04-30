import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (isActive && rowRef.current) {
      const timer = setTimeout(() => {
        const rect = rowRef.current?.getBoundingClientRect();
        if (!rect) return;

        const viewportHeight = window.innerHeight;
        const scrollOffset = rect.top + window.scrollY;

        if (rect.bottom > viewportHeight * 0.8) {
          const targetScroll = scrollOffset - (viewportHeight * 0.1);
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

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
        className="group relative z-10 w-full py-4 md:py-5 px-4 md:px-10 text-left transition-all duration-500"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
          <div className="w-20 hidden xl:flex items-center gap-3">
            <span className="font-mono text-[9px] text-white/50 tracking-[0.4em] uppercase">ID</span>
            <span className="font-mono text-[10px] text-white/80 tracking-[0.2em] group-hover:text-[#FFB000] transition-colors">
              {project.id.split('-')[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className={cn(
              'font-serif text-lg md:text-2xl tracking-tighter transition-all duration-700 uppercase',
              isActive ? 'text-[#FFB000]' : 'text-white/80 group-hover:text-white'
            )}>
              {project.title}
            </h3>

            <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-6 text-white/50 font-mono text-[10px] uppercase tracking-[0.3em]">
                <span>{project.year}</span>
                <div className="h-3 w-[1px] bg-white/10" />
                <span>{project.category}</span>
              </div>
              <span className={cn(
                "font-mono text-[10px] uppercase tracking-[0.3em] px-2.5 py-1 border transition-colors",
                isActive ? "border-[#FFB000] text-[#FFB000]" : "border-white/10 text-white/60 group-hover:text-white group-hover:border-white/20"
              )}>
                {project.status === 'shipped' ? 'SHIPPED' : 'PENDING'}
              </span>
            </div>
          </div>

          <div className={cn(
            'w-8 h-8 flex items-center justify-center transition-all duration-700 border',
            isActive ? 'border-[#FFB000] bg-[#FFB000] text-black' : 'border-white/5 text-white/20 group-hover:border-white/20 group-hover:text-white/60'
          )}>
            <ArrowRight className={cn('w-3 h-3 transition-transform', isActive ? 'rotate-90' : 'group-hover:translate-x-1')} />
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
            <div className={cn("pt-4 pb-8 md:pt-6 md:pb-12", PADX.page)}>
              <div className={CONTENT_GRID}>
                <div className={SPAN['7'] + " space-y-8"}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#FFB000]/60">
                      <div className="w-1.5 h-[1px] bg-current" />
                      <h4 className="text-[9px] uppercase tracking-[0.4em] font-mono font-bold">PROJECT_LOG</h4>
                    </div>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed font-serif italic max-w-xl">
                      "{project.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 py-6 border-y border-white/10">
                    {Object.entries(project.spec || {}).map(([key, value]) => (
                      <div key={key} className="space-y-1.5">
                        <p className="text-[#FFB000]/40 text-[8px] uppercase tracking-[0.3em] font-mono font-bold">{key}</p>
                        <p className="text-white text-[10px] uppercase tracking-wider font-mono font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="text-white/40 text-[8px] font-mono uppercase tracking-[0.2em] border border-white/5 px-2.5 py-1 hover:border-[#FFB000]/30 hover:text-[#FFB000] transition-all">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-3"
                      >
                        <div className="w-9 h-9 border border-[#FFB000]/20 flex items-center justify-center group-hover/link:bg-[#FFB000] group-hover/link:text-black transition-all">
                          <ExternalLink className="w-3 h-3" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#FFB000] text-[9px] uppercase tracking-[0.3em] font-mono font-bold">LIVE_SITE</span>
                        </div>
                      </a>
                    )}
                    <Link
                      to={`/portfolio/${project.id}`}
                      className="group/link flex items-center gap-3"
                    >
                      <div className="w-9 h-9 border border-white/20 flex items-center justify-center group-hover/link:border-white/50 transition-all">
                        <Database className="w-3 h-3 text-white/50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/90 text-[9px] uppercase tracking-[0.3em] font-mono font-bold">CASE_STUDY</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {hasImage && (
                  <div className={SPAN['5'] + " relative"}>
                    <div className="flex items-center gap-3 mb-3 text-white/30">
                      <div className="w-1 h-1 rounded-full bg-current" />
                      <span className="text-[8px] uppercase tracking-[0.4em] font-mono font-bold">VISUAL_ASSET_01</span>
                    </div>
                    <button
                      onClick={() => onImageClick(project.image, project.title)}
                      className="relative w-full h-auto bg-[#050505] border border-white/10 overflow-hidden cursor-zoom-in group/img shadow-2xl rounded-sm"
                    >
                      <img
                        src={project.image}
                        alt=""
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
                    <div className="mt-3 flex justify-between items-center px-1">
                      <div className="h-[1px] flex-1 bg-white/5" />
                      <span className="text-[7px] text-white/20 font-mono tracking-[0.5em] uppercase ml-4">CONFIDENTIAL_ARCHIVE</span>
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
