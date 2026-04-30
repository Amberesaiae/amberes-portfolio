import React, { useState, useRef, useEffect, useCallback } from 'react';
import Minesweeper from './Minesweeper';
import Tetris from './Tetris';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeVariants, TIMING } from '../styles/animationTokens';

type HistoryItem = {
  id: number;
  command: string;
  output: React.ReactNode;
};

type CommandResult =
  | React.ReactNode
  | void
  | { action: 'clear' }
  | { action: 'launch'; app: 'minesweeper' | 'tetris' }
  | { isCustom: true; customOutput: React.ReactNode }
  | { content: null; isCustom: true; customOutput: React.ReactNode };

type CommandHandler = () => CommandResult;

interface CommandConfig {
  aliases?: string[];
  handler: CommandHandler;
  description: string;
  category: 'info' | 'navigation' | 'system' | 'games';
}

let historyIdCounter = 0;

const NEOFETCH_ASCII = ` █████╗ ███╗   ███╗██████╗ ███████╗██████╗ 
██╔══██╗████╗ ████║██╔══██╗██╔════╝██╔══██╗
███████║██╔████╔██║██████╔╝█████╗  ██████╔╝
██╔══██║██║╚██╔╝██║██╔══██╗██╔══╝  ██╔══██╗
██║  ██║██║ ╚═╝ ██║██████╔╝███████╗██║  ██║
╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝`;

const NEOFETCH_OUTPUT = (
  <div className="flex flex-col xl:flex-row gap-6 mb-4">
    <pre className="text-[#FFB000] font-mono text-[8px] md:text-[10px] leading-[1.1] font-bold">{NEOFETCH_ASCII}</pre>
    <div className="flex flex-col justify-center space-y-1 text-xs md:text-sm">
      <p><span className="text-[#FFB000]">OS:</span> amber-os (Marine-Refined)</p>
      <p><span className="text-[#FFB000]">KERNEL:</span> 6.x-precision-weld</p>
      <p><span className="text-[#FFB000]">UPTIME:</span> Drawn out of water, hardened by time</p>
      <p><span className="text-[#FFB000]">SHELL:</span> zsh (keyboard-driven)</p>
      <p><span className="text-[#FFB000]">IDENTITY:</span> Fisherman's Son // Systems Architect</p>
      <div className="mt-2 flex gap-1">
        <div className="w-6 h-3 bg-[#cc241d]" />
        <div className="w-6 h-3 bg-[#98971a]" />
        <div className="w-6 h-3 bg-[#d79921]" />
        <div className="w-6 h-3 bg-[#458588]" />
        <div className="w-6 h-3 bg-[#b16286]" />
      </div>
    </div>
  </div>
);

// Command registry for reusable execution
const COMMAND_REGISTRY: Record<string, CommandConfig> = {
  help: {
    handler: () => ({
      content: null,
      isCustom: true,
      customOutput: (
        <div className="space-y-2 py-1">
          <p className="text-white/80 text-[10px] uppercase tracking-widest font-black">Available Operations:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <p><span className="text-[#FFB000] w-24 inline-block font-bold">whoami</span> <span className="opacity-90">- Identity check</span></p>
            <p><span className="text-[#FFB000] w-24 inline-block font-bold">ls</span> <span className="opacity-90">- List assets</span></p>
            <p><span className="text-[#FFB000] w-24 inline-block font-bold">minesweeper</span> <span className="opacity-90">- Field protocol</span></p>
            <p><span className="text-[#FFB000] w-24 inline-block font-bold">tetris</span> <span className="opacity-90">- Assembly test</span></p>
            <p><span className="text-[#FFB000] w-24 inline-block font-bold">clear</span> <span className="opacity-90">- Purge screen</span></p>
            <p><span className="text-[#FFB000] w-24 inline-block font-bold">neofetch</span> <span className="opacity-90">- System report</span></p>
          </div>
          <div className="pt-4 mt-2 border-t border-white/5">
            <p className="text-[9px] text-[#FFB000]/60 uppercase tracking-[0.4em] font-bold italic">
              // FOR THOSE WHO KNOW NOW: EVERY COMMAND IS A BLUEPRINT. TYPE TO NAVIGATE, EXPLORE THE ARCADE GAMES TO TEST YOUR LIMITS.
            </p>
          </div>
        </div>
      ),
    }),
    description: 'Show available commands',
    category: 'info',
  },
  whoami: {
    handler: () => 'A builder who understands that strength without soul is just cold metal.',
    description: 'Identity check',
    category: 'info',
  },
  ls: {
    handler: () => 'identity/  projects/  manifesto.txt  blueprint.md  games/',
    description: 'List assets',
    category: 'info',
  },
  neofetch: {
    handler: () => ({ isCustom: true, customOutput: NEOFETCH_OUTPUT }),
    description: 'System report',
    category: 'info',
  },
  clear: {
    handler: () => ({ action: 'clear' as const }),
    description: 'Purge screen',
    category: 'system',
  },
  minesweeper: {
    aliases: ['ms'],
    handler: () => ({ action: 'launch' as const, app: 'minesweeper' as const }),
    description: 'Field protocol',
    category: 'games',
  },
  tetris: {
    handler: () => ({ action: 'launch' as const, app: 'tetris' as const }),
    description: 'Assembly test',
    category: 'games',
  },
};

