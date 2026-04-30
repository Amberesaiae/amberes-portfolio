import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';
import { sfx } from '../utils/audio';

const DIFFICULTIES = {
  easy: { label: 'Rookie', cols: 9, rows: 9, mines: 10, desc: '9×9 · 10 mines' },
  medium: { label: 'Soldier', cols: 16, rows: 14, mines: 40, desc: '16×14 · 40 mines' },
  hard: { label: 'Veteran', cols: 20, rows: 16, mines: 70, desc: '20×16 · 70 mines' },
} as const;

type Diff = keyof typeof DIFFICULTIES;
type CellState = 'hidden' | 'revealed' | 'flagged' | 'question';
type Phase = 'menu' | 'playing' | 'won' | 'lost' | 'paused';
interface Cell { mine: boolean; adj: number; state: CellState; exploded?: boolean; }

const NUM_COLORS: Record<number, string> = {
  1: '#00ccff', 2: '#00ff41', 3: '#ff3131',
  4: '#bc13fe', 5: '#ff8a00', 6: '#00f7ff',
  7: '#ff0080', 8: '#ffffff',
};

function generateBoard(cols: number, rows: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, adj: 0, state: 'hidden' as CellState }))
  );
}

function placeMines(board: Cell[][], cols: number, rows: number, mines: number, safeR: number, safeC: number): Cell[][] {
  const b = board.map(row => row.map(c => ({ ...c })));
  const safe = new Set<string>();
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++)
      safe.add(`${safeR + dr},${safeC + dc}`);
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!b[r][c].mine && !safe.has(`${r},${c}`)) { b[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!b[r][c].mine) {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && b[nr][nc].mine) n++;
          }
        b[r][c].adj = n;
      }
  return b;
}

function floodReveal(board: Cell[][], cols: number, rows: number, startR: number, startC: number): Cell[][] {
  const b = board.map(row => row.map(c => ({ ...c })));
  const stack = [[startR, startC]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols || b[r][c].state !== 'hidden') continue;
    b[r][c].state = 'revealed';
    if (b[r][c].adj === 0 && !b[r][c].mine)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          stack.push([r + dr, c + dc]);
  }
  return b;
}

function checkWinCondition(board: Cell[][]): boolean {
  for (const row of board)
    for (const cell of row)
      if (!cell.mine && cell.state !== 'revealed') return false;
  return true;
}

