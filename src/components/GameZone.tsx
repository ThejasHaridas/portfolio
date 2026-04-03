'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zone, ZoneId, GROUND_Y, WORLD_HEIGHT } from '@/lib/gameData';
import Checkpoint from './Checkpoint';

interface GameZoneProps {
  zone: Zone;
  visited: boolean;
  nearCheckpoint: ZoneId | null;
}

// ─── Zone-specific decorations ────────────────────────────────────────────

function CrossroadsDecorations({ color }: { color: string }) {
  return (
    <>
      {/* Stars */}
      {[80, 200, 340, 500, 680, 820].map((x, i) => (
        <div
          key={i}
          className="animate-twinkle"
          style={{
            position: 'absolute',
            left: x,
            top: 20 + (i % 3) * 30,
            width: 3,
            height: 3,
            background: '#fff',
            '--duration': `${2 + i * 0.4}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Road intersection */}
      <div
        style={{
          position: 'absolute',
          left: 360,
          top: GROUND_Y,
          width: 120,
          height: 8,
          background: '#6b7280',
          borderTop: `2px dashed ${color}44`,
        }}
      />
    </>
  );
}

function ScholarsHollowDecorations({ color }: { color: string }) {
  return (
    <>
      {/* Trees */}
      {[60, 200, 420, 620, 780].map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: GROUND_Y - 80 - (i % 2) * 30 }}>
          {/* Trunk */}
          <div style={{ width: 12, height: 40, background: '#5c3d11', marginLeft: 14 }} />
          {/* Canopy */}
          <div
            style={{
              position: 'absolute',
              top: -(30 + (i % 2) * 20),
              left: 0,
              width: 0,
              height: 0,
              borderLeft: '20px solid transparent',
              borderRight: '20px solid transparent',
              borderBottom: `${50 + (i % 2) * 20}px solid #1a5c2e`,
              filter: `drop-shadow(0 0 6px ${color}44)`,
            }}
          />
        </div>
      ))}
      {/* Fireflies */}
      {[100, 300, 500, 700].map((x, i) => (
        <div
          key={i}
          className="animate-sparkle"
          style={{
            position: 'absolute',
            left: x,
            top: GROUND_Y - 60 - i * 20,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px 3px ${color}`,
          }}
        />
      ))}
    </>
  );
}

function AcademyDecorations({ color }: { color: string }) {
  return (
    <>
      {/* Building silhouette */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: GROUND_Y - 160,
          width: 180,
          height: 160,
          background: '#0f2040',
          border: `2px solid ${color}33`,
        }}
      >
        {/* Windows */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                left: 20 + col * 50,
                top: 20 + row * 45,
                width: 24,
                height: 28,
                background: Math.random() > 0.4 ? '#fbbf24' : '#1e3a5f',
                boxShadow: Math.random() > 0.4 ? '0 0 8px 2px #fbbf2466' : 'none',
                border: `2px solid ${color}44`,
              }}
            />
          ))
        )}
        {/* Columns */}
        {[10, 50, 90, 130, 160].map((x, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 0,
              left: x,
              width: 10,
              height: 40,
              background: '#1e3a5f',
              border: `1px solid ${color}44`,
            }}
          />
        ))}
      </div>
      {/* Stars */}
      {[50, 180, 380, 600, 750].map((x, i) => (
        <div
          key={i}
          className="animate-twinkle"
          style={{
            position: 'absolute',
            left: x,
            top: 15 + (i % 4) * 25,
            width: 2,
            height: 2,
            background: '#93c5fd',
            '--duration': `${1.5 + i * 0.5}s`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

function GuildDecorations({ color }: { color: string }) {
  return (
    <>
      {/* Torches */}
      {[100, 300, 550, 750].map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: GROUND_Y - 80 }}>
          {/* Pole */}
          <div style={{ width: 6, height: 40, background: '#8B6914', marginLeft: 7 }} />
          {/* Flame */}
          <div
            className="animate-torch"
            style={{
              width: 16,
              height: 20,
              background: `radial-gradient(ellipse, #fbbf24, #f97316, transparent)`,
              borderRadius: '50% 50% 30% 30%',
              marginLeft: 2,
              marginTop: -16,
              boxShadow: `0 0 12px 4px ${color}88`,
            }}
          />
        </div>
      ))}
      {/* Banner */}
      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 60,
          width: 120,
          height: 70,
          background: '#7c2d12',
          border: `3px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 16px ${color}44`,
        }}
      >
        <span style={{ fontSize: 28 }}>⚔️</span>
      </div>
    </>
  );
}

