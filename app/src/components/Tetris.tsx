import { useState, useEffect, useCallback, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';
import { sfx } from '../utils/audio';

const COLS = 10;
const ROWS = 20;
const INITIAL_SPEED = 800;

const TETROMINOS = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: '#4fc3f7' },
  J: { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#5c6bc0' },
  L: { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#ffa726' },
  O: { shape: [[1, 1], [1, 1]], color: '#fdd835' },
  S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#66bb6a' },
  T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#ab47bc' },
  Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#ef5350' },
};

type PieceType = keyof typeof TETROMINOS;

function rotateCW(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}
function rotateCCW(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map(row => row[row.length - 1 - i]));
}

export default function Tetris() {
  const [grid, setGrid] = useState<string[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill('')));
  const [activePiece, setActivePiece] = useState<{ type: PieceType; pos: { x: number; y: number }; shape: number[][] } | null>(null);
  const [nextPiece, setNextPiece] = useState<PieceType[]>([]);
  const [bag, setBag] = useState<PieceType[]>([]);
  const [holdPiece, setHoldPiece] = useState<PieceType | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [time, setTime] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');

  // Use refs for values needed inside stable callbacks to avoid stale closures
  const gridRef = useRef(grid);
  const levelRef = useRef(level);
  const activePieceRef = useRef(activePiece);
  const gameStateRef = useRef(gameState);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef(INITIAL_SPEED);

  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { activePieceRef.current = activePiece; }, [activePiece]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const clearLockTimer = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, []);

  // Clear lock timer when game is no longer playing
  useEffect(() => {
    if (gameState !== 'playing') clearLockTimer();
  }, [gameState, clearLockTimer]);

  const checkCollision = useCallback((pos: { x: number; y: number }, shape: number[][], currentGrid?: string[][]) => {
    const g = currentGrid ?? gridRef.current;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const nx = pos.x + c, ny = pos.y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && g[ny][nx])) return true;
        }
      }
    }
    return false;
  }, []); // no grid dep — reads from ref

  const generateBag = useCallback((): PieceType[] => {
    const pieces = Object.keys(TETROMINOS) as PieceType[];
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    return pieces;
  }, []);

  // Shared line-clear + scoring logic (used by both mergePiece and hardDrop)
  const clearLines = useCallback((newGrid: string[][]): { clearedGrid: string[][]; cleared: number } => {
    let cleared = 0;
    const filtered = newGrid.filter(row => {
      const full = row.every(cell => cell !== '');
      if (full) cleared++;
      return !full;
    });
    while (filtered.length < ROWS) filtered.unshift(Array(COLS).fill(''));
    return { clearedGrid: filtered, cleared };
  }, []);

  const applyScore = useCallback((cleared: number, softDropRows = 0) => {
    if (cleared === 0 && softDropRows === 0) return;
    const linePoints = [0, 100, 300, 500, 800];
    const lv = levelRef.current;
    setScore(s => s + (linePoints[cleared] ?? 0) * lv + softDropRows);
    if (cleared > 0) {
      setLines(l => {
        const newTotal = l + cleared;
        const newLevel = Math.floor(newTotal / 10) + 1;
        if (newLevel > lv) {
          setLevel(newLevel);
          speedRef.current = Math.max(100, INITIAL_SPEED - (newLevel - 1) * 80);
        }
        sfx.clear();
        return newTotal;
      });
    }
  }, []);

  const spawnPiece = useCallback((currentBag: PieceType[], currentNext: PieceType[]) => {
    let newBag = [...currentBag];
    const newNext = [...currentNext];
    while (newNext.length < 3) {
      if (newBag.length === 0) newBag = generateBag();
      newNext.push(newBag.pop()!);
    }
    const type = newNext.shift()!;
    setBag(newBag);
    setNextPiece(newNext);
    const piece = {
      type,
      shape: TETROMINOS[type].shape,
      pos: { x: Math.floor(COLS / 2) - Math.floor(TETROMINOS[type].shape[0].length / 2), y: 0 },
    };
    if (checkCollision(piece.pos, piece.shape, gridRef.current)) {
      setGameState('gameOver');
      sfx.gameOver();
      return null;
    }
    return piece;
  }, [generateBag, checkCollision]);

  const mergePiece = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece) return;
    clearLockTimer();
    setGrid(currentGrid => {
      const newGrid = currentGrid.map(row => [...row]);
      piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v !== 0 && piece.pos.y + r >= 0) newGrid[piece.pos.y + r][piece.pos.x + c] = piece.type;
      }));
      const { clearedGrid, cleared } = clearLines(newGrid);
      applyScore(cleared);
      return clearedGrid;
    });
    setCanHold(true);
    setActivePiece(null);
  }, [clearLockTimer, clearLines, applyScore]);

  // Spawn next piece after active piece is cleared
  useEffect(() => {
    if (gameState === 'playing' && !activePiece) {
      const next = spawnPiece(bag, nextPiece);
      if (next) setActivePiece(next);
    }
  }, [activePiece, gameState, bag, nextPiece, spawnPiece]);

  const move = useCallback((dx: number, dy: number, isSoftDrop = false) => {
    if (gameStateRef.current !== 'playing') return false;
    const piece = activePieceRef.current;
    if (!piece) return false;
    const nextPos = { x: piece.pos.x + dx, y: piece.pos.y + dy };
    if (!checkCollision(nextPos, piece.shape)) {
      setActivePiece({ ...piece, pos: nextPos });
      if (dx !== 0) {
        clearLockTimer(); // lateral move resets lock
        sfx.move();
      }
      if (isSoftDrop) applyScore(0, 1);
      return true;
    } else if (dy > 0) {
      if (!lockTimerRef.current) {
        lockTimerRef.current = setTimeout(() => {
          mergePiece();
          lockTimerRef.current = null;
        }, 500);
      }
      return false;
    }
    return false;
  }, [checkCollision, clearLockTimer, mergePiece, applyScore]);

  // FIX: gravity uses useInterval (stable delay-driven) — never restarts on keypress
  useInterval(() => {
    if (gameStateRef.current === 'playing') move(0, 1);
  }, gameState === 'playing' ? speedRef.current : null);

  const attemptRotate = useCallback((cw = true) => {
    if (gameStateRef.current !== 'playing') return;
    const piece = activePieceRef.current;
    if (!piece) return;
    const rotated = cw ? rotateCW(piece.shape) : rotateCCW(piece.shape);
    const offsets = [0, -1, 1, -2, 2];
    for (const dx of offsets) {
      const nextPos = { x: piece.pos.x + dx, y: piece.pos.y };
      if (!checkCollision(nextPos, rotated)) {
        setActivePiece({ ...piece, pos: nextPos, shape: rotated });
        clearLockTimer();
        sfx.rotate();
        return;
      }
    }
  }, [checkCollision, clearLockTimer]);

  const hardDrop = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    const piece = activePieceRef.current;
    if (!piece) return;
    clearLockTimer();
    let newY = piece.pos.y;
    let dropRows = 0;
    while (!checkCollision({ x: piece.pos.x, y: newY + 1 }, piece.shape)) { newY++; dropRows++; }
    setGrid(currentGrid => {
      const newGrid = currentGrid.map(row => [...row]);
      piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v !== 0 && newY + r >= 0) newGrid[newY + r][piece.pos.x + c] = piece.type;
      }));
      const { clearedGrid, cleared } = clearLines(newGrid);
      applyScore(cleared, dropRows * 2);
      return clearedGrid;
    });
    setActivePiece(null);
    setCanHold(true);
  }, [checkCollision, clearLockTimer, clearLines, applyScore]);

  const handleHold = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    const piece = activePieceRef.current;
    if (!piece || !canHold) return;
    clearLockTimer();
    const currentType = piece.type;
    if (holdPiece) {
      setActivePiece({
        type: holdPiece,
        shape: TETROMINOS[holdPiece].shape,
        pos: { x: Math.floor(COLS / 2) - Math.floor(TETROMINOS[holdPiece].shape[0].length / 2), y: 0 },
      });
      setHoldPiece(currentType);
    } else {
      setHoldPiece(currentType);
      setActivePiece(null);
    }
    setCanHold(false);
  }, [canHold, holdPiece, clearLockTimer]);

  // FIX: startGame via ref so keydown handler never captures stale version
  const startGameRef = useRef<() => void>(() => { });
  const startGame = useCallback(() => {
    clearLockTimer();
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
    setScore(0);
    setLines(0);
    setLevel(1);
    setTime(0);
    setHoldPiece(null);
    setCanHold(true);
    speedRef.current = INITIAL_SPEED;
    const initialBag = generateBag();
    const firstPiece = initialBag.pop()!;
    const nextPieces = [initialBag.pop()!, initialBag.pop()!, initialBag.pop()!];
    setBag(initialBag);
    setNextPiece(nextPieces);
    setActivePiece({
      type: firstPiece,
      shape: TETROMINOS[firstPiece].shape,
      pos: { x: Math.floor(COLS / 2) - Math.floor(TETROMINOS[firstPiece].shape[0].length / 2), y: 0 },
    });
    setGameState('playing');
  }, [generateBag, clearLockTimer]);

  useEffect(() => {
    if (gameState === 'playing') {
      timeIntervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    }
    return () => { if (timeIntervalRef.current) clearInterval(timeIntervalRef.current); };
  }, [gameState]);

  useEffect(() => { startGameRef.current = startGame; }, [startGame]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
      if (gameStateRef.current === 'menu' && e.key === 'Enter') { startGameRef.current(); return; }
      if (gameStateRef.current !== 'playing') return;
      switch (e.key) {
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        case 'ArrowDown': move(0, 1, true); break;
        case 'ArrowUp': attemptRotate(true); break;
        case 'z': case 'Z': attemptRotate(false); break;
        case ' ': hardDrop(); break;
        case 'c': case 'C': handleHold(); break;
        case 'p': case 'P': setGameState('paused'); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move, attemptRotate, hardDrop, handleHold]);

  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);
    const piece = activePiece;
    if (piece && gameState === 'playing') {
      let ghostY = piece.pos.y;
      while (!checkCollision({ x: piece.pos.x, y: ghostY + 1 }, piece.shape)) ghostY++;
      piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v !== 0 && ghostY + r >= 0) displayGrid[ghostY + r][piece.pos.x + c] = `ghost-${piece.type}`;
      }));
      piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v !== 0 && piece.pos.y + r >= 0) displayGrid[piece.pos.y + r][piece.pos.x + c] = piece.type;
      }));
    }
    return displayGrid;
  };

  const MiniPiece = ({ type, size = 10 }: { type: PieceType | undefined, size?: number }) => {
    if (!type || !TETROMINOS[type]) return null;
    const piece = TETROMINOS[type];
    
    return (
      <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, ${size}px)` }}>
        {piece.shape.map((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`transition-all duration-300 ${cell ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundColor: piece.color,
              boxShadow: cell ? `0 0 10px ${piece.color}40` : 'none',
              width: size,
              height: size,
              borderRadius: '1px'
            }}
          />
        )))}
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const touchStartPos = useRef<{ x: number, y: number } | null>(null);
  const touchStartTime = useRef<number>(0);
  const lastTouchMove = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent page scroll while playing
    if (gameState === 'playing') e.preventDefault();
    if (!touchStartPos.current || gameState !== 'playing') return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    const now = Date.now();

    if (Math.abs(dx) > 30 && now - lastTouchMove.current > 100) {
      if (move(dx > 0 ? 1 : -1, 0)) {
        if (navigator.vibrate) navigator.vibrate(5);
        touchStartPos.current.x = touch.clientX;
        lastTouchMove.current = now;
      }
    }

    if (dy > 40 && now - lastTouchMove.current > 80) {
      if (move(0, 1, true)) {
        touchStartPos.current.y = touch.clientY;
        lastTouchMove.current = now;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || gameState !== 'playing') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    const dt = Date.now() - touchStartTime.current;

    // Detect Tap (for rotate)
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15 && dt < 200) {
      attemptRotate(true);
      if (navigator.vibrate) navigator.vibrate(10);
    }
    // Detect Swipe Up (for hard drop)
    else if (dy < -60 && Math.abs(dx) < 40) {
      hardDrop();
      if (navigator.vibrate) navigator.vibrate([15, 15]);
    }

    touchStartPos.current = null;
  };

  return (
    <div
      className="w-full h-full flex flex-col bg-black font-sans text-white overflow-hidden relative select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-lenis-prevent
    >

      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center p-2 md:p-4 gap-2 lg:gap-10 relative overflow-hidden">
        
        <div className="flex flex-row items-start justify-center gap-2 md:gap-4 lg:gap-10 w-full">
          {/* Left Side Panel (Mobile & Desktop) */}
          <div className="flex flex-col gap-4 w-12 md:w-24 lg:w-32 items-center lg:items-start shrink-0">
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-[7px] lg:text-sm text-white/40 lg:text-white/60 uppercase tracking-widest lg:tracking-wide mb-1 lg:mb-2">HOLD</p>
              <div className="w-10 h-10 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-black/40 lg:bg-[#111] border border-white/10 rounded-sm lg:rounded-[20px] flex items-center justify-center relative overflow-hidden">
                {holdPiece && <MiniPiece type={holdPiece} size={window.innerWidth < 1024 ? 4 : 8} />}
                {!canHold && <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px]" />}
              </div>
            </div>

            {/* Mobile Stats (only visible below Hold on mobile) */}
            <div className="lg:hidden flex flex-col gap-3 items-center">
              <div>
                <p className="text-[6px] text-white/30 uppercase tracking-tighter mb-0.5 text-center">SCORE</p>
                <p className="text-[10px] font-bold text-white leading-none text-center">{score}</p>
              </div>
              <div>
                <p className="text-[6px] text-white/30 uppercase tracking-tighter mb-0.5 text-center">LVL</p>
                <p className="text-[10px] font-bold text-white leading-none text-center">{level}</p>
              </div>
            </div>
          </div>

          {/* Board Center */}
          <div className="flex flex-col gap-4 items-center relative shrink-0">
            <div data-lenis-prevent className="relative bg-[#111] rounded-sm p-px overflow-hidden">
              <div className="grid grid-cols-10 gap-0">
                {renderGrid().map((row, r) => row.map((cell, c) => {
                  const isGhost = cell.startsWith('ghost-');
                  const pieceType = isGhost ? cell.split('-')[1] as PieceType : cell as PieceType;
                  const color = pieceType ? TETROMINOS[pieceType].color : null;

                  return (
                    <div
                      key={`${r}-${c}`}
                      className="w-[18px] h-[18px] md:w-6 lg:w-[26px] md:h-6 lg:h-[26px] relative transition-all duration-75 border-[0.5px] border-white/[0.03]"
                      style={{
                        backgroundColor: !isGhost && cell ? color! : 'transparent',
                        boxShadow: !isGhost && cell ? `inset 0 0 10px rgba(0,0,0,0.3)` : 'none',
                        zIndex: !isGhost && cell ? 10 : 0
                      }}
                    >
                      {isGhost && (
                        <div
                          className="absolute inset-[2px] border border-dashed opacity-20"
                          style={{ borderColor: color! }}
                        />
                      )}
                      {!isGhost && cell && (
                        <div className="absolute inset-0 border border-white/20" />
                      )}
                    </div>
                  );
                }))}
              </div>
            </div>

            {/* Start / Pause / Restart buttons */}
            <div className="flex gap-2 w-full mt-1">
              {(gameState === 'menu' || gameState === 'gameOver') ? (
                <button
                  onClick={startGame}
                  className="flex-1 py-2 md:py-3 min-h-[40px] md:min-h-[44px] bg-white text-black text-[10px] md:text-sm font-bold rounded-sm hover:scale-[1.02] transition-all touch-manipulation"
                >
                  {gameState === 'menu' ? 'Start Game' : 'Restart'}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setGameState(p => p === 'paused' ? 'playing' : 'paused')}
                    className={`flex-1 py-2 md:py-3 min-h-[40px] md:min-h-[44px] text-[10px] md:text-sm font-bold rounded-sm transition-all touch-manipulation ${gameState === 'paused'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#222] text-white/90'
                      }`}
                  >
                    {gameState === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={startGame}
                    className="flex-1 py-2 md:py-3 min-h-[40px] md:min-h-[44px] bg-[#222] text-white/90 text-[10px] md:text-sm font-medium rounded-sm touch-manipulation"
                  >
                    Restart
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Side Panel (Mobile & Desktop) */}
          <div className="flex flex-col gap-4 w-12 md:w-24 lg:w-32 items-center lg:items-start shrink-0">
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-[7px] lg:text-sm text-white/40 lg:text-white/60 uppercase tracking-widest lg:tracking-wide mb-1 lg:mb-2">NEXT</p>
              <div className="w-10 h-10 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-black/40 lg:bg-[#111] border border-white/10 rounded-sm lg:rounded-[20px] flex items-center justify-center relative overflow-hidden group hover:border-white/20 transition-colors">
                <MiniPiece type={nextPiece[0]} size={window.innerWidth < 1024 ? 4 : 8} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Desktop Stats (only visible on large screens) */}
            <div className="hidden lg:flex lg:flex-col gap-6 items-start">
              <div className="group">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">SCORE</p>
                <p className="text-3xl font-bold text-white leading-none tracking-tight">{score}</p>
              </div>
              <div className="group">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">LEVEL</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-medium text-white leading-none tracking-tight">{level}</p>
                  <p className="text-[8px] text-[#FFB000]/60 font-bold uppercase tracking-tighter animate-pulse">
                    {level < 4 ? 'ACC' : level < 7 ? 'DEC' : level < 10 ? 'ANA' : 'BRH'}
                  </p>
                </div>
              </div>
              <div className="group">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">LINES</p>
                <p className="text-xl font-medium text-white leading-none tracking-tight">{lines}</p>
              </div>
              <div className="group">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">TIME</p>
                <p className="text-xl font-medium text-white leading-none tracking-tight">{formatTime(time)}</p>
              </div>
              {gameState === 'gameOver' && <p className="text-red-500 text-[10px] font-bold animate-pulse">GAME OVER</p>}
            </div>

            {/* Mobile Stats Continued (Time/Lines below Next on mobile) */}
            <div className="lg:hidden flex flex-col gap-3 items-center">
              <div>
                <p className="text-[6px] text-white/30 uppercase tracking-tighter mb-0.5 text-center">TIME</p>
                <p className="text-[10px] font-bold text-white leading-none text-center">{formatTime(time)}</p>
              </div>
              <div>
                <p className="text-[6px] text-white/30 uppercase tracking-tighter mb-0.5 text-center">LINES</p>
                <p className="text-[10px] font-bold text-white leading-none text-center">{lines}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile D-Pad (Center aligned below everything) ── */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="flex flex-col items-center gap-0.5 mt-2 lg:hidden relative z-20">
            {/* Top row: Hard Drop */}
            <button
              onPointerDown={() => { hardDrop(); if (navigator.vibrate) navigator.vibrate([15,15]); }}
              className="w-16 h-10 bg-[#FFB000]/10 border border-[#FFB000]/30 text-[#FFB000] text-lg font-bold rounded-sm active:bg-[#FFB000]/30 touch-manipulation select-none"
            >↑↑</button>
            {/* Middle row: Left / Rotate / Right */}
            <div className="flex gap-1">
              <button
                onPointerDown={() => { move(-1, 0); if (navigator.vibrate) navigator.vibrate(5); }}
                className="w-16 h-14 bg-white/5 border border-white/10 text-white text-2xl font-bold rounded-sm active:bg-white/20 touch-manipulation select-none"
              >◀</button>
              <button
                onPointerDown={() => { attemptRotate(true); if (navigator.vibrate) navigator.vibrate(10); }}
                className="w-16 h-14 bg-[#FFB000]/10 border border-[#FFB000]/30 text-[#FFB000] text-lg font-bold rounded-sm active:bg-[#FFB000]/30 touch-manipulation select-none"
              >↻</button>
              <button
                onPointerDown={() => { move(1, 0); if (navigator.vibrate) navigator.vibrate(5); }}
                className="w-16 h-14 bg-white/5 border border-white/10 text-white text-2xl font-bold rounded-sm active:bg-white/20 touch-manipulation select-none"
              >▶</button>
            </div>
            {/* Bottom row: Soft drop / Hold */}
            <div className="flex gap-1">
              <button
                onPointerDown={() => { move(0, 1, true); }}
                className="w-24 h-10 bg-white/5 border border-white/10 text-white/60 text-lg rounded-sm active:bg-white/20 touch-manipulation select-none"
              >▼</button>
              <button
                onPointerDown={() => { handleHold(); if (navigator.vibrate) navigator.vibrate(10); }}
                className="w-24 h-10 bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-sm active:bg-white/20 touch-manipulation select-none"
              >Hold</button>
            </div>
          </div>
        )}
      </div>

      {/* No redundant overlays here, handled by Terminal parent */}
    </div>
  );
}
