import { motion } from 'framer-motion';
import SectionLabel from '../ui/SectionLabel';
import TextReveal from '../ui/TextReveal';
import { education, experience } from './aboutData';
import { CONTAINER, CENTER, PADX, PADY } from '../../styles/layoutTokens';

export default function AboutFormationSection() {
  return (
    <>
      {/* ── EDUCATION ── */}
      <section className={`${PADX.page} pt-4 pb-20 md:py-32`}>
        <div className={`${CONTAINER.content} ${CENTER}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-3">
              <SectionLabel number={6}>Formation</SectionLabel>
            </div>
            <div className="md:col-span-9">
              <h2 className="font-serif text-white" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
                <TextReveal text="EDUCATION" />
              </h2>
            </div>
          </div>

          <div className="border-t border-white/5">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-12 gap-4 py-7 border-b border-white/5"
              >
                <span className="col-span-3 md:col-span-2 text-[#777] text-xs font-black uppercase tracking-[0.2em] pt-1">
                  {edu.period}
                </span>
                <div className="col-span-9 md:col-span-10">
                  <span className="text-white font-bold text-base uppercase tracking-wider block mb-1 group-hover:text-[#FFB000] transition-colors">
                    {edu.school}
                  </span>
                  <span className="text-[#aaa] text-sm font-medium">{edu.degree}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className={`${PADX.page} ${PADY.large} bg-[#0d0d0d]`}>
        <div className={`${CONTAINER.content} ${CENTER}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-3">
              <SectionLabel number={7}>Track Record</SectionLabel>
            </div>
            <div className="md:col-span-9">
              <h2 className="font-serif text-white" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
                <TextReveal text="EXPERIENCE" />
              </h2>
            </div>
          </div>

          <div className="border-t border-white/5">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-12 gap-4 py-7 border-b border-white/5"
              >
                <span className="col-span-3 md:col-span-2 text-[#777] text-xs font-black uppercase tracking-[0.2em] pt-1">
                  {exp.period}
                </span>
                <div className="col-span-9 md:col-span-10">
                  <span className="text-white font-bold text-base uppercase tracking-wider block mb-1 group-hover:text-[#FFB000] transition-colors">
                    {exp.role}
                  </span>
                  <span className="text-[#FFB000] text-xs font-black uppercase tracking-[0.25em] block mb-3">
                    {exp.company}
                  </span>
                  <span className="text-[#aaa] text-sm leading-relaxed block max-w-2xl">{exp.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
