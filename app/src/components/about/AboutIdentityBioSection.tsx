import { motion } from 'framer-motion';
import TextReveal from '../ui/TextReveal';
import ParallaxImage from '../ui/ParallaxImage';
import SectionLabel from '../ui/SectionLabel';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../../styles/layoutTokens';

export default function AboutIdentityBioSection() {
  return (
    <>
      <section className={`${PADX.page} ${PADY.large} border-y ${BORDER_SUBTLE} relative overflow-hidden`}>
        <div className={`${CONTAINER.content} ${CENTER} relative z-10`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 border border-[#FFB000]/10" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                  <ParallaxImage
                    src="/images/industrial-glow.jpg"
                    containerClassName="w-full h-full"
                    className="grayscale-0"
                    offset={20}
                  />
                </div>
                <div className="absolute bottom-4 right-4 text-[#FFB000] text-[8px] font-mono tracking-[0.5em] uppercase opacity-40">
                  SOUL_LUMEN_REF
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-12">
              <div className="space-y-4">
                <SectionLabel number={1}>Identity_Record</SectionLabel>
                <h2 className="font-serif text-white text-5xl sm:text-6xl md:text-8xl leading-none tracking-tighter pl-14 md:pl-32">
                  <TextReveal text="AMBER." />
                </h2>
              </div>

              <div className="space-y-8 pl-14 md:pl-32">
                <p className="text-white text-xl md:text-3xl font-serif italic leading-tight max-w-xl">
                  "The color of my soul. Rooted in nature, defined by clarity."
                </p>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="h-px bg-[#FFB000]/30 w-24" />
                <p className="text-white/70 text-sm md:text-lg leading-relaxed max-w-lg font-light">
                  A name with no single shore—spanning from the Arabic <span className="text-[#FFB000] italic font-black">anbar</span> to the fossilized light of ancient forests. It is the state I strive for: clear, resilient, and deeply grounded. A quiet anchor in a world of constant motion.
                </p>
              </div>

              <div className="flex gap-12 pt-6">
                <div className="space-y-1">
                  <p className="text-[#FFB000]/60 text-[9px] uppercase tracking-[0.3em] font-bold font-mono">Kernel</p>
                  <p className="text-white text-[10px] uppercase tracking-widest font-mono">Marine_Refined</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#FFB000]/60 text-[9px] uppercase tracking-[0.3em] font-bold font-mono">Status</p>
                  <p className="text-[#FFCC00] font-black text-[10px] uppercase tracking-widest font-mono">Immutable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${PADX.page} ${PADY.large}`}>
        <div className={`${CONTAINER.content} ${CENTER} grid grid-cols-1 md:grid-cols-12 gap-12 items-start`}>
          <div className="md:col-span-3">
            <SectionLabel number={2}>Identity</SectionLabel>
          </div>
          <div className="md:col-span-9 pl-14 md:pl-0">
            <p className="font-serif text-white leading-[1.25] mb-10" style={{ fontSize: 'clamp(24px, 4vw, 42px)' }}>
              <TextReveal text="THE WORK LEAVES A MARK — A WELD SEAM, A HARVEST, A VESSEL THAT CROSSES OCEANS WITHOUT FAILING." />
            </p>
            <div className="space-y-8 text-white/80 text-base md:text-lg leading-relaxed max-w-2xl">
              <p>
                Training in the engine room, where the margin for error is zero, shapes a standard of absolute precision, patience, and respect for the machine. It is a world where physics is the final authority.
              </p>

              <div className="space-y-10 pt-10">
                <blockquote className="text-white/70 italic font-serif text-lg md:text-xl border-l border-[#FFCC00] pl-6 py-2">
                  "He drew me, He drew me out of deep waters, many waters."
                  <footer className="mt-2 text-[#FFCC00] text-[10px] uppercase tracking-[0.3em] font-sans not-italic font-black">— Psalms 18</footer>
                </blockquote>

                <h3 className="text-white font-serif leading-tight border-l-2 border-[#FFB000] pl-8 py-4 whitespace-nowrap" style={{ fontSize: 'clamp(16px, 2.5vw, 40px)' }}>
                  A bondservant of Christ, <span className="text-[#FFB000]">my anchor and life.</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
