'use client';

import { ZoneId, ZONES } from '@/lib/gameData';

interface AdventureHUDProps {
  visitedZones: Set<ZoneId>;
  currentZone: ZoneId | null;
}

const ZONE_ICONS: Record<ZoneId, { icon: string; label: string; color: string }> = {
  crossroads: { icon: '🗺️', label: 'Start', color: '#a3e635' },
  'scholars-hollow': { icon: '📖', label: 'About', color: '#a78bfa' },
  academy: { icon: '🎓', label: 'Education', color: '#60a5fa' },
  guild: { icon: '🏛️', label: 'Experience', color: '#fbbf24' },
  forge: { icon: '⚒️', label: 'Skills', color: '#f97316' },
  'quest-board': { icon: '📜', label: 'Projects', color: '#34d399' },
  tavern: { icon: '🍺', label: 'Contact', color: '#e879f9' },
};

export default function AdventureHUD({ visitedZones, currentZone }: AdventureHUDProps) {
  const progress = Math.round((visitedZones.size / ZONES.length) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
      >
        {/* Title */}
        <div className="font-pixel text-yellow-400" style={{ fontSize: 8 }}>
          ⚔ ADVENTURE PORTFOLIO
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="font-pixel text-gray-400" style={{ fontSize: 7 }}>
            {visitedZones.size}/{ZONES.length} DISCOVERED
          </div>
          <div className="w-24 h-2 bg-gray-800/80 border border-gray-700 overflow-hidden">
            <div
              className="h-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #a3e635, #34d399)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Zone indicators */}
      <div className="flex justify-center gap-2 mt-1">
        {ZONES.map((zone) => {
          const info = ZONE_ICONS[zone.id];
          const isVisited = visitedZones.has(zone.id);
          const isCurrent = currentZone === zone.id;

          return (
            <div
              key={zone.id}
              className="flex flex-col items-center"
              style={{ opacity: isVisited ? 1 : 0.4 }}
            >
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full border text-xs"
                style={{
                  borderColor: isCurrent ? info.color : isVisited ? info.color + '88' : '#374151',
                  background: isCurrent ? info.color + '33' : 'rgba(0,0,0,0.5)',
                  boxShadow: isCurrent ? `0 0 10px ${info.color}66` : 'none',
                }}
              >
                {info.icon}
              </div>
              <span
                className="font-pixel mt-0.5 hidden sm:block"
                style={{
                  fontSize: 5,
                  color: isVisited ? info.color : '#4b5563',
                }}
              >
                {info.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Controls hint - bottom */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <div
          className="font-pixel text-gray-500 px-4 py-2 rounded"
          style={{
            fontSize: 6,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        >
          🖱 DRAG TO ROTATE · SCROLL TO ZOOM · CLICK ISLANDS TO EXPLORE
        </div>
      </div>
    </div>
  );
}
