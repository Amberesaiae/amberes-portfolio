import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../ui/StatusBadge';
import TextReveal from '../ui/TextReveal';
import ParallaxImage from '../ui/ParallaxImage';
import { cn } from '@/lib/utils';
import type { ProjectData } from '../../data/projects';
import { CONTAINER, CENTER } from '../../styles/layoutTokens';

export default function ProjectHero({ project }: { project: ProjectData }) {
  return (
    <>
      <Link
        to="/portfolio"
        className="fixed top-20 md:top-24 left-4 sm:left-6 md:left-10 z-40 text-[#888] flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-white transition-colors duration-300 min-h-11"
      >
        <ArrowLeft className="w-3 h-3" /> BACK
      </Link>

      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-[#0d0d0d]">
        {project.omitImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="w-24 h-[1px] bg-[#FFB000]/20 mb-8"
            />
            <span className="text-[#333] text-[10px] md:text-[12px] font-mono uppercase tracking-[0.25em] md:tracking-[0.5em] text-center px-6 md:px-10 leading-[2.2] md:leading-[3]">
              // SYSTEM_VISUALS_REDACTED<br />
              // PROJECT_STATUS_SHIPPED<br />
              // ACCESS_RESTRICTED_PROTOCOL_7
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="w-24 h-[1px] bg-[#FFB000]/20 mt-8"
            />
          </div>
        ) : (
          <ParallaxImage
            src={project.image}
            videoSrc={project.video}
            containerClassName="w-full h-full"
            className={cn(
              'w-full h-full object-top',
              project.imageFit === 'contain' ? 'object-contain p-12' : 'object-cover'
            )}
            offset={100}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent opacity-90 z-10" />
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20" />

        <div className="absolute bottom-12 left-6 md:left-10 right-6 md:right-10 z-30">
          <div className={`${CONTAINER.content} ${CENTER}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-4"
            >
              <span className="text-[#555] text-[9px] uppercase tracking-[0.25em] md:tracking-[0.4em] font-mono">
                REF_{project.id.toUpperCase().replace(/-/g, '_')}
              </span>
              <span className="text-[#333]">—</span>
              <Badge variant={project.status === 'shipped' ? 'shipped' : project.status === 'experiment' ? 'experiment' : 'in-progress'}>
                {project.status.toUpperCase()}
              </Badge>
            </motion.div>
            <h1
              className="font-serif text-white tracking-tighter"
              style={{ fontSize: 'clamp(40px, 8vw, 120px)', lineHeight: 0.9 }}
            >
              <TextReveal text={project.title} />
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}
