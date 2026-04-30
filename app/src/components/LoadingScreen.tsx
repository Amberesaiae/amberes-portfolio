import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const LOG_LINES = [
  "Awakening system core...",
  "Loading neural pathways...",
  "Synchronizing visual state...",
  "Authenticating session...",
  "Ready."
];

export default function LoadingScreen() {
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Progress bar simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 8;
      });
    }, 80);

    // Log line simulation
    const lineInterval = setInterval(() => {
      setCurrentLine(prev => (prev < LOG_LINES.length - 1 ? prev + 1 : prev));
    }, 220);

    // Completion timeout
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearInterval(lineInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1, ease: [0.19, 1, 0.22, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center p-6"
        >
          {/* Simple static scanline */}
          <div className="absolute inset-x-0 h-px bg-[#FFB000]/10 pointer-events-none z-10 top-1/2" />

          <div className="w-full max-w-md space-y-12 relative">
            {/* Header with glitch-like reveal */}
            <div className="space-y-2 text-center">
              <div className="opacity-100 text-center">
                <h1 className="text-white font-sans font-bold text-4xl md:text-5xl tracking-tighter">
                  AMBERES<span className="text-white/40">.OS</span>
                </h1>
                <p className="text-white/20 text-[10px] uppercase tracking-[1em] font-sans mt-4">
                  Archive Authorized
                </p>
              </div>
            </div>

            {/* Log Output Area */}
            <div className="h-40 font-mono text-[10px] space-y-1.5 overflow-hidden">
              {LOG_LINES.slice(0, currentLine + 1).map((line, i) => (
                <div
                  key={i}
                  className={`${i === currentLine ? 'text-[#FFB000]' : 'text-[#444]'}`}
                >
                  <span className="opacity-20 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                  {line}
                </div>
              ))}
            </div>

            {/* Technical Progress UI */}
            <div className="space-y-4">
            <div className="relative pt-20">
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                  className="h-full bg-white"
                />
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-black tracking-[0.3em] uppercase">
                <span className="text-white/20">Initialization</span>
                <span className="text-white">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
