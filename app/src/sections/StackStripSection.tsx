import { motion } from 'framer-motion';
import { environmentItems } from '../components/about/aboutData';
import { CONTAINER, CENTER, PADX, PADY, BORDER_SUBTLE } from '../styles/layoutTokens';

export default function StackStripSection() {
  return (
    <section className={`border-t border-b ${BORDER_SUBTLE} ${PADY.medium} ${PADX.page} overflow-hidden`}>
      <div className={`${CONTAINER.wide} ${CENTER}`}>
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[#FFB000]/50 font-mono text-[9px] uppercase tracking-[0.5em]">System_Environment</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-t border-white/5">
          {environmentItems.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`group border-b md:border-b-0 border-r ${BORDER_SUBTLE} px-5 py-6 last:border-r-0 hover:bg-white/[0.02] transition-colors duration-300`}
            >
              <p className="text-[#FFB000] font-mono text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{item.key}</p>
              <p className="text-white/40 font-mono text-[10px] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