export default function Minesweeper() {
  const [diff, setDiff] = useState<Diff>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [phase, setPhase] = useState<Phase>('menu');
  const [firstClick, setFirstClick] = useState(true);
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [cellSize, setCellSize] = useState(30);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const cfg = DIFFICULTIES[diff];

  // FIX: timer only ticks after first click (firstClick=false means mines placed, game truly started)
  useInterval(() => setTime(t => t + 1), phase === 'playing' && !firstClick ? 1000 : null);

  useEffect(() => {
    const calc = () => {
      if (!boardRef.current) return;
      const { width, height } = boardRef.current.getBoundingClientRect();
      const maxW = Math.floor((width - 40) / cfg.cols);
      const maxH = Math.floor((height - 40) / cfg.rows);
      setCellSize(Math.max(22, Math.min(36, maxW, maxH)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [phase, cfg]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === ' ') e.preventDefault(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const startGame = useCallback((d: Diff) => {
    setDiff(d);
    setBoard(generateBoard(DIFFICULTIES[d].cols, DIFFICULTIES[d].rows));
    setPhase('playing');
    setFirstClick(true);
    setFlags(0);
    setTime(0);
    setFlagMode(false);
  }, []);

  const triggerLoss = useCallback((nb: Cell[][], mr: number, mc: number) => {
    setBoard(nb.map((row, r) => row.map((cl, c) => ({
      ...cl,
      state: (cl.mine ? 'revealed' : cl.state) as CellState,
      exploded: r === mr && c === mc,
    }))));
    setPhase('lost');
    sfx.explode();
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }, []);

  const handleFlag = useCallback((r: number, c: number) => {
    if (phase !== 'playing') return;
    setBoard(b => {
      const cell = b[r]?.[c];
      if (!cell || cell.state === 'revealed') return b;
      const cycle: Record<CellState, CellState> = { hidden: 'flagged', flagged: 'question', question: 'hidden', revealed: 'revealed' };
      const newState = cycle[cell.state];
      const delta = newState === 'flagged' ? 1 : cell.state === 'flagged' ? -1 : 0;
      setFlags(f => f + delta);
      sfx.flag();
      if (navigator.vibrate) navigator.vibrate(10);
      return b.map((row, ri) => row.map((cl, ci) => ri === r && ci === c ? { ...cl, state: newState } : cl));
    });
  }, [phase]);

  const handleClick = useCallback((r: number, c: number) => {
    if (phase !== 'playing') return;

    setBoard(currentBoard => {
      const cell = currentBoard[r]?.[c];
      if (!cell || cell.state === 'flagged') return currentBoard;

      // Chord-reveal on already-revealed numbered cell
      if (cell.state === 'revealed') {
        if (cell.adj === 0) return currentBoard;
        let adjFlags = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++)
            if (currentBoard[r + dr]?.[c + dc]?.state === 'flagged') adjFlags++;
        if (adjFlags !== cell.adj) return currentBoard;

        let nb = currentBoard;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            const neighbor = nb[nr]?.[nc];
            if (neighbor?.state === 'hidden') {
              if (neighbor.mine) {
                // Schedule loss outside of setState
                setTimeout(() => triggerLoss(nb, nr, nc), 0);
                return nb;
              }
              nb = floodReveal(nb, cfg.cols, cfg.rows, nr, nc);
            }
          }
        }
        if (checkWinCondition(nb)) setTimeout(() => setPhase('won'), 0);
        return nb;
      }

      // question state: cycle back to hidden on click (mobile-friendly)
      if (cell.state === 'question') {
        return currentBoard.map((row, ri) => row.map((cl, ci) =>
          ri === r && ci === c ? { ...cl, state: 'hidden' as CellState } : cl
        ));
      }

      if (flagMode) {
        // At this point the cell can only be hidden.
        setFlags(f => f + 1);
        return currentBoard.map((row, ri) => row.map((cl, ci) => ri === r && ci === c ? { ...cl, state: 'flagged' as CellState } : cl));
      }

      // First click: place mines safely
      let nb = currentBoard;
      if (firstClick) {
        nb = placeMines(currentBoard, cfg.cols, cfg.rows, cfg.mines, r, c);
        setFirstClick(false);
      }

      if (nb[r][c].mine) {
        setTimeout(() => triggerLoss(nb, r, c), 0);
        return nb;
      }

      nb = floodReveal(nb, cfg.cols, cfg.rows, r, c);
      sfx.reveal();
      if (checkWinCondition(nb)) setTimeout(() => setPhase('won'), 0);
      return nb;
    });
  }, [phase, firstClick, cfg, flagMode, triggerLoss]);

  const onPointerDown = (e: React.PointerEvent, r: number, c: number) => {
    touchStartPos.current = { x: e.clientX, y: e.clientY };
    touchTimer.current = setTimeout(() => {
      handleFlag(r, c);
      touchTimer.current = null;
    }, 400);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!touchTimer.current) return;
    const dx = Math.abs(e.clientX - touchStartPos.current.x);
    const dy = Math.abs(e.clientY - touchStartPos.current.y);
    if (dx > 10 || dy > 10) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  const onPointerUp = (r: number, c: number) => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
      handleClick(r, c);
    }
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const minesLeft = cfg.mines - flags;

  if (phase === 'menu') return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] p-4 md:p-12 overflow-y-auto">
      <div className="max-w-md w-full relative group py-8">
        {/* Industrial Border Effect */}
        <div className="absolute -inset-1 border-2 border-[#FFB000]/20 opacity-30 group-hover:opacity-60 transition-opacity" />
        <div className="absolute -inset-4 border border-white/5 opacity-20" />
        
        <div className="relative bg-[#050505]/80 backdrop-blur-sm border border-white/10 p-6 md:p-12 flex flex-col items-center text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-black text-[#FFB000] tracking-[0.2em] mb-2">MINE_SWEEPER</h2>
            <p className="text-[8px] md:text-[10px] text-[#FFB000]/40 font-mono tracking-[0.4em] uppercase">FIELD_PROTO_V4.1</p>
          </div>

          <div className="w-full space-y-3 mb-8">
            {(Object.keys(DIFFICULTIES) as Diff[]).map((key) => {
              const d = DIFFICULTIES[key];
              return (
                <button 
                  key={key} 
                  onClick={() => startGame(key)} 
                  className="w-full py-4 border border-white/10 bg-white/[0.02] text-[#FFB000]/60 hover:text-[#FFB000] hover:border-[#FFB000]/50 hover:bg-[#FFB000]/5 transition-all group/btn flex items-center justify-between px-6"
                >
                  <span className="text-xs font-black tracking-widest">{d.label}</span>
                  <span className="text-[10px] font-mono opacity-40 group-hover/btn:opacity-100">[{d.desc.split(' ')[0]}]</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#050505] font-mono text-white overflow-hidden relative select-none touch-none">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/5 border-b border-white/10 backdrop-blur-sm shrink-0 z-10">
        <div className="flex gap-4 md:gap-8 items-center">
          <div>
            <p className="text-[7px] text-white/20 uppercase font-bold tracking-widest mb-1">Mines</p>
            <p className="text-xl font-black text-red-500 leading-none">{String(Math.max(0, minesLeft)).padStart(3, '0')}</p>
          </div>
          <div>
            <p className="text-[7px] text-white/20 uppercase font-bold tracking-widest mb-1">Time</p>
            <p className="text-xl font-black text-white leading-none">{fmt(time)}</p>
          </div>
          {phase === 'won' && <p className="text-green-500 text-[10px] font-bold animate-pulse ml-4">WINNER</p>}
          {phase === 'lost' && <p className="text-red-500 text-[10px] font-bold animate-pulse ml-4">GAME OVER</p>}
        </div>
        <div className="flex gap-3">
          {(phase === 'playing' || phase === 'paused') && (
            <button
              onClick={() => setPhase(p => p === 'paused' ? 'playing' : 'paused')}
              className={`px-4 py-2 text-[10px] font-bold transition-all rounded ${phase === 'paused'
                  ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/40'
                }`}
            >
              {phase === 'paused' ? 'RESUME' : 'PAUSE'}
            </button>
          )}
          <button onClick={() => startGame(diff)} className="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-white hover:text-black transition-all">
            <span className="text-lg">↻</span>
          </button>
        </div>
      </div>

      <div ref={boardRef} className="flex-1 flex items-center justify-center p-4 overflow-auto bg-black relative" data-lenis-prevent>
        {(
          <div className={`transition-opacity duration-300 ${phase === 'paused' ? 'opacity-30' : 'opacity-100'}`}>
            <div className="border-4 border-[#444] p-1 bg-[#222]">
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cfg.cols}, ${cellSize}px)`, gap: '2px' }}>
                {board.map((row, r) => row.map((cell, c) => {
                  const isRevealed = cell.state === 'revealed';
                  return (
                    <button key={`${r}-${c}`}
                      onPointerDown={e => onPointerDown(e, r, c)}
                      onPointerUp={() => onPointerUp(r, c)}
                      onPointerMove={onPointerMove}
                      onContextMenu={e => { e.preventDefault(); handleFlag(r, c); }}
                      disabled={phase === 'paused' || phase === 'won' || phase === 'lost'}
                      style={{ width: cellSize, height: cellSize }}
                      className={`flex items-center justify-center transition-none border-2 text-[10px] font-black
                        ${isRevealed
                          ? cell.exploded ? 'bg-red-600 border-white text-white' : 'bg-[#111] border-[#111] text-white'
                          : 'bg-[#333] border-t-[#444] border-l-[#444] border-r-[#222] border-b-[#222] active:bg-[#222]'
                        }`}>
                      {cell.state === 'flagged' && <span className="text-red-500">⚑</span>}
                      {cell.state === 'question' && <span className="text-yellow-400">?</span>}
                      {isRevealed && cell.mine && <span>✱</span>}
                      {isRevealed && !cell.mine && cell.adj > 0 && (
                        <span style={{ color: NUM_COLORS[cell.adj] }}>{cell.adj}</span>
                      )}
                    </button>
                  );
                }))}
              </div>
            </div>
            {(phase === 'won' || phase === 'lost') && (
              <div className="mt-8 flex justify-center gap-4">
                {phase === 'won' && diff !== 'hard' && (
                  <button
                    onClick={() => {
                      const next: Diff = diff === 'easy' ? 'medium' : 'hard';
                      startGame(next);
                    }}
                    className="px-8 py-3 bg-green-600 text-white font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  >
                    Next Tier
                  </button>
                )}
                <button onClick={() => setPhase('menu')} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">
                  {phase === 'won' ? 'Finish' : 'Main Menu'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-2 text-center text-[8px] opacity-20 uppercase tracking-widest">Long-press / right-click to flag · Tap to dig · Click ? to unmark</div>
    </div>
  );
}