export default function Terminal() {
  const prefersReducedMotion = useReducedMotion();
  const [activeApp, setActiveApp] = useState<'terminal' | 'minesweeper' | 'tetris'>('terminal');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: historyIdCounter++, command: 'neofetch', output: NEOFETCH_OUTPUT },
  ]);
  // Command history navigation
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Touch/gesture state
  const [showCommandChips, setShowCommandChips] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus on mount and when returning to terminal
  useEffect(() => {
    if (activeApp === 'terminal') {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [activeApp]);

  useEffect(() => {
    if (activeApp === 'terminal' && containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [history, activeApp]);

  const pushHistory = useCallback((command: string, output: React.ReactNode) => {
    setHistory(prev => [...prev, { id: historyIdCounter++, command, output }]);
  }, []);

  // Reusable command execution for both typed and tapped commands
  const executeCommand = useCallback((rawInput: string, typed = true) => {
    const cmd = rawInput.trim().toLowerCase();
    if (!cmd) return;

    // Update command history for ↑/↓ navigation (only for typed commands)
    if (typed) {
      setCmdHistory(prev => [rawInput.trim(), ...prev.slice(0, 49)]);
      setHistoryIndex(-1);
      setInput('');
    }

    // Find command in registry (check aliases too)
    let commandConfig = COMMAND_REGISTRY[cmd];
    if (!commandConfig) {
      // Check aliases
      const aliasedCmd = Object.entries(COMMAND_REGISTRY).find(([, cfg]) => 
        cfg.aliases?.includes(cmd)
      );
      if (aliasedCmd) {
        commandConfig = aliasedCmd[1];
      }
    }

    if (!commandConfig) {
      pushHistory(rawInput, `Command not recognized: ${cmd}. Type 'help' for available protocols.`);
      return;
    }

    const result = commandConfig.handler();

    // Handle different result types
    if (typeof result === 'string') {
      pushHistory(rawInput, result);
    } else if (result && typeof result === 'object') {
      if ('action' in result) {
        if (result.action === 'clear') {
          setHistory([]);
          return;
        }
        if (result.action === 'launch') {
          setActiveApp(result.app);
          return;
        }
      }
      if ('customOutput' in result) {
        pushHistory(rawInput, result.customOutput);
      }
    }

    // Provide haptic feedback on mobile
    if (navigator.vibrate && !typed) {
      navigator.vibrate(10);
    }
  }, [pushHistory]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input, true);
  };

  // Touch handlers for swipe-to-navigate history
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    // Swipe up/down to show/hide command chips
    if (Math.abs(diff) > 50) {
      setShowCommandChips(diff < 0);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  // Command chip tap handler
  const handleCommandChip = (command: string) => {
    executeCommand(command, false);
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInput(cmdHistory[nextIndex] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex] ?? '');
      }
    }
  };

  // On-screen history navigation for touch
  const navigateHistory = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      const nextIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInput(cmdHistory[nextIndex] ?? '');
    } else {
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex] ?? '');
      }
    }
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
    if (navigator.vibrate) navigator.vibrate(5);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' && activeApp !== 'terminal') {
        if (containerRef.current?.contains(e.target as Node)) e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeApp]);

  return (
    <div className="w-full bg-black relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6 bg-white/5 border-b border-white/10 z-20 relative">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
              {activeApp === 'terminal' ? 'System_Shell' : activeApp === 'minesweeper' ? 'Minesweeper' : 'Tetris'}
            </h2>
            <div className="w-1 h-1 rounded-full bg-[#FFB000] animate-pulse shadow-[0_0_8px_rgba(255,176,0,0.6)]" />
          </div>
          <p className="text-[8px] text-[#FFB000]/60 font-bold uppercase tracking-[0.4em] leading-none">
            {activeApp === 'terminal' ? 'Command_Interface_v3' : activeApp === 'minesweeper' ? 'Field_Protocol_Active' : 'High_Performance_Engine'}
          </p>
        </div>
        
        <div className="flex items-center">
          {activeApp !== 'terminal' && (
            <button 
              onClick={() => setActiveApp('terminal')}
              className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-white transition-all group"
              title="Return to Shell"
            >
              <span className="text-xl font-mono opacity-30 group-hover:opacity-100">×</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 min-h-[400px] md:min-h-0 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {activeApp === 'terminal' ? (
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              ref={containerRef}
              data-lenis-prevent
              className="w-full h-full overflow-y-auto bg-black text-[#FFB000] font-mono text-xs md:text-sm p-4 md:p-10 cursor-text relative custom-scrollbar"
              onClick={() => inputRef.current?.focus({ preventScroll: true })}
            >
              <div className="space-y-6 max-w-4xl mx-auto pt-8 pb-12">


                {history.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    variants={prefersReducedMotion ? undefined : fadeVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: prefersReducedMotion ? 0 : 0.1, delay: index === history.length - 1 ? 0.05 : 0 }}
                    className="space-y-3"
                  >
                    {item.command && (
                      <div className="flex items-center gap-4">
                        <span className="text-[#FFB000] font-bold">λ</span>
                        <span className="text-white font-medium">{item.command}</span>
                      </div>
                    )}
                    {item.output && (
                      <div className="text-white/80 whitespace-pre-wrap font-mono pl-6 border-l border-white/5 py-1">
                        {item.output}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Mobile Command Chips - Swipe up to reveal */}
                <AnimatePresence>
                  {showCommandChips && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: TIMING.fast }}
                      className="md:hidden mb-4"
                    >
                      <p className="text-[8px] text-white/40 uppercase tracking-widest mb-2">Quick Commands</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(COMMAND_REGISTRY)
                          .filter(([, cfg]) => cfg.category !== 'system')
                          .map(([name]) => (
                          <button
                            key={name}
                            onClick={() => handleCommandChip(name)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/80 active:bg-[#FFB000]/20 active:border-[#FFB000]/50 transition-all min-h-[32px] touch-manipulation"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Swipe hint for mobile */}
                <div className="md:hidden text-center mb-2">
                  <p className="text-[8px] text-white/30 uppercase tracking-widest">
                    {showCommandChips ? '▼ Swipe down to hide' : '▲ Swipe up for commands'}
                  </p>
                </div>

                <form onSubmit={handleCommand} className="mt-12 group">
                  <div 
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 focus-within:border-white/20 transition-all min-h-[56px] touch-manipulation"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <span className="text-[#FFB000] font-bold select-none">λ</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent border-none outline-none text-white font-bold font-mono caret-[#FFB000] text-sm placeholder-white/20 min-w-0 touch-manipulation"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="Enter command..."
                      enterKeyHint="go"
                    />
                    
                    {/* Mobile history navigation buttons */}
                    <div className="flex items-center gap-1 md:hidden">
                      <button
                        type="button"
                        onClick={() => navigateHistory('up')}
                        disabled={cmdHistory.length === 0}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded active:bg-white/10 disabled:opacity-30 disabled:active:bg-white/5 transition-all touch-manipulation min-h-[32px] min-w-[32px]"
                        aria-label="Previous command"
                      >
                        <span className="text-white/60">↑</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateHistory('down')}
                        disabled={historyIndex < 0}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded active:bg-white/10 disabled:opacity-30 disabled:active:bg-white/5 transition-all touch-manipulation min-h-[32px] min-w-[32px]"
                        aria-label="Next command"
                      >
                        <span className="text-white/60">↓</span>
                      </button>
                    </div>

                    {/* Submit button for mobile */}
                    <button
                      type="submit"
                      className="md:hidden w-10 h-10 flex items-center justify-center bg-[#FFB000]/10 border border-[#FFB000]/30 rounded active:bg-[#FFB000]/30 transition-all touch-manipulation min-h-[40px] min-w-[40px]"
                      aria-label="Execute command"
                    >
                      <span className="text-[#FFB000]">→</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : activeApp === 'minesweeper' ? (
            <motion.div key="minesweeper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.05 }} className="w-full h-full">
              <Minesweeper onExit={() => setActiveApp('terminal')} />
            </motion.div>
          ) : (
            <motion.div key="tetris" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.05 }} className="w-full h-full">
              <Tetris onExit={() => setActiveApp('terminal')} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle static overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_70%,rgba(0,0,0,0.4)_100%)]" />
        </div>
      </div>
    </div>
  );
}
