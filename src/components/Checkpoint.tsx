'use client';

import { Zone, ZoneId } from '@/lib/gameData';
import { GROUND_Y } from '@/lib/gameData';

interface CheckpointProps {
  zone: Zone;
  isNear: boolean;
  visited: boolean;
}

// ─── Per-zone checkpoint objects ──────────────────────────────────────────

function Signpost({ color }: { color: string }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Post */}
      <div style={{ width: 6, height: 48, background: '#8B6914', border: '2px solid #5c440c' }} />
      {/* Sign board */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 52,
          height: 24,
          background: '#c8901a',
          border: `3px solid ${color}`,
          boxShadow: `0 0 8px ${color}66`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="font-pixel" style={{ fontSize: 5, color: '#fff' }}>
          ADVENTURE
        </span>
      </div>
    </div>
  );
}

function GlowingBook({ color }: { color: string }) {
  return (
    <div
      className="animate-npc-hover"
      style={{
        width: 36,
        height: 44,
        background: '#1e0045',
        border: `3px solid ${color}`,
        boxShadow: `0 0 14px 4px ${color}88, inset 0 0 8px ${color}44`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        '--glow-color': color,
      } as React.CSSProperties}
    >
      <div style={{ fontSize: 16 }}>📖</div>
      <div className="font-pixel" style={{ fontSize: 4, color }}>READ</div>
    </div>
  );
}

function Scroll({ color }: { color: string }) {
  return (
    <div className="animate-scroll-float" style={{ position: 'relative' }}>
      {/* Scroll body */}
      <div
        style={{
          width: 32,
          height: 44,
          background: '#c8a86e',
          border: `2px solid ${color}`,
          transform: 'rotate(-5deg)',
          boxShadow: `0 0 10px ${color}66`,
        }}
      />
      {/* Top rod */}
      <div
        style={{
          position: 'absolute',
          top: -4,
          left: -4,
          width: 40,
          height: 8,
          background: '#8B6914',
          borderRadius: 4,
          border: '2px solid #5c440c',
        }}
      />
      {/* Bottom rod */}
      <div
        style={{
          position: 'absolute',
          bottom: -4,
          left: -4,
          width: 40,
          height: 8,
          background: '#8B6914',
          borderRadius: 4,
          border: '2px solid #5c440c',
        }}
      />
    </div>
  );
}

function GuildBoard({ color }: { color: string }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 56,
        height: 60,
      }}
    >
      {/* Board legs */}
      <div style={{ position: 'absolute', bottom: 0, left: 6, width: 6, height: 20, background: '#6b3a1f' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 6, width: 6, height: 20, background: '#6b3a1f' }} />
      {/* Board */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 46,
          background: '#8B5e3c',
          border: `3px solid ${color}`,
          boxShadow: `0 0 10px ${color}66`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <div className="font-pixel" style={{ fontSize: 4, color }}>GUILD</div>
        <div style={{ width: '70%', height: 2, background: color + '66' }} />
        <div style={{ fontSize: 14 }}>🏛️</div>
      </div>
    </div>
  );
}

function Anvil({ color }: { color: string }) {
  return (
    <div className="relative">
      {/* Sparks */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: -10 - i * 6,
            left: 8 + i * 9,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#f97316',
            animation: `ember-rise ${0.8 + i * 0.2}s ease-out ${i * 0.15}s infinite`,
            '--drift': `${(i % 2 === 0 ? 1 : -1) * 8}px`,
          } as React.CSSProperties}
        />
      ))}
      {/* Anvil top */}
      <div
        style={{
          width: 52,
          height: 18,
          background: '#374151',
          border: `2px solid ${color}`,
          boxShadow: `0 0 10px ${color}44`,
          borderRadius: '4px 4px 0 0',
        }}
      />
      {/* Anvil middle */}
      <div
        style={{
          width: 36,
          height: 10,
          background: '#4b5563',
          marginLeft: 8,
          border: `2px solid ${color}44`,
        }}
      />
      {/* Anvil base */}
      <div
        style={{
          width: 52,
          height: 12,
          background: '#1f2937',
          border: `2px solid ${color}44`,
        }}
      />
    </div>
  );
}

