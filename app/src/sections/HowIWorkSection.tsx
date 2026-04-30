import { motion } from 'framer-motion';
import SectionLabel from '../components/ui/SectionLabel';
import TextReveal from '../components/ui/TextReveal';
import TiltCard from '../components/ui/TiltCard';
import ParallaxImage from '../components/ui/ParallaxImage';

export default function HowIWorkSection() {
  return (
    <section className="bg-[#111] overflow-hidden relative z-10 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[90vh]">
        
        {/* Portrait — Enlarged and refined background */}
        <div className="flex items-center justify-center p-6 md:p-12 bg-[radial-gradient(circle_at_center,_#0a0a0a_0%,_#000_100%)] border-r border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] technical-grid pointer-events-none" />
          
          <TiltCard intensity={25} className="w-full md:max-w-xl">
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#0a0a0a] border border-white/10 group shadow-2xl rounded-sm">
              <ParallaxImage 
                src="/images/home-portrait.png" 
                containerClassName="w-full h-full"
                className="object-top filter grayscale contrast-[1.15] brightness-90 group-hover:brightness-105 transition-all duration-700"
                offset={40}
              />
              
              {/* Technical Overlays */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] technical-grid" />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FFB000]/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FFB000]/40" />
              
              {/* Status Label */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFB000] animate-pulse" />
                <span className="text-[8px] font-mono text-[#FFB000]/60 uppercase tracking-widest">Live_Feed_Encrypted</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Text — vertically centered */}
        <div className="flex flex-col justify-center px-10 md:px-20 py-16 md:py-24">
          <div className="mb-12">
            <SectionLabel number={4} className="mb-8">How_I_Work</SectionLabel>
            
            <h2 className="font-serif text-white leading-[1.05] tracking-tighter" style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
              <TextReveal text="EVERY PROJECT" /> <br />
              <TextReveal text="IS A SYSTEM —" delay={0.2} /> <br />
              <span className="text-white/40 italic"><TextReveal text="WITH INPUTS." delay={0.4} /></span>
            </h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="border-l border-[#FFB000]/30 pl-8 mt-4 max-w-xl"
          >
            <p className="text-[#888] text-lg md:text-xl leading-relaxed font-light">
              Approaching each one like an engineering problem wrapped in a creative brief. From structural web applications to immersive visual brand strategy, the method stays the same: understand the mechanism, find the emotion, build until the two are indistinguishable.
            </p>
            
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
              className="h-px bg-[#FFB000]/30 mt-10" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
