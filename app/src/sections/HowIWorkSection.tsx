import { motion } from 'framer-motion';
import SectionLabel from '../components/ui/SectionLabel';
import TextReveal from '../components/ui/TextReveal';
import ParallaxImage from '../components/ui/ParallaxImage';
import { BORDER_SUBTLE } from '../styles/layoutTokens';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Diagnose',
    desc: 'Strip the brief to its core system. Constraints, audience, failure modes. No assumptions.',
  },
  {
    number: '02',
    title: 'Architect',
    desc: 'Map the full structure first. Systems thinking for code and visual language alike.',
  },
  {
    number: '03',
    title: 'Execute',
    desc: 'Precision over speed. Purpose-built components, rigorously tested, system-aligned.',
  },
  {
    number: '04',
    title: 'Refine',
    desc: 'Iterate until mechanism and emotion merge. Industrial standard. No rough edges.',
  },
];

export default function HowIWorkSection() {
  return (
    <section className={`bg-[#111] overflow-hidden relative z-10 border-t border-b ${BORDER_SUBTLE}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">

        {/* LEFT — Portrait */}
        <div className="relative flex items-center justify-center p-8 md:p-16 bg-[radial-gradient(circle_at_center,_#0a0a0a_0%,_#000_100%)] border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
          {/* Technical Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] technical-grid pointer-events-none" />

          {/* Portrait Card — no tilt, static */}
          <div className="relative w-full max-w-lg aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-white/10 group shadow-2xl rounded-sm">
            <ParallaxImage
              src="/images/home-portrait.png"
              containerClassName="w-full h-full"
              className="object-top filter grayscale contrast-[1.15] brightness-90 group-hover:brightness-105 transition-all duration-700"
              offset={40}
            />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] technical-grid" />

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#FFB000]/40" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#FFB000]/40" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#FFB000]/40" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#FFB000]/40" />

            {/* Status Label */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFB000] animate-pulse" />
              <span className="text-[8px] font-mono text-[#FFB000]/60 uppercase tracking-widest">Live_Feed_Encrypted</span>
            </div>
          </div>

          {/* Floating label — top-left of column */}
          <div className={`hidden md:block absolute top-8 left-8 md:top-12 md:left-12`}>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em]">SUBJECT_001 // AMBER.ESA</p>
          </div>
        </div>

        {/* RIGHT — Process List */}
        <div className="flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
          <div className="mb-8 lg:mb-10">
            <SectionLabel number={5} className="mb-6">How_I_Work</SectionLabel>

            <h2
              className="font-serif text-white leading-[1.0] tracking-tighter"
              style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
            >
              <TextReveal text="EVERY PROJECT" />
              <br />
              <TextReveal text="IS A SYSTEM —" delay={0.2} />
              <br />
              <span className="text-white/35 italic">
                <TextReveal text="WITH INPUTS." delay={0.4} />
              </span>
            </h2>
          </div>

          {/* Process Steps */}
          <div className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex gap-6 md:gap-8 py-5 lg:py-6 border-t ${BORDER_SUBTLE} last:border-b last:${BORDER_SUBTLE}`}
              >
                {/* Step number */}
                <div className="flex-shrink-0 pt-0.5">
                  <span className="font-mono text-[10px] text-[#FFB000]/40 group-hover:text-[#FFB000] transition-colors duration-500 tracking-[0.3em]">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    {/* Accent line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'circOut' }}
                      className="w-6 h-px bg-[#FFB000]/30 group-hover:bg-[#FFB000]/60 transition-colors duration-500 origin-left flex-shrink-0"
                    />
                    <h3 className="font-serif text-white text-lg md:text-xl tracking-tight group-hover:text-[#FFB000] transition-colors duration-500">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white/55 text-sm md:text-base leading-relaxed font-mono group-hover:text-white/70 transition-colors duration-500">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
