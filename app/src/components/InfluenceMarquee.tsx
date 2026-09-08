import { motion } from 'framer-motion';
import { CONTAINER, CENTER, PADX } from '../styles/layoutTokens';

const categories = [
  {
    title: 'Theology & Spirit',
    authors: ['Arthur Pink', 'Charles Spurgeon', 'A.W. Tozer', 'Derek Prince', 'John Bunyan']
  },
  {
    title: 'Poetry & Prose',
    authors: ['William Blake', 'Robert Frost', 'Shakespeare', 'Osamu Dazai']
  },
  {
    title: 'Narrative & Light',
    authors: ['C.S. Lewis', 'Hannah Hurnard', 'Pilgrim\'s Progress', 'Mere Christianity']
  }
];

export default function InfluenceMarquee() {
  return (
    <div className={`py-20 bg-[#0a0a0a] border-y border-white/5`}>
      <div className={`${CONTAINER.content} ${CENTER} ${PADX.page}`}>
        
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-8">
          <div className="flex items-baseline gap-4">
            <h2 className="font-serif text-white text-3xl md:text-5xl">
              THE LIBRARY
            </h2>
            <p className="text-[#FFB000]/60 text-[10px] uppercase tracking-[0.4em] font-black">Internal Architecture</p>
          </div>
          <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-serif italic max-w-xs md:text-right">
            "Literature is life."
          </p>
        </div>

        <div className="space-y-16">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[#333] text-[9px] uppercase tracking-[0.4em] whitespace-nowrap font-black">
                  {cat.title}
                </span>
                <div className="h-[1px] flex-grow bg-white/5" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cat.authors.map((author, j) => (
                  <motion.div 
                    key={j} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: j * 0.08 + (i * 0.1) }}
                    className="group relative h-16 bg-[#0d0d0d] border border-white/5 flex items-center px-5 transition-all duration-500 hover:border-[#FFB000]/40 hover:bg-[#111] overflow-hidden"
                  >
                    {/* Industrial accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5 group-hover:bg-[#FFB000] transition-colors duration-500" />
                    
                    <span className="text-[#FFB000] font-serif text-base group-hover:text-white transition-all duration-500 truncate relative z-10 font-medium">
                      {author}
                    </span>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFB000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FFB000]/0 group-hover:border-[#FFB000]/20 transition-all duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
