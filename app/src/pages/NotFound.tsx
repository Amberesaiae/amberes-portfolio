import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen flex items-center justify-center p-6 scanline-effect">
      <div className="max-w-md w-full space-y-10 md:space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 border border-[#ff4d4d]/20 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#ff4d4d]/5 animate-pulse" />
            <AlertTriangle className="text-[#ff4d4d] w-10 h-10" />
          </div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-white font-serif text-5xl tracking-tighter">
            ERROR_<span className="text-[#ff4d4d]">404</span>
          </h1>
          <p className="text-[#444] text-[10px] uppercase tracking-[0.22em] md:tracking-[0.5em] font-mono">
            DATA_INTEGRITY_COMPROMISED // PATH_NOT_FOUND
          </p>
        </div>

        <div className="h-24 font-mono text-[9px] text-[#333] space-y-1 text-left bg-black/50 p-6 border border-white/5">
          <div>[CRITICAL] SEGMENTATION_FAULT AT 0x00404</div>
          <div>[WARNING] ARCHIVE_RECOVERY_FAILED</div>
          <div>[INFO] REDIRECTING_TO_CORE_TERMINAL...</div>
        </div>

        <Link 
          to="/"
          className="inline-flex items-center gap-4 group text-[#FFB000] hover:text-white transition-all pt-8"
        >
          <div className="w-10 h-10 border border-[#FFB000]/30 flex items-center justify-center group-hover:border-white transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-xs font-mono uppercase tracking-[0.22em] md:tracking-[0.5em]">Return_to_Nexus</span>
        </Link>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-10 left-10 opacity-10 text-[8px] font-mono uppercase tracking-widest vertical-text">
        SYSTEM_FAILURE_DETECTION
      </div>
    </main>
  );
}
