import React, { useState, useRef, useEffect, useCallback } from 'react';
import Minesweeper from './Minesweeper';
import Tetris from './Tetris';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeVariants } from '../styles/animationTokens';

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

    // Clear input immediately to ensure fresh state for next command or after app launch
    setInput('');

    // Update command history for ↑/↓ navigation (only for typed commands)
    if (typed) {
      setCmdHistory(prev => [rawInput.trim(), ...prev.slice(0, 49)]);
      setHistoryIndex(-1);
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
      <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border-b border-white/10 z-20 relative backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black text-white tracking-[0.4em] uppercase leading-tight">
              {activeApp === 'terminal' ? 'KRNL_CORE.SH' : activeApp === 'minesweeper' ? 'PROTO_MINES' : 'PROTO_TETRIS'}
            </h3>
            <p className="text-[7px] text-white/30 font-bold uppercase tracking-[0.2em] leading-tight">
              {activeApp === 'terminal' ? 'System_Shell' : 'Active_Session'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-white/20 tracking-tighter hidden md:block">USER@AMBERES:~</span>
          {activeApp !== 'terminal' && (
            <button
              onClick={() => setActiveApp('terminal')}
              aria-label="Terminate and return to terminal"
              className="group flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-sm transition-all"
            >
              <span className="text-[8px] md:text-[9px] font-bold text-red-500 tracking-widest uppercase">Terminate</span>
              <span className="text-red-500 text-sm md:text-base group-hover:rotate-90 transition-transform">×</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 min-h-[400px] md:min-h-0 overflow-hidden flex flex-col">
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
              className="w-full h-full overflow-y-auto overflow-x-auto bg-[#050505] text-[#FFB000] font-mono text-[10px] sm:text-xs md:text-sm p-4 md:p-10 cursor-text relative custom-scrollbar flex flex-col"
              onClick={() => inputRef.current?.focus({ preventScroll: true })}
            >
              <div className="space-y-6 max-w-4xl mx-auto pt-8 pb-12 flex-1 w-full">
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
                        <span className="text-white font-medium tracking-tight uppercase text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">{item.command}</span>
                      </div>
                    )}
                    {item.output && (
                      <div className="text-white/80 whitespace-pre-wrap font-mono pl-6 border-l border-white/5 py-1">
                        {item.output}
                      </div>
                    )}
                  </motion.div>
                ))}

                <form onSubmit={handleCommand} className="mt-12 group">
                  <div className="flex items-center gap-3 py-2">
                    <span className="text-[#FFB000] font-mono text-sm select-none">λ</span>
                    <div className="flex-1 relative min-w-0">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            const match = Object.keys(COMMAND_REGISTRY).find(k => k.startsWith(input.toLowerCase()) && k !== input.toLowerCase());
                            if (match) setInput(match);
                            return;
                          }
                          handleKeyDown(e);
                        }}
                        className="w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 text-white font-mono caret-[#FFB000] text-sm placeholder-white/30 touch-manipulation"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="type command..."
                        enterKeyHint="go"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 px-1">
                    <p className="text-[9px] font-mono text-white/20 tracking-wide">
                      Type <span className="text-white/40">'help'</span> for instructions · <span className="text-white/40">↑↓</span> history
                    </p>
                  </div>
                </form>

                {/* ── Mobile quick-command bar ── */}
                <div className="mt-4 hidden flex flex-wrap gap-2">
                  {[
                    { label: 'help',        cmd: 'help' },
                    { label: 'whoami',      cmd: 'whoami' },
                    { label: 'tetris',      cmd: 'tetris' },
                    { label: 'minesweeper', cmd: 'minesweeper' },
                    { label: 'ls',          cmd: 'ls' },
                    { label: 'neofetch',    cmd: 'neofetch' },
                    { label: 'clear',       cmd: 'clear' },
                  ].map(({ label, cmd }) => (
                      <button
                        key={cmd}
                        type="button"
                        onPointerDown={() => executeCommand(cmd, false)}
                        className="px-3 py-2 min-h-[38px] bg-white/5 border border-white/10 text-[#FFB000] text-[10px] font-mono uppercase tracking-wider hover:text-white hover:border-[#FFB000]/40 active:bg-[#FFB000]/10 transition-all touch-manipulation select-none"
                        style={{ textShadow: '0 0 10px rgba(255, 176, 0, 0.3)' }}
                      >
                        {label}
                      </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeApp === 'minesweeper' ? (
            <motion.div 
              key="minesweeper" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.2 }} 
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <Minesweeper />
            </motion.div>
          ) : (
            <motion.div 
              key="tetris" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.2 }} 
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <Tetris />
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
