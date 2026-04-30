import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, Anchor } from 'lucide-react';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';
import SectionLabel from './ui/SectionLabel';

const REASONS = [
  {
    icon: Anchor,
    title: "Marine-Grade Standards",
    desc: "Bringing the sub-millimeter precision of engine room maintenance to digital architecture. Zero margin for error, every time."
  },
  {
    icon: Cpu,
    title: "System Intelligence",
    desc: "Not just building websites, but engineering autonomous digital environments optimized at the kernel level."
  },
  {
    icon: Zap,
    title: "High-Performance Core",
    desc: "Bespoke assembly of efficient code and technical rigor. Built for speed, resilience, and industrial-scale traffic."
  },
  {
    icon: ShieldCheck,
    title: "Mission Critical",
    desc: "Systems designed to withstand 'deep waters'. Security and stability are baked into the foundation, not added later."
  }
];

export default function WhyAmber() {
  return (
    <section className={`${PADY.large} ${PADX.page} bg-[#0d0d0d] relative overflow-hidden border-t ${BORDER_SUBTLE}`}>
      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none technical-grid" />
      
      <div className={`${CONTAINER.wide} ${CENTER} relative z-10`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-20">
          <div className="space-y-4">
            <SectionLabel number={5}>Why_Amber</SectionLabel>
            <h2 className="font-serif text-white text-5xl md:text-7xl leading-tight">
              WHY <span className="italic text-[#FFB000]/80">AMBER?</span>
            </h2>
          </div>
          <p className="text-[#555] text-sm md:text-base max-w-sm font-mono uppercase tracking-wider leading-relaxed">
            The intersection of industrial precision and elite digital craft.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border ${BORDER_SUBTLE}`}>
          {REASONS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0d0d0d] p-6 md:p-10 space-y-6 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="w-12 h-12 border border-[#FFB000]/20 flex items-center justify-center text-[#FFB000] group-hover:border-[#FFB000] transition-colors">
                <item.icon size={20} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h3 className="text-white font-serif text-xl group-hover:text-[#FFB000] transition-colors">{item.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed font-mono">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
