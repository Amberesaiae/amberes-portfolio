import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ZoomIn, ExternalLink, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ProjectData } from '../../data/projects';
import TiltCard from '../ui/TiltCard';

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
        className="group relative z-10 w-full py-6 md:py-8 px-4 md:px-12 text-left transition-all duration-500"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
          <div className="w-24 hidden xl:flex items-center gap-4">
            <span className="font-mono text-[8px] text-white/80 tracking-[0.4em] uppercase">ID</span>
            <span className="font-mono text-[9px] text-white tracking-[0.2em] group-hover:text-[#FFB000] transition-colors">
              {project.id.split('-')[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className={cn(
              'font-serif text-xl sm:text-2xl md:text-4xl tracking-tighter transition-all duration-700 uppercase',
              isActive ? 'text-[#FFB000] md:translate-x-4' : 'text-white/70 group-hover:text-white md:group-hover:translate-x-2'
            )}>
              {project.title}
            </h3>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] md:tracking-[0.4em] text-white/80 group-hover:text-[#FFB000] transition-colors">
                {project.status === 'shipped' ? 'NODE_SHIPPED' : 'NODE_PENDING'}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-white font-mono text-[9px] uppercase tracking-[0.3em] group-hover:text-[#FFB000]">
            <span>{project.year}</span>
            <div className="h-4 w-[1px] bg-white/5" />
            <span>{project.category.slice(0, 3)}</span>
          </div>

          <div className={cn(
            'w-10 h-10 flex items-center justify-center transition-all duration-700 rounded-full border',
            isActive ? 'border-[#FFB000] bg-[#FFB000] text-black' : 'border-white/5 text-white/5 group-hover:border-white/20 group-hover:text-white/40'
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
            className="bg-[#0a0a0a]/90 backdrop-blur-xl"
          >
            <div className="pt-8 pb-20 md:pb-32 px-4 sm:px-6 md:px-32">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24">
                <div className="lg:col-span-7 space-y-12 md:space-y-20">
                  <div className="space-y-6 md:space-y-10">
                    <div className="flex items-center gap-5 text-[#FFCC00]">
                      <div className="w-1 h-1 bg-current" />
                      <h4 className="text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-mono font-black">LOGGED_DESCRIPTION</h4>
                    </div>
                    <p className="text-white text-lg md:text-xl leading-relaxed font-serif tracking-tight max-w-2xl italic">
                      "{project.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 py-8 md:py-12 border-y border-white/5">
                    {Object.entries(project.spec || {}).map(([key, value]) => (
                      <div key={key} className="space-y-4">
                        <p className="text-[#FFCC00] text-[8px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-mono font-black">{key}</p>
                        <p className="text-white text-[12px] uppercase tracking-widest font-mono font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {project.stack.map((tech) => (
                      <span key={tech} className="text-white text-[9px] font-mono uppercase tracking-[0.3em] bg-white/[0.05] border border-white/10 px-4 py-2 hover:border-[#FFB000]/40 hover:text-[#FFB000] transition-all">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-8 md:gap-16 pt-10 md:pt-12 border-t border-white/5">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-6"
                      >
                        <div className="w-12 h-12 border border-[#FFB000]/20 flex items-center justify-center group-hover/link:bg-[#FFB000] group-hover/link:text-black transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#FFB000] text-[10px] uppercase tracking-[0.25em] md:tracking-[0.4em] font-mono font-black">ACCESS_CORE</span>
                          <span className="text-white/80 text-[8px] font-mono tracking-widest">ENCRYPTED_ENTRY</span>
                        </div>
                      </a>
                    )}
                    <Link
                      to={`/portfolio/${project.id}`}
                      className="group/link flex items-center gap-6"
                    >
                      <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover/link:border-white/40 transition-all">
                        <Database className="w-4 h-4 text-white/40" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-[10px] uppercase tracking-[0.25em] md:tracking-[0.4em] font-mono font-black">MANIFESTO</span>
                        <span className="text-[#FFB000] text-[8px] font-mono tracking-widest">FULL_TECH_SPECS</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {hasImage && (
                  <div className="lg:col-span-5 relative">
                    <TiltCard intensity={12}>
                      <button
                        onClick={() => onImageClick(project.image, project.title)}
                        className="relative w-full aspect-[3/4] bg-[#0a0a0a] border border-white/10 overflow-hidden cursor-zoom-in group/img shadow-2xl"
                      >
                        <img
                          src={project.image}
                          alt=""
                          className={cn(
                            'w-full h-full',
                            (project.imageFit === 'contain' || project.id === 'scoutbridge') ? 'object-contain p-12' : 'object-cover'
                          )}
                        />
                        <Viewfinder />

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 md:opacity-0 md:group-hover/img:opacity-100 transition-all duration-700">
                          <div className="bg-black/80 backdrop-blur-md border border-[#FFB000]/40 p-6 rounded-full">
                            <ZoomIn className="w-8 h-8 text-[#FFB000]" />
                          </div>
                        </div>
                      </button>
                    </TiltCard>
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
