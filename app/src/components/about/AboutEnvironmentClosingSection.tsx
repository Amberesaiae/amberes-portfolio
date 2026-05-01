import { motion } from 'framer-motion';
import Footer from '../Footer';
import InfluenceMarquee from '../InfluenceMarquee';
import TextReveal from '../ui/TextReveal';
import ParallaxImage from '../ui/ParallaxImage';
import SectionLabel from '../ui/SectionLabel';
import AboutSocialLinks from './AboutSocialLinks';
import { environmentItems, mantisTraits } from './aboutData';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../../styles/layoutTokens';

export default function AboutEnvironmentClosingSection() {
  return (
    <>
      {/* ── THE ENVIRONMENT ── */}
      <section className={`bg-black border-y ${BORDER_SUBTLE} overflow-hidden ${PADX.page} py-12 md:py-16`}>
        <div className={`${CONTAINER.content} ${CENTER}`}>
          <div className="space-y-10 md:space-y-12">
            <div className="space-y-3 md:pl-0">
              <p className="text-[#FFB000]/60 text-[9px] uppercase tracking-[0.25em] md:tracking-[0.5em] font-mono">System_Environment</p>
              <h2 className="font-serif text-white leading-[0.95]" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
                <TextReveal text="THE ENVIRONMENT." />
              </h2>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} className="h-px w-16 bg-[#FFB000]/30 mt-4 origin-left" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/5">
              {environmentItems.map((item, i) => (
                <motion.div key={item.key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group flex items-start gap-8 py-7 border-b border-white/5 md:odd:border-r md:odd:pr-12 md:even:pl-12 hover:border-[#FFB000]/20 transition-all duration-300">
                  <span className="font-mono text-[#FFB000] text-[11px] font-bold uppercase tracking-[0.25em] w-24 flex-shrink-0 pt-0.5">{item.key}</span>
                  <span className="font-mono text-white/80 text-[12px] leading-relaxed group-hover:text-white transition-colors duration-300">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InfluenceMarquee />

      {/* ── MANTIS SHRIMP ── */}
      <section className={`${PADX.page} ${PADY.large} border-b ${BORDER_SUBTLE} relative overflow-hidden`}>
        <div className={`${CONTAINER.content} ${CENTER} relative z-10`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <ParallaxImage src="/images/mantis-front.jpg" containerClassName="w-full h-full aspect-[3/4] rounded-sm" offset={20}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <p className="absolute bottom-4 left-4 text-white text-[10px] uppercase tracking-widest">Odontodactylus scyllarus</p>
              </ParallaxImage>
            </div>

            <div className="md:col-span-7">
              <SectionLabel number={8}>A Parallel</SectionLabel>
              <h2 className="font-serif text-white leading-tight mb-6" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
                <TextReveal text="THE MANTIS" /> <br />
                <TextReveal text="SHRIMP" delay={0.3} />
              </h2>
              <div className="md:pl-0">
                <p className="text-[#999] text-base leading-relaxed mb-10">Small in size. Extraordinary in capability. The mantis shrimp is one of the most complex organisms in the ocean — and one of the most instructive.</p>

                <div className="space-y-0 border-t border-white/5">
                  {mantisTraits.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="attr-item grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-5 border-b border-white/5">
                      <div className="md:col-span-3">
                        <span className="font-serif text-[#FFCC00] text-xl font-bold">{item.stat}</span>
                        <p className="text-[#FFB000]/60 text-xs uppercase tracking-wider mt-1">{item.label}</p>
                      </div>
                      <p className="md:col-span-9 text-white/80 text-sm leading-relaxed self-center">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCRIPTURE ── */}
      <section className={`relative py-20 md:py-32 overflow-hidden`}>
        <img
          src="/images/lilies-bright.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#111]/40" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className={`relative z-10 ${CONTAINER.narrow} ${CENTER} text-center ${PADX.page}`}
        >
          <p className="text-[#555] text-xs uppercase tracking-[0.4em] mb-10">A Guiding Word</p>
          <blockquote
            className="font-serif text-white leading-[1.3] mb-8"
            style={{ fontSize: 'clamp(22px, 3.5vw, 40px)' }}
          >
            "Consider the lilies, how they grow: they neither toil nor spin; and yet I say to you, even Solomon in all his glory was not arrayed like one of these."
          </blockquote>
          <cite className="text-[#FFB000] text-sm uppercase tracking-[0.3em] not-italic">
            Luke 12:27
          </cite>
        </motion.div>
      </section>

      {/* ── THE BUILDER ── */}
      <section className={`${PADX.page} ${PADY.header} pb-12`}>
        <div className={`${CONTAINER.content} ${CENTER}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="space-y-10 text-center md:text-left">
                <div className="space-y-6">
                  <div className="flex justify-center md:justify-start">
                    <SectionLabel number={7}>The Builder</SectionLabel>
                  </div>
                  <h2 className="font-serif text-white text-4xl sm:text-5xl md:text-7xl leading-tight">
                    <TextReveal text="SKILL." /> <br />
                    <span className="inline-block">
                      <TextReveal text="B" delay={0.2} />
                      <TextReveal text="RAIN." delay={0.2} className="text-[#FFB000]" />
                    </span> <br />
                    <span className="inline-block">
                      <TextReveal text="HE" delay={0.4} />
                      <TextReveal text="ART." delay={0.4} className="text-[#FFB000]" />
                    </span>
                  </h2>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: 96 }} viewport={{ once: true }} className="h-[1px] bg-[#FFB000]/30 mx-auto md:mx-0" />
                </div>
                <div className="flex justify-center md:justify-start">
                  <AboutSocialLinks />
                </div>
              </div>
            </div>

            <div className="md:col-span-7 order-1 md:order-2">
              <div className="relative w-full aspect-square overflow-hidden rounded-sm">
                <img
                  src="/images/portrait.png"
                  alt="Isaiah Amber portrait"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer showFull={false} />
    </>
  );
}
