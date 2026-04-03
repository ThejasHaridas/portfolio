'use client';

import { Zone, ZoneId, WORLD_WIDTH } from '@/lib/gameData';

interface GameHUDProps {
  zones: Zone[];
  visitedZones: Set<ZoneId>;
  charX: number;
}

export default function GameHUD({ zones, visitedZones, charX }: GameHUDProps) {
  const progressPercent = Math.min(100, (charX / WORLD_WIDTH) * 100);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-3 py-2"
      style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        borderBottom: '2px solid rgba(202,138,4,0.3)',
      }}
    >
      {/* Title */}
      <div
        className="font-pixel flex-shrink-0 hidden sm:block"
        style={{ fontSize: 7, color: '#ca8a04', letterSpacing: 1 }}
      >
        TH
      </div>

      {/* Progress bar */}
      <div className="flex-1 relative" style={{ height: 20 }}>
        {/* Track */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '2px solid rgba(202,138,4,0.5)',
          }}
        />

        {/* Filled portion */}
        <div
          className="absolute top-0 left-0 bottom-0"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #92400e44, #ca8a0444)',
            transition: 'width 0.1s linear',
          }}
        />

        {/* Zone markers */}
        {zones.map((zone) => {
          const zonePercent = (zone.startX / WORLD_WIDTH) * 100;
          const cpPercent = (zone.checkpointX / WORLD_WIDTH) * 100;
          const isVisited = visitedZones.has(zone.id);

          return (
            <div key={zone.id}>
              {/* Zone start divider */}
              <div
                style={{
                  position: 'absolute',
                  left: `${zonePercent}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: zone.accentColor + '33',
                }}
              />
              {/* Checkpoint dot */}
              <div
                style={{
                  position: 'absolute',
                  left: `${cpPercent}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: isVisited ? 8 : 6,
                  height: isVisited ? 8 : 6,
                  borderRadius: '50%',
                  background: isVisited ? zone.accentColor : '#374151',
                  border: `1px solid ${zone.accentColor}`,
                  boxShadow: isVisited ? `0 0 6px ${zone.accentColor}` : 'none',
                  zIndex: 2,
                }}
              />
            </div>
          );
        })}

        {/* Character marker */}
        <div
          style={{
            position: 'absolute',
            left: `${progressPercent}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 10,
            height: 14,
            background: '#fbbf24',
            clipPath: 'polygon(50% 0%, 100% 60%, 75% 60%, 75% 100%, 25% 100%, 25% 60%, 0% 60%)',
            zIndex: 3,
            boxShadow: '0 0 6px #fbbf24',
            transition: 'left 0.1s linear',
          }}
        />
      </div>

      {/* Controls hint */}
      <div className="flex-shrink-0 hidden md:flex gap-3">
        {[
          { key: '← →', label: 'Move' },
          { key: 'E', label: 'Talk' },
          { key: 'ESC', label: 'Close' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1">
            <div
              className="font-pixel"
              style={{
                fontSize: 6,
                color: '#fbbf24',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(202,138,4,0.5)',
                padding: '1px 4px',
              }}
            >
              {key}
            </div>
            <span className="font-pixel" style={{ fontSize: 6, color: '#6b7280' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Visited count */}
      <div className="flex-shrink-0">
        <span className="font-pixel" style={{ fontSize: 7, color: '#4ade80' }}>
          {visitedZones.size}/{zones.length}
        </span>
        <span className="font-pixel ml-1" style={{ fontSize: 7, color: '#374151' }}>
          ⬡
        </span>
      </div>
    </div>
  );
}