function ForgeDecorations({ color }: { color: string }) {
  return (
    <>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 300,
          background: `radial-gradient(ellipse at right, ${color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      {/* Multiple ember streams */}
      {[120, 250, 400, 600, 750].map((x, i) => (
        <div key={i}>
          {[0, 1, 2].map((j) => (
            <div
              key={j}
              style={{
                position: 'absolute',
                left: x + j * 6,
                top: GROUND_Y - 30,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: j % 2 === 0 ? '#f97316' : '#fbbf24',
                animation: `ember-rise ${0.7 + j * 0.3}s ease-out ${i * 0.1 + j * 0.2}s infinite`,
                '--drift': `${(j % 2 === 0 ? 1 : -1) * (5 + i * 3)}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
      {/* Forge building */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: GROUND_Y - 120,
          width: 160,
          height: 120,
          background: '#1c0a00',
          border: `3px solid ${color}44`,
          boxShadow: `inset 0 0 30px ${color}33`,
        }}
      >
        {/* Door */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 36,
            height: 54,
            background: `radial-gradient(ellipse, ${color}44, #ff4500, #000)`,
            border: `2px solid ${color}`,
          }}
        />
        {/* Chimney */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: 20,
            width: 20,
            height: 30,
            background: '#374151',
            border: `2px solid ${color}44`,
          }}
        />
      </div>
    </>
  );
}

function QuestBoardDecorations({ color }: { color: string }) {
  return (
    <>
      {/* Dark atmosphere */}
      {[60, 200, 450, 700, 880].map((x, i) => (
        <div
          key={i}
          className="animate-twinkle"
          style={{
            position: 'absolute',
            left: x,
            top: 10 + (i % 5) * 20,
            width: 2,
            height: 2,
            background: color,
            '--duration': `${1.2 + i * 0.3}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Bounty posters on ground */}
      {[80, 260, 680, 860].map((x, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: GROUND_Y - 60,
            width: 28,
            height: 38,
            background: '#c8a86e',
            border: `2px solid ${color}66`,
            transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 5}deg)`,
            boxShadow: `0 0 6px ${color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
          }}
        >
          📜
        </div>
      ))}
    </>
  );
}

function TavernDecorations({ color }: { color: string }) {
  return (
    <>
      {/* Tavern building */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: GROUND_Y - 200,
          width: 240,
          height: 200,
          background: '#2d1b69',
          border: `3px solid ${color}44`,
          boxShadow: `0 0 20px ${color}33`,
        }}
      >
        {/* Windows with warm glow */}
        {[0, 1].map((row) =>
          [0, 1].map((col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                left: 30 + col * 110,
                top: 30 + row * 80,
                width: 40,
                height: 48,
                background: '#fbbf24',
                boxShadow: '0 0 16px 6px #fbbf2488, inset 0 0 10px #92400e',
                border: '3px solid #92400e',
              }}
            />
          ))
        )}
        {/* Door */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 44,
            height: 70,
            background: '#4c2a00',
            border: `3px solid ${color}`,
            borderBottom: 'none',
          }}
        />
        {/* Sign */}
        <div
          style={{
            position: 'absolute',
            top: -28,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#92400e',
            border: `2px solid ${color}`,
            padding: '3px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="font-pixel" style={{ fontSize: 5, color: '#fbbf24' }}>
            THE TAVERN
          </span>
        </div>
      </div>
      {/* Stars */}
      {[380, 500, 620, 750, 860].map((x, i) => (
        <div
          key={i}
          className="animate-twinkle"
          style={{
            position: 'absolute',
            left: x,
            top: 20 + (i % 3) * 35,
            width: 3,
            height: 3,
            background: color,
            borderRadius: '50%',
            '--duration': `${1.8 + i * 0.4}s`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

const DECORATIONS: Record<ZoneId, React.FC<{ color: string }>> = {
  crossroads: CrossroadsDecorations,
  'scholars-hollow': ScholarsHollowDecorations,
  academy: AcademyDecorations,
  guild: GuildDecorations,
  forge: ForgeDecorations,
  'quest-board': QuestBoardDecorations,
  tavern: TavernDecorations,
};

// ─── GameZone ─────────────────────────────────────────────────────────────
export default function GameZone({ zone, visited, nearCheckpoint }: GameZoneProps) {
  const Decorations = DECORATIONS[zone.id];

  return (
    <div
      className="absolute top-0 bottom-0 overflow-hidden"
      style={{ left: zone.startX, width: zone.width }}
    >
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: zone.skyGradient }} />

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 ground-tile"
        style={{
          height: WORLD_HEIGHT - GROUND_Y + 20,
          background: zone.groundColor,
          borderTop: `3px solid ${zone.accentColor}44`,
        }}
      />

      {/* Decorations */}
      <Decorations color={zone.accentColor} />

      {/* Zone name flash on first visit */}
      <AnimatePresence>
        {visited && (
          <motion.div
            key={`label-${zone.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute font-pixel"
            style={{
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 8,
              color: zone.accentColor,
              textShadow: `0 0 10px ${zone.accentColor}`,
              whiteSpace: 'nowrap',
              letterSpacing: 2,
            }}
          >
            {zone.name.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkpoint */}
      <Checkpoint
        zone={zone}
        isNear={nearCheckpoint === zone.id}
        visited={visited}
      />

      {/* Zone separator on right edge */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${zone.accentColor}22, transparent)`,
        }}
      />
    </div>
  );
}
