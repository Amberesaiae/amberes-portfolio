import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const LOG_LINES = [
  "Awakening system core...",
  "Loading neural pathways...",
  "Synchronizing visual state...",
  "Authenticating session...",
  "Ready."
];

const AMBER_OS_ASCII = `
 █████╗ ███╗   ███╗██████╗ ███████╗██████╗      ██████╗ ███████╗
██╔══██╗████╗ ████║██╔══██╗██╔════╝██╔══██╗    ██╔═══██╗██╔════╝
███████║██╔████╔██║██████╔╝█████╗  ██████╔╝    ██║   ██║███████╗
██╔══██║██║╚██╔╝██║██╔══██╗██╔══╝  ██╔══██╗    ██║   ██║╚════██║
██║  ██║██║ ╚═╝ ██║██████╔╝███████╗██║  ██║    ╚██████╔╝███████║
╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚══════╝`;

export default function LoadingScreen() {
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Minimum display time (1.2s) for visual impact
    const minTimeTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1200);

    const checkContentLoaded = () => {
      if (document.readyState !== 'loading') {
        setContentLoaded(true);
      }
    };

    checkContentLoaded();
    window.addEventListener('load', checkContentLoaded);

    return () => {
      clearTimeout(minTimeTimer);
      window.removeEventListener('load', checkContentLoaded);
    };
  }, []);

  useEffect(() => {
    if (minTimeElapsed && contentLoaded) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(hideTimer);
    }
  }, [minTimeElapsed, contentLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        const increment = contentLoaded ? Math.random() * 15 : Math.random() * 4;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    const lineInterval = setInterval(() => {
      setCurrentLine(prev => (prev < LOG_LINES.length - 1 ? prev + 1 : prev));
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(lineInterval);
    };
  }, [contentLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden"
        >
          {/* Subtle static scanline overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
          </div>

          <div className="w-full max-w-2xl space-y-12 relative flex flex-col items-center">
            {/* ASCII Header */}
            <div className="space-y-6 text-center">
              <motion.pre
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#FFB000] font-mono text-[5px] sm:text-[7px] md:text-[9px] lg:text-[10px] leading-[1.1] font-bold inline-block"
                style={{ textShadow: '0 0 30px rgba(255, 176, 0, 0.35)' }}
              >
                {AMBER_OS_ASCII}
              </motion.pre>

              <div className="flex items-center justify-center gap-4 text-white/20 text-[9px] uppercase tracking-[0.5em] font-mono">
                <span className="h-px w-8 bg-white/5" />
                KERNEL_CORE_INIT
                <span className="h-px w-8 bg-white/5" />
              </div>
            </div>

            {/* Log Area */}
            <div className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-sm h-48 overflow-hidden font-mono text-[9px] md:text-[10px]">
              <div className="space-y-1.5">
                {LOG_LINES.slice(0, currentLine + 1).map((line, i) => (
                  <div
                    key={i}
                    className={`${i === currentLine ? 'text-[#FFB000]' : 'text-white/40'}`}
                  >
                    <span className="opacity-20 mr-3">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
                    <span className="opacity-30 mr-2">&gt;&gt;</span>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Progress */}
            <div className="w-full space-y-3 px-1">
              <div className="flex justify-between items-end text-[9px] font-mono uppercase tracking-[0.2em]">
                <div className="flex flex-col gap-1">
                  <span className="text-white/40">Loading_Protocols</span>
                  <span className="text-white/20">Sector_0x83F2_Verification</span>
                </div>
                <div className="text-right flex flex-col gap-1">
                  <span className="text-[#FFB000] font-bold">{Math.round(progress)}%</span>
                  <span className="text-white/10 italic">Archiving_Active</span>
                </div>
              </div>
              <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                  className="h-full bg-[#FFB000] shadow-[0_0_10px_rgba(255,176,0,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 text-white/10 font-mono text-[7px] uppercase tracking-[0.8em]">
            Authorized Access Only // Build 6.4.2
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
