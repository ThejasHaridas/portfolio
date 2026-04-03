'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZONES,
  DIALOGS,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  GROUND_Y,
  CHARACTER_WIDTH,
  MOVE_SPEED,
  CHECKPOINT_RADIUS,
  ZoneId,
} from '@/lib/gameData';
import Character from './Character';
import GameZone from './GameZone';
import GameHUD from './GameHUD';
import MobileControls from './MobileControls';
import DialogBox from './DialogBox';

// ─── Parallax stars (computed once) ───────────────────────────────────────
interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  layer: number; // 1 = far, 2 = mid, 3 = near
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * WORLD_WIDTH * 1.2,
      y: Math.random() * (GROUND_Y - 40),
      size: Math.random() < 0.3 ? 3 : Math.random() < 0.7 ? 2 : 1,
      duration: 1.5 + Math.random() * 3,
      delay: Math.random() * 4,
      layer: Math.floor(Math.random() * 3) + 1,
    });
  }
  return stars;
}

const STARS = generateStars(200);

// ─── Parallax Background ───────────────────────────────────────────────────
function ParallaxBackground({ cameraX }: { cameraX: number }) {
  // Layer rates: higher rate = scrolls faster (closer to foreground)
  // These divs are inside the world canvas (already shifted by -cameraX),
  // so we add back a portion to make them scroll slower.
  const offsets = {
    far: cameraX * 0.85,   // stars move at 15% of world speed
    mid: cameraX * 0.65,   // mountains at 35%
    near: cameraX * 0.40,  // hills at 60%
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Far layer: stars */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${offsets.far}px)`, width: WORLD_WIDTH * 1.3 }}
      >
        {STARS.filter((s) => s.layer === 1).map((star, i) => (
          <div
            key={i}
            className="animate-twinkle"
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              background: '#e2e8f0',
              borderRadius: '50%',
              '--duration': `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Mid layer: moon & distant mountains */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${offsets.mid}px)`, width: WORLD_WIDTH }}
      >
        {/* Moon */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 500,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fef9c3, #fde68a, #ca8a04)',
            boxShadow: '0 0 30px 10px rgba(254,243,199,0.15)',
          }}
        />
        {/* Mountain silhouettes */}
        {[300, 700, 1200, 1800, 2600, 3400, 4200, 5100, 5900, 6600].map((x, i) => {
          const h = 80 + (i % 3) * 40;
          const w = 120 + (i % 4) * 30;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: GROUND_Y - h,
                width: 0,
                height: 0,
                borderLeft: `${w / 2}px solid transparent`,
                borderRight: `${w / 2}px solid transparent`,
                borderBottom: `${h}px solid rgba(20,20,60,0.7)`,
              }}
            />
          );
        })}
      </div>

      {/* Near layer: floating stars (bigger) */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${offsets.near}px)`, width: WORLD_WIDTH }}
      >
        {STARS.filter((s) => s.layer === 3).map((star, i) => (
          <div
            key={i}
            className="animate-twinkle"
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: star.size + 1,
              height: star.size + 1,
              background: '#93c5fd',
              borderRadius: '50%',
              '--duration': `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Start Screen ──────────────────────────────────────────────────────────
function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="start"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[70] flex flex-col items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a1a 70%)',
        }}
      >
        {/* Pixel stars background */}
        {STARS.slice(0, 60).map((s, i) => (
          <div
            key={i}
            className="animate-twinkle"
            style={{
              position: 'absolute',
              left: `${(s.x / (WORLD_WIDTH * 1.2)) * 100}%`,
              top: `${(s.y / GROUND_Y) * 80}%`,
              width: s.size + 1,
              height: s.size + 1,
              background: '#e2e8f0',
              borderRadius: '50%',
              '--duration': `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Title card */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-2 px-4"
        >
          <div
            className="font-pixel mb-3"
            style={{
              fontSize: 'clamp(14px, 3vw, 22px)',
              color: '#fbbf24',
              textShadow: '0 0 20px #fbbf24, 0 0 40px #f97316',
              letterSpacing: 4,
            }}
          >
            THEJAS HARIDAS
          </div>
          <div
            className="font-pixel"
            style={{ fontSize: 'clamp(7px, 1.5vw, 10px)', color: '#9ca3af', letterSpacing: 2 }}
          >
            ─── Portfolio Adventure ───
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mb-10 px-8 max-w-md"
        >
          <div
            className="font-pixel"
            style={{ fontSize: 7, color: '#6b7280', lineHeight: 2.2 }}
          >
            An interactive journey through the world of a passionate developer.
            Walk through 7 unique zones to discover the story.
          </div>
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          onClick={onStart}
          className="font-pixel relative overflow-hidden"
          style={{
            fontSize: 'clamp(9px, 2vw, 13px)',
            color: '#0a0a1a',
            background: '#fbbf24',
            border: '4px solid #92400e',
            padding: '14px 32px',
            boxShadow: '0 0 0 4px #000, 0 0 20px #fbbf2466',
            cursor: 'pointer',
            letterSpacing: 2,
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          ▶ BEGIN ADVENTURE
        </motion.button>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.4 }}
          className="mt-10 text-center px-4"
        >
          <div
            className="font-pixel"
            style={{ fontSize: 7, color: '#374151', lineHeight: 2.4 }}
          >
            <span style={{ color: '#ca8a04' }}>← →</span> or{' '}
            <span style={{ color: '#ca8a04' }}>A D</span> to walk ·{' '}
            <span style={{ color: '#a855f7' }}>E</span> to interact ·{' '}
            <span style={{ color: '#6b7280' }}>ESC</span> to close dialogs
          </div>
        </motion.div>

        {/* Version badge */}
        <div
          className="font-pixel absolute bottom-4 right-4"
          style={{ fontSize: 6, color: '#1f2937' }}
        >
          v1.0 · 2024
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main GameWorld ────────────────────────────────────────────────────────
export default function GameWorld() {
  // ── Game state ──
  const [gameStarted, setGameStarted] = useState(false);
  const [charX, setCharX] = useState(200);
  const [charY] = useState(GROUND_Y);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const [cameraX, setCameraX] = useState(0);
  const [activeDialog, setActiveDialog] = useState<ZoneId | null>(null);
  const [visitedZones, setVisitedZones] = useState<Set<ZoneId>>(new Set());
  const [nearCheckpoint, setNearCheckpoint] = useState<ZoneId | null>(null);

  // ── Refs for hot path (avoids stale closures in rAF) ──
  const charXRef = useRef(200);
  const cameraXRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const mobileLeftRef = useRef(false);
  const mobileRightRef = useRef(false);
  const visitedRef = useRef<Set<ZoneId>>(new Set());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const isDialogOpenRef = useRef(false);
  const nearCheckpointRef = useRef<ZoneId | null>(null);

  // ── DOM refs for direct manipulation (perf) ──
  const charDomRef = useRef<HTMLDivElement>(null);
  const canvasDomRef = useRef<HTMLDivElement>(null);

  // Keep dialog ref in sync
  useEffect(() => {
    isDialogOpenRef.current = activeDialog !== null;
  }, [activeDialog]);

  // ── Camera update ──
  const updateCamera = useCallback((newX: number) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const LEAD = 0.38;
    const target = newX - vw * LEAD;
    return Math.max(0, Math.min(target, WORLD_WIDTH - vw));
  }, []);

  // ── Checkpoint check (runs every N frames) ──
  const checkProximity = useCallback((cx: number) => {
    let found: ZoneId | null = null;
    for (const zone of ZONES) {
      if (Math.abs(cx - zone.checkpointX) < CHECKPOINT_RADIUS) {
        found = zone.id;
        // Auto-open on first visit
        if (!visitedRef.current.has(zone.id)) {
          visitedRef.current.add(zone.id);
          setVisitedZones(new Set(visitedRef.current));
          setActiveDialog(zone.id);
        }
        break;
      }
    }
    if (found !== nearCheckpointRef.current) {
      nearCheckpointRef.current = found;
      setNearCheckpoint(found);
    }
  }, []);

  // ── Walk frame ticker ──
  useEffect(() => {
    if (!isWalking) return;
    const interval = setInterval(() => setWalkFrame((f) => f + 1), 130);
    return () => clearInterval(interval);
  }, [isWalking]);

  // ── Keyboard listeners ──
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'KeyE') {
        const near = nearCheckpointRef.current;
        if (near && !isDialogOpenRef.current) {
          setActiveDialog(near);
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // ── Game loop ──
  useEffect(() => {
    if (!gameStarted) return;

    lastTimeRef.current = performance.now();

    const loop = (ts: number) => {
      const raw = ts - lastTimeRef.current;
      lastTimeRef.current = ts;
      const delta = Math.min(raw / 16.67, 3);

      // Skip movement when dialog is open
      if (!isDialogOpenRef.current) {
        const keys = keysRef.current;
        let dx = 0;
        if (keys.has('ArrowLeft') || keys.has('KeyA') || mobileLeftRef.current)  dx = -MOVE_SPEED * delta;
        if (keys.has('ArrowRight') || keys.has('KeyD') || mobileRightRef.current) dx =  MOVE_SPEED * delta;

        if (dx !== 0) {
          const newX = Math.max(0, Math.min(charXRef.current + dx, WORLD_WIDTH - CHARACTER_WIDTH));
          charXRef.current = newX;

          const newCam = updateCamera(newX);
          cameraXRef.current = newCam;

          // Direct DOM update for smoothness
          if (charDomRef.current) {
            charDomRef.current.style.left = `${newX}px`;
            charDomRef.current.style.top  = `${charY - 48}px`;
          }
          if (canvasDomRef.current) {
            canvasDomRef.current.style.transform = `translateX(-${newCam}px)`;
          }

          // Batch React state update (less frequent)
          setCameraX(newCam);
          setCharX(newX);
          setFacing(dx < 0 ? 'left' : 'right');
          setIsWalking(true);
        } else {
          setIsWalking(false);
        }

        // Proximity check every 8 frames
        frameCountRef.current++;
        if (frameCountRef.current % 8 === 0) {
          checkProximity(charXRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameStarted, charY, updateCamera, checkProximity]);

  // ── Mobile controls ──
  const handleMobileLeft  = useCallback((p: boolean) => { mobileLeftRef.current  = p; }, []);
  const handleMobileRight = useCallback((p: boolean) => { mobileRightRef.current = p; }, []);
  const handleMobileInteract = useCallback(() => {
    const near = nearCheckpointRef.current;
    if (near && !isDialogOpenRef.current) setActiveDialog(near);
  }, []);

  // ── Start handler ──
  const handleStart = useCallback(() => {
    setGameStarted(true);
  }, []);

  // ── Precomputed ground divider positions ──
  const groundDividers = useMemo(() => {
    const divs = [];
    for (let i = 0; i < ZONES.length - 1; i++) {
      const z = ZONES[i];
      divs.push({ x: z.startX + z.width, color: z.accentColor });
    }
    return divs;
  }, []);

  return (
    <>
      {/* ── Start screen ── */}
      {!gameStarted && <StartScreen onStart={handleStart} />}

      {/* ── HUD (fixed overlay) ── */}
      {gameStarted && (
        <GameHUD zones={ZONES} visitedZones={visitedZones} charX={charX} />
      )}

      {/* ── Mobile controls ── */}
      {gameStarted && (
        <MobileControls
          onLeft={handleMobileLeft}
          onRight={handleMobileRight}
          onInteract={handleMobileInteract}
        />
      )}

      {/* ── World canvas ── */}
      <div
        className="relative overflow-hidden"
        style={{ width: '100vw', height: '100vh', background: '#0a0a1a' }}
      >
        <div
          ref={canvasDomRef}
          className="absolute top-0 left-0"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            transform: `translateX(-${cameraX}px)`,
            willChange: 'transform',
          }}
        >
          {/* Parallax background */}
          <ParallaxBackground cameraX={cameraX} />

          {/* Zone dividers (thin dark strips between zones) */}
          {groundDividers.map((d, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: d.x,
                top: 0,
                bottom: 0,
                width: 80,
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.6), transparent)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Zones */}
          {ZONES.map((zone) => (
            <GameZone
              key={zone.id}
              zone={zone}
              visited={visitedZones.has(zone.id)}
              nearCheckpoint={nearCheckpoint}
            />
          ))}

          {/* Character */}
          {gameStarted && (
            <Character
              x={charX}
              y={charY}
              facing={facing}
              isWalking={isWalking}
              walkFrame={walkFrame}
              domRef={charDomRef}
            />
          )}
        </div>

        {/* Screen-edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* ── Dialog box (fixed overlay) ── */}
      {activeDialog && (
        <DialogBox
          dialog={DIALOGS[activeDialog]}
          onClose={() => setActiveDialog(null)}
        />
      )}
    </>
  );
}
