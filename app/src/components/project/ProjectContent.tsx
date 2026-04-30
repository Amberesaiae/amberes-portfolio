import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectData } from '../../data/projects';
import SectionLabel from '../ui/SectionLabel';
import TextReveal from '../ui/TextReveal';
import TiltCard from '../ui/TiltCard';
import ParallaxImage from '../ui/ParallaxImage';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../../styles/layoutTokens';

export default function ProjectContent({ project }: { project: ProjectData }) {
  return (
    <div className={`${PADX.page} ${PADY.large} ${CONTAINER.content} ${CENTER}`}>
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 pb-12 md:pb-16 mb-12 md:mb-16 border-b ${BORDER_SUBTLE}`}>
        {project.spec?.role && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h4 className="text-[#555] text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] mb-2 font-mono">Role</h4>
            <p className="text-white text-sm font-mono uppercase tracking-wider">{project.spec.role}</p>
          </motion.div>
        )}
        {project.spec?.architecture && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h4 className="text-[#555] text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] mb-2 font-mono">Architecture</h4>
            <p className="text-white text-sm font-mono uppercase tracking-wider">{project.spec.architecture}</p>
          </motion.div>
        )}
        {project.spec?.deployment && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h4 className="text-[#555] text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] mb-2 font-mono">Deployment</h4>
            <p className="text-white text-sm font-mono uppercase tracking-wider">{project.spec.deployment}</p>
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4 items-end">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB000] hover:text-white transition-colors duration-300 flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono border border-[#FFB000]/20 px-3 py-2 bg-[#FFB000]/5"
            >
              <ExternalLink className="w-3 h-3" /> Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono border border-white/10 px-3 py-2 bg-white/5"
            >
              <Github className="w-3 h-3" /> Code
            </a>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 mb-16 md:mb-20">
        <div className="md:col-span-7">
          <div className="font-serif text-white text-xl md:text-3xl leading-snug mb-8">
            <TextReveal text={project.description} />
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="space-y-8">
            <div>
              <SectionLabel number={1} className="mb-4">Technical Stack</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-[#888] text-[10px] uppercase tracking-[0.12em] md:tracking-[0.2em] font-mono px-3 py-2 border border-white/5 hover:border-[#FFB000]/30 hover:text-[#FFB000] transition-all duration-300"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div>
                <SectionLabel number={2} className="mb-4">Performance_Logs</SectionLabel>
                <div className="space-y-2">
                  {project.metrics.map((metric, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-1 h-1 bg-[#FFB000] rounded-full flex-shrink-0" />
                      <span className="text-[#999] text-[11px] font-mono uppercase tracking-widest">{metric}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(project.challenge || project.solution) && (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 pt-16 border-t ${BORDER_SUBTLE}`}>
          {project.challenge && (
            <div>
              <SectionLabel number={3} className="mb-4">The Challenge</SectionLabel>
              <p className="text-[#999] text-base leading-relaxed font-mono">{project.challenge}</p>
            </div>
          )}
          {project.solution && (
            <div>
              <SectionLabel number={4} className="mb-4">The Solution</SectionLabel>
              <p className="text-[#999] text-base leading-relaxed font-mono">{project.solution}</p>
            </div>
          )}
        </div>
      )}

      {!project.omitImage && project.gallery && project.gallery.length > 0 && (
        <div className={`pt-16 border-t ${BORDER_SUBTLE}`}>
          <SectionLabel number={5} className="mb-8">Visual_Archive</SectionLabel>
          <div className={`grid gap-6 ${project.gallery.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {project.gallery.map((img, i) => (
              <TiltCard key={i} intensity={20} className={cn(
                i === 0 && project.gallery!.length === 3 ? 'md:col-span-2' : ''
              )}>
                <div className="overflow-hidden bg-[#1a1a1a] border border-white/10 aspect-video">
                  <ParallaxImage
                    src={img}
                    containerClassName="w-full h-full"
                    className="object-cover"
                    offset={30}
                  />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
