import { motion } from 'framer-motion';
import TextReveal from '../ui/TextReveal';
import ParallaxImage from '../ui/ParallaxImage';
import SectionLabel from '../ui/SectionLabel';
import { disciplines } from './aboutData';
import { CONTAINER, CENTER, PADX, PADY } from '../../styles/layoutTokens';

export default function AboutDisciplinesSection() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative h-[80vh] md:h-screen">
          <ParallaxImage
            src="/images/whales-aerial.jpg"
            containerClassName="w-full h-full"
            className="grayscale-0"
            offset={100}
          />
          {/* Removed dark overlay */}
          <div className="absolute bottom-20 left-6 md:left-16 right-6 md:right-10 z-20">
            <SectionLabel number={3} className="mb-6">Life at Sea</SectionLabel>
            <p className="font-serif text-white max-w-2xl leading-tight" style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>
              <TextReveal text='"The ocean does not care about your credentials. It only responds to competence."' />
            </p>
            <div className="h-px w-32 bg-[#FFB000]/50 mt-8" />
          </div>
        </div>
      </section>

      <section className={`${PADX.page} ${PADY.large}`}>
        <div className={`${CONTAINER.content} ${CENTER}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-3"><SectionLabel number={4}>Disciplines</SectionLabel></div>
            <div className="md:col-span-9">
              <h2 className="font-serif text-white leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
                <TextReveal text="WHAT I DO" />
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
            <div className="overflow-hidden">
              <ParallaxImage src="/images/ship-piston.jpg" containerClassName="w-full h-full aspect-[3/4]" className="" offset={10}>
                <p className="absolute bottom-4 left-4 text-white text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold opacity-80">Marine Engineering</p>
              </ParallaxImage>
            </div>

            <div className="overflow-hidden">
              <ParallaxImage src="/images/shipyard-welder.jpg" containerClassName="w-full h-full aspect-[3/4]" className="" offset={10}>
                <p className="absolute bottom-4 left-4 text-white text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold opacity-80">Welding & Fabrication</p>
              </ParallaxImage>
            </div>

            <div className="hidden md:block overflow-hidden">
              <ParallaxImage src="/images/ship-cabin-large.jpg" containerClassName="w-full h-full aspect-[3/4]" className="" offset={10}>
                <p className="absolute bottom-4 left-4 text-white text-[9px] uppercase tracking-[0.3em] font-semibold opacity-80">Life at Sea</p>
              </ParallaxImage>
            </div>
          </div>

          <div className="border-t border-[#222]">
            {disciplines.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="disc-row grid grid-cols-12 gap-4 py-7 border-b border-[#222] group">
                <span className="col-span-1 text-[#555] text-xs font-semibold pt-1">{d.number}</span>
                <div className="col-span-11 md:col-span-4"><span className="text-white font-semibold text-sm uppercase tracking-wider group-hover:text-[#FFB000] transition-colors duration-300">{d.title}</span></div>
                <p className="col-span-11 md:col-span-7 text-[#888] text-sm leading-relaxed md:col-start-6">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative overflow-hidden ${PADY.large}`}>
        <div className={`${CONTAINER.content} ${CENTER} ${PADX.page} grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center`}>
          <div className="overflow-hidden">
            <ParallaxImage src="/images/mindset-new.png" containerClassName="w-full h-full aspect-[3/4] rounded-sm" className="" offset={20} />
          </div>
          <div>
            <SectionLabel number={5}>Mindset</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-serif text-white leading-tight mb-8"
              style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
            >
              THE<br />ARCHITECTURE<br />OF THOUGHT
            </motion.h2>
            <div className="space-y-8 text-[#999] text-base md:text-lg leading-relaxed max-w-2xl">
              <p>Building systems requires a conversation between the machine and the soul. Chess provides the strategy of consequences; Farming, the patience of the seasons. Welding demands the precision of heat—knowing that one wrong move warps the whole structure.</p>
              <p>There is a rhythm found in the divine order of sound and the heartbeat behind the words of a great book. Literature is life, and every designed system is a story waiting to be told.</p>
              <p className="text-sm uppercase tracking-widest font-semibold">
                <span className="text-[#FFB000]">Skill. B</span><span className="text-white">RAIN</span><span className="text-[#FFB000]">. HE</span><span className="text-white">ART</span><span className="text-[#FFB000]">.</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
