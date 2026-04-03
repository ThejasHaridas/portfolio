'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useCallback } from 'react';
import { ZoneId, DIALOGS } from '@/lib/gameData';
import AdventureScene from './3d/AdventureScene';
import DialogBox from './DialogBox';
import AdventureHUD from './3d/AdventureHUD';

export default function Adventure3D() {
  const [started, setStarted] = useState(false);
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [visitedZones, setVisitedZones] = useState<Set<ZoneId>>(new Set());
  const [showDialog, setShowDialog] = useState(false);

  const handleInteract = useCallback((zoneId: ZoneId) => {
    setActiveZone(zoneId);
    setShowDialog(true);
    setVisitedZones(prev => {
      const next = new Set(prev);
      next.add(zoneId);
      return next;
    });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowDialog(false);
    setActiveZone(null);
  }, []);

  if (!started) {
    return (
      <div className="fixed inset-0 bg-[#0a0a1a] flex flex-col items-center justify-center z-50">
        {/* Starfield background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                '--duration': `${2 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4">
          <h1
            className="font-pixel text-yellow-400 mb-4"
            style={{ fontSize: 20, textShadow: '0 0 30px rgba(250,204,21,0.5)' }}
          >
            THEJAS HARIDAS
          </h1>
          <p className="font-pixel text-gray-400 mb-2" style={{ fontSize: 8 }}>
            DATA SCIENCE · AI/ML · SOFTWARE ENGINEERING
          </p>
          <p className="font-pixel text-gray-500 mb-10" style={{ fontSize: 7 }}>
            ─── A 3D ADVENTURE PORTFOLIO ───
          </p>

          <button
            onClick={() => setStarted(true)}
            className="font-pixel px-8 py-4 border-2 border-yellow-500 text-yellow-400
                       hover:bg-yellow-500/20 transition-all duration-300 animate-pulse"
            style={{ fontSize: 10 }}
          >
            ▶ BEGIN ADVENTURE
          </button>

          <div className="mt-8 font-pixel text-gray-600" style={{ fontSize: 6 }}>
            <p>WASD / Arrow Keys to move · Click islands to explore</p>
            <p className="mt-1">Scroll to zoom · Drag to rotate</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#050510]">
      <Canvas
        camera={{ position: [0, 8, 18], fov: 55 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <AdventureScene
            onInteract={handleInteract}
            visitedZones={visitedZones}
            dialogOpen={showDialog}
          />
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <AdventureHUD visitedZones={visitedZones} currentZone={activeZone} />

      {/* Dialog overlay */}
      {showDialog && activeZone && (
        <DialogBox
          dialog={DIALOGS[activeZone]}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}
