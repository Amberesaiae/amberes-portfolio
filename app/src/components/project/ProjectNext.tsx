import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TextReveal from '../ui/TextReveal';
import ParallaxImage from '../ui/ParallaxImage';
import type { ProjectData } from '../../data/projects';

export default function ProjectNext({ nextProject }: { nextProject: ProjectData }) {
  return (
    <section className="border-t border-white/5 px-4 sm:px-6 md:px-10 py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <ParallaxImage src={nextProject.image} offset={200} />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[#555] text-[9px] uppercase tracking-[0.25em] md:tracking-[0.4em] mb-6 font-mono"
        >
          Continue_Transmission
        </motion.span>
        <Link
          to={`/portfolio/${nextProject.id}`}
          className="group flex flex-col items-center"
        >
          <h2
            className="font-serif text-white text-center group-hover:text-[#FFB000] transition-colors duration-700 mb-8 tracking-tighter"
            style={{ fontSize: 'clamp(32px, 6vw, 80px)', lineHeight: 1 }}
          >
            <TextReveal text={nextProject.title} />
          </h2>
          <div className="flex items-center gap-4 text-[#888] text-[10px] uppercase tracking-[0.2em] md:tracking-[0.5em] font-mono group-hover:text-[#FFB000] transition-colors duration-300">
            <span className="h-px w-8 bg-current opacity-30" />
            VIEW CASE STUDY
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-2" />
          </div>
        </Link>
      </div>
    </section>
  );
}
