import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionLabelProps {
  number: string | number;
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ number, children, className }: SectionLabelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn("flex items-start gap-4 md:gap-6 mb-8", className)}
    >
      <div className="flex items-center gap-2 md:gap-3 shrink-0 pt-1.5">
        <span className="text-[#666] text-[10px] md:text-[11px] font-mono font-bold w-4 md:w-8 text-right">
          {String(number).padStart(2, '0')}
        </span>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "circOut" }}
          className="w-4 md:w-10 h-[1px] bg-white/10 origin-left shrink-0"
        />
      </div>
      <p className="text-[#aaa] text-[10px] md:text-[11px] uppercase tracking-[0.35em] md:tracking-[0.5em] font-bold leading-relaxed pt-1 pl-1 md:pl-0">
        {children}
      </p>
    </motion.div>
  );
}
