import { motion } from 'framer-motion';
import BirthdayCountdown from '../BirthdayCountdown';
import TextReveal from '../ui/TextReveal';
import ParallaxImage from '../ui/ParallaxImage';
import { PADX } from '../../styles/layoutTokens';

export default function AboutHeroSection() {
  return (
    <section className={`relative min-h-screen flex flex-col justify-end ${PADX.page} pb-16 md:pb-20 pt-28 md:pt-32 overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxImage
          src="/images/about-hero-viper.jpg"
          containerClassName="w-full h-full"
          className="opacity-40"
          offset={50}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent z-10" />

      <div className="relative z-20 max-w-6xl w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[#888] text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.5em] mb-8 font-medium"
        >
          Precision in Motion. Strength by Design.
        </motion.p>

        <h1 className="font-serif text-white leading-[0.92] mb-12" style={{ fontSize: 'clamp(44px, 10vw, 140px)' }}>
          <span className="block"><TextReveal text="MARINE ENGINEER" /></span>
          <span className="block text-[#FFB000]"><TextReveal text="& BUILDER" delay={0.4} /></span>
        </h1>

        <div className="mt-auto pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="font-serif text-[#FFB000] text-xl md:text-2xl tracking-wide leading-tight">
              Lamptey Odartei Isaiah.
            </h2>
            <p className="text-[#888] text-[10px] md:text-xs uppercase tracking-[0.22em] md:tracking-[0.4em] opacity-70 leading-relaxed">
              The Fisherman's son. <br />
              A hope to the Unseen and Unheard. <br />
              <span className="text-[#FFB000]/60">Born of the water, refined by the glow.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-end"
          >
            <div className="w-full max-w-[280px] sm:max-w-xs">
              <BirthdayCountdown />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
