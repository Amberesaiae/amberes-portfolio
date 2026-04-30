import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects, services } from '../data/projects';
import Badge from '../components/ui/StatusBadge';
import SectionLabel from '../components/ui/SectionLabel';
import TextReveal from '../components/ui/TextReveal';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';



function ServiceRow({ title, index }: { title: string; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="service-row flex items-center justify-between py-6 border-b border-[#222] group cursor-default"
    >
      <h3 className="font-serif text-white text-xl md:text-3xl tracking-tight group-hover:text-[#FFB000] transition-colors duration-500">
        {title}
      </h3>
      <span className="text-[#555] text-sm font-mono">
        ({String(index + 1).padStart(1, '0')})
      </span>
    </motion.div>
  );
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      className="w-full mb-32 md:mb-48"
    >
      <Link to={`/portfolio/${project.id}`} className="block group">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* Media Column */}
          <div className="md:col-span-7">
            <div className={`relative aspect-[16/10] overflow-hidden border border-[#222] group-hover:border-[#FFB000]/30 transition-colors duration-700 ${project.imageFit === 'contain' ? 'bg-[#111]' : 'bg-[#0d0d0d]'}`}>
              {project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full ${project.imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'} transition-transform duration-700 group-hover:scale-105`}
                />
              )}
              <div className="absolute top-4 left-4">
                <Badge variant={project.status === 'shipped' ? 'shipped' : project.status === 'experiment' ? 'experiment' : 'in-progress'}>
                  {project.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="md:col-span-5 pt-2 md:pt-4">
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 flex-wrap">
              <span className="text-[#555] text-[9px] uppercase tracking-[0.4em] font-mono">
                REF_{project.id.toUpperCase().replace(/-/g, '_')}
              </span>
              <span className="text-[#333]">/</span>
              <span className="text-[#555] text-[9px] uppercase tracking-[0.4em] font-mono">
                {project.year}
              </span>
            </div>

            <h3 className="font-serif text-white text-3xl sm:text-4xl md:text-6xl tracking-tight group-hover:text-[#FFB000] transition-colors duration-500 uppercase mb-6 md:mb-8 leading-tight">
              <TextReveal text={project.title} />
            </h3>

            <p className="text-[#888] text-base leading-relaxed mb-8 md:mb-10 italic font-serif">
              "{project.description}"
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.stack.slice(0, 4).map((tech, i) => (
                <span 
                  key={i} 
                  className="text-[#555] text-[8px] uppercase tracking-[0.2em] font-mono px-2 py-1 border border-[#222]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[#FFB000] text-[10px] uppercase tracking-[0.4em] font-mono group-hover:gap-6 transition-all duration-500">
              EXPLORE_PROJECT <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SelectedWorksSection() {
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <section className="bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Decorative "Grid" */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] technical-grid" />
      
      {/* ── SERVICES INDEX ── */}
      <div className={`${PADX.page} ${PADY.large} ${CONTAINER.content} ${CENTER} border-b ${BORDER_SUBTLE}`}>
        <div className="mb-12">
          <SectionLabel number={1}>Services</SectionLabel>
          <div className="border-t border-[#222]">
            {services.map((service, i) => (
              <ServiceRow key={service.title} title={service.title} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED PROJECTS - VERTICAL SCROLL ── */}
      <div className={`${PADX.page} ${PADY.large} ${CONTAINER.content} ${CENTER}`}>
        <div className="mb-24">
          <SectionLabel number={2} className="mb-6">Selected Work</SectionLabel>
          <h2 className="font-serif text-white text-4xl sm:text-5xl md:text-8xl leading-[0.85]">
            SHIPPED <br />
            <span className="italic text-[#FFB000]/80">SYSTEMS</span>
          </h2>
        </div>

        <div className="space-y-12">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Footer */}
        <div className={`pt-24 flex flex-col items-center border-t ${BORDER_SUBTLE}`}>
          <Link 
            to="/portfolio" 
            className="group flex flex-col items-center gap-8"
          >
            <div className="w-24 h-24 rounded-full border border-[#FFB000]/30 flex items-center justify-center group-hover:bg-[#FFB000] group-hover:border-[#FFB000] transition-all duration-500">
              <ArrowRight className="w-8 h-8 text-[#FFB000] group-hover:text-[#111] transition-colors duration-500" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.5em] font-mono text-[#555] group-hover:text-[#FFB000] transition-colors">
              ENTER_FULL_ARCHIVE
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
