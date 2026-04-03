'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ZoneId } from '@/lib/gameData';
import Vehicle from './Vehicle';
import World from './World';
import ZoneTriggers from './ZoneTriggers';

interface GameSceneProps {
  onZoneTrigger: (zoneId: ZoneId) => void;
  activeZone: ZoneId | null;
  visitedZones: Set<ZoneId>;
}

export default function GameScene({ onZoneTrigger, activeZone, visitedZones }: GameSceneProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      const t = clock.getElapsedTime() * 0.05;
      sunRef.current.position.x = Math.sin(t) * 30;
      sunRef.current.position.z = Math.cos(t) * 30;
    }
  });

  return (
    <>
      {/* Sky */}
      <color attach="background" args={['#1a1a2e']} />
      <fog attach="fog" args={['#1a1a2e', 60, 120]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#9090ff" />
      <directionalLight
        ref={sunRef}
        position={[20, 30, 20]}
        intensity={1.0}
        color="#ffeedd"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight args={['#4466aa', '#334422', 0.4]} />

      {/* Stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.3} fade speed={0.3} />

      {/* World geometry */}
      <World visitedZones={visitedZones} />

      {/* Zone triggers */}
      <ZoneTriggers onZoneTrigger={onZoneTrigger} activeZone={activeZone} />

      {/* Vehicle */}
      <Vehicle frozen={activeZone !== null} />
    </>
  );
}
