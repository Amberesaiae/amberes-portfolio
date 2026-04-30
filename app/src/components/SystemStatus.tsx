import { motion } from 'framer-motion';
import Terminal from './Terminal';
import TextReveal from './ui/TextReveal';
import SectionLabel from './ui/SectionLabel';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';

export default function SystemStatus() {
  return (
    <section className={`min-h-screen flex items-center justify-center ${PADY.large} ${PADX.page} bg-[#0a0a0a] relative overflow-hidden`}>
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className={`${CONTAINER.wide} ${CENTER} relative z-10`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Left: Terminal (Main focus) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 h-[650px] lg:h-[750px] relative z-10"
          >
            <Terminal />
          </motion.div>

          {/* Right: Section Info & Meta */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <SectionLabel number={6}>System_Interface</SectionLabel>

              <h2 className="font-serif text-white text-5xl lg:text-8xl leading-[0.85] tracking-tighter">
                <TextReveal text="SYSTEM" /> <br />
                <span className="italic text-[#FFB000]"><TextReveal text="RECORDS." delay={0.3} /></span>
              </h2>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 120 }}
                viewport={{ once: true }}
                className="h-px bg-[#FFB000]/40"
              />

              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md font-mono uppercase tracking-wider">
                Verification of digital integrity and system parameters. Every line of code is a reflection of the architectural core.
              </p>
            </div>

            {/* Metadata Grid */}
            <div className={`grid grid-cols-2 gap-y-10 gap-x-12 pt-12 border-t ${BORDER_SUBTLE}`}>
              {[
                { label: 'KERNEL_VERSION', value: 'ARCH_6.X_REFINED' },
                { label: 'BUILD_STATE', value: 'IMMUTABLE', highlight: true },
                { label: 'AUTH_PROTOCOL', value: 'P-SHA-256' },
                { label: 'LATENCY', value: '0.002ms' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="space-y-2 group"
                >
                  <p className="text-[#FFB000]/60 group-hover:text-[#FFB000] text-[9px] uppercase tracking-[0.4em] font-bold font-mono transition-colors">
                    {item.label}
                  </p>
                  <p className={`text-[11px] uppercase tracking-[0.3em] font-mono font-bold ${item.highlight ? 'text-[#FFB000]' : 'text-white'}`}>
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
