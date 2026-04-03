'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useCallback, useEffect } from 'react';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { ZoneId } from '@/lib/gameData';
import GameScene from './3d/GameScene';
import OverlayUI from './3d/OverlayUI';

// Key map for vehicle controls
const KEY_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'brake', keys: ['Space'] },
  { name: 'reset', keys: ['KeyR'] },
];

export default function Adventure3D() {
  const [started, setStarted] = useState(false);
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [visitedZones, setVisitedZones] = useState<Set<ZoneId>>(new Set());

  const handleZoneTrigger = useCallback((zoneId: ZoneId) => {
    setActiveZone(zoneId);
    setVisitedZones(prev => {
      const next = new Set(prev);
      next.add(zoneId);
      return next;
    });
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveZone(null);
  }, []);

  // Lock pointer / fullscreen hint
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setActiveZone(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!started) {
    return (
      <div className="fixed inset-0 bg-[#0a0a1a] flex flex-col items-center justify-center z-50">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
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
          {/* 3D-style title */}
          <div className="mb-2">
            <span
              className="font-pixel text-transparent bg-clip-text"
              style={{
                fontSize: 28,
                backgroundImage: 'linear-gradient(180deg, #fbbf24 0%, #f97316 100%)',
                textShadow: 'none',
                WebkitTextStroke: '0px',
              }}
            >
              THEJAS HARIDAS
            </span>
          </div>
          <p className="font-pixel text-gray-400 mb-2" style={{ fontSize: 8 }}>
            DATA SCIENCE · AI/ML · SOFTWARE ENGINEERING
          </p>

          <div
            className="my-8 mx-auto w-48 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }}
          />

          <p className="font-pixel text-gray-500 mb-8" style={{ fontSize: 7 }}>
            DRIVE AROUND · EXPLORE · DISCOVER
          </p>

          <button
            onClick={() => setStarted(true)}
            className="font-pixel px-10 py-4 border-2 border-yellow-500 text-yellow-400
                       hover:bg-yellow-500/20 hover:scale-105 transition-all duration-300 group"
            style={{ fontSize: 12 }}
          >
            <span className="group-hover:animate-pulse">▶ START</span>
          </button>

          <div className="mt-10 font-pixel text-gray-600 space-y-1" style={{ fontSize: 6 }}>
            <p>🚗 WASD / ARROWS to drive</p>
            <p>SPACE to brake · R to reset</p>
            <p>Drive into glowing zones to explore</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1a1a2e]">
      <KeyboardControls map={KEY_MAP}>
        <Canvas
          shadows
          camera={{ position: [0, 12, 16], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <Physics gravity={[0, -30, 0]} timeStep="vary">
              <GameScene
                onZoneTrigger={handleZoneTrigger}
                activeZone={activeZone}
                visitedZones={visitedZones}
              />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {/* Overlay UI */}
      <OverlayUI
        activeZone={activeZone}
        visitedZones={visitedZones}
        onClose={handleClosePanel}
      />

      {/* Controls hint */}
      {!activeZone && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div
            className="font-pixel text-gray-500 px-4 py-2"
            style={{
              fontSize: 6,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              borderRadius: 4,
            }}
          >
            WASD TO DRIVE · SPACE TO BRAKE · R TO RESET POSITION
          </div>
        </div>
      )}
    </div>
  );
}