function TreasureChest({ color, visited }: { color: string; visited: boolean }) {
  return (
    <div className="relative" style={{ perspective: 80 }}>
      {/* Gold shine when visited */}
      {visited && (
        <div
          style={{
            position: 'absolute',
            top: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 18,
            animation: 'sparkle 1.5s ease-in-out infinite',
          }}
        >
          ✨
        </div>
      )}
      {/* Lid */}
      <div
        style={{
          width: 52,
          height: 20,
          background: '#b45309',
          border: `3px solid ${color}`,
          boxShadow: `0 0 14px ${color}88`,
          transformOrigin: 'bottom center',
          transform: visited ? 'rotateX(-110deg)' : 'rotateX(0deg)',
          transition: 'transform 0.5s ease-out',
        }}
      />
      {/* Body */}
      <div
        style={{
          width: 52,
          height: 28,
          background: '#92400e',
          border: `3px solid ${color}`,
          borderTop: 'none',
          boxShadow: `0 0 14px ${color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Lock */}
        <div
          style={{
            width: 14,
            height: 14,
            background: visited ? color : '#6b7280',
            border: `2px solid ${visited ? '#fff' : '#374151'}`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

function TavernNPC({ color }: { color: string }) {
  return (
    <div className="animate-npc-hover flex flex-col items-center">
      {/* Speech bubble */}
      <div
        className="font-pixel mb-1"
        style={{
          fontSize: 5,
          color: '#fff',
          background: '#1a1a2e',
          border: `2px solid ${color}`,
          padding: '2px 4px',
          position: 'relative',
        }}
      >
        Welcome!
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `6px solid ${color}`,
          }}
        />
      </div>
      {/* NPC body */}
      <div
        style={{
          width: 28,
          height: 36,
          background: '#7c3aed',
          border: `2px solid ${color}`,
          boxShadow: `0 0 12px ${color}66`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 3,
          gap: 2,
        }}
      >
        {/* Head */}
        <div
          style={{
            width: 16,
            height: 14,
            background: '#f4a261',
            border: '2px solid #3d2000',
          }}
        />
        {/* Body */}
        <div style={{ width: 22, height: 16, background: '#6d28d9' }} />
      </div>
    </div>
  );
}

// ─── Checkpoint component ─────────────────────────────────────────────────
const CHECKPOINT_OBJECTS: Record<ZoneId, React.FC<{ color: string; visited: boolean }>> = {
  crossroads: ({ color }) => <Signpost color={color} />,
  'scholars-hollow': ({ color }) => <GlowingBook color={color} />,
  academy: ({ color }) => <Scroll color={color} />,
  guild: ({ color }) => <GuildBoard color={color} />,
  forge: ({ color }) => <Anvil color={color} />,
  'quest-board': ({ color, visited }) => <TreasureChest color={color} visited={visited} />,
  tavern: ({ color }) => <TavernNPC color={color} />,
};

export default function Checkpoint({ zone, isNear, visited }: CheckpointProps) {
  const ObjectComp = CHECKPOINT_OBJECTS[zone.id];

  // Position relative to zone start
  const relX = zone.checkpointX - zone.startX;

  return (
    <div
      className="absolute"
      style={{
        left: relX - 28,
        top: GROUND_Y - 80,
        zIndex: 15,
      }}
    >
      <ObjectComp color={zone.accentColor} visited={visited} />

      {/* Glow ring under interactive objects when near */}
      {isNear && !visited && (
        <div
          style={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 56,
            height: 12,
            borderRadius: '50%',
            background: zone.accentColor + '33',
            boxShadow: `0 0 12px 4px ${zone.accentColor}55`,
          }}
        />
      )}

      {/* "Press E" prompt */}
      {isNear && (
        <div
          className="animate-prompt font-pixel"
          style={{
            position: 'absolute',
            top: -28,
            left: '50%',
            fontSize: 7,
            whiteSpace: 'nowrap',
            color: zone.accentColor,
            background: 'rgba(0,0,0,0.85)',
            border: `2px solid ${zone.accentColor}`,
            padding: '3px 6px',
          }}
        >
          [E] Talk
        </div>
      )}

      {/* Visited checkmark */}
      {visited && (
        <div
          className="font-pixel"
          style={{
            position: 'absolute',
            top: -20,
            right: -8,
            fontSize: 8,
            color: '#4ade80',
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
}
