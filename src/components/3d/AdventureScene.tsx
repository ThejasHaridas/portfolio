'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ZoneId } from '@/lib/gameData';
import FloatingIsland from './FloatingIsland';
import Ocean from './Ocean';
import Particles from './Particles';

interface AdventureSceneProps {
  onInteract: (zoneId: ZoneId) => void;
  visitedZones: Set<ZoneId>;
  dialogOpen: boolean;
}

// Island configuration - arranged in a circular/path layout
const ISLANDS: {
  zoneId: ZoneId;
  position: [number, number, number];
  label: string;
  color: string;
  icon: string;
  scale: number;
}[] = [
  {
    zoneId: 'crossroads',
    position: [0, 0, 0],
    label: 'Start',
    color: '#a3e635',
    icon: '🗺️',
    scale: 1.4,
  },
  {
    zoneId: 'scholars-hollow',
    position: [-6, 0.5, -4],
    label: 'About',
    color: '#a78bfa',
    icon: '📖',
    scale: 1.1,
  },
  {
    zoneId: 'academy',
    position: [2, 1.0, -8],
    label: 'Education',
    color: '#60a5fa',
    icon: '🎓',
    scale: 1.1,
  },
  {
    zoneId: 'guild',
    position: [8, 0.3, -3],
    label: 'Experience',
    color: '#fbbf24',
    icon: '🏛️',
    scale: 1.2,
  },
  {
    zoneId: 'forge',
    position: [-4, 0.8, -10],
    label: 'Skills',
    color: '#f97316',
    icon: '⚒️',
    scale: 1.2,
  },
  {
    zoneId: 'quest-board',
    position: [6, 1.2, -12],
    label: 'Projects',
    color: '#34d399',
    icon: '📜',
    scale: 1.3,
  },
  {
    zoneId: 'tavern',
    position: [0, 0.6, -15],
    label: 'Contact',
    color: '#e879f9',
    icon: '🍺',
    scale: 1.1,
  },
];

export default function AdventureScene({ onInteract, visitedZones, dialogOpen }: AdventureSceneProps) {
  const controlsRef = useRef(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Gentle light animation
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(t * 0.1) * 10;
      lightRef.current.position.z = Math.cos(t * 0.1) * 10;
    }
  });

  return (
    <>
      {/* Sky & Atmosphere */}
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 25, 50]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#8888ff" />
      <directionalLight
        ref={lightRef}
        position={[5, 15, 5]}
        intensity={0.8}
        color="#ffeedd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, -8]} intensity={0.5} color="#6366f1" distance={30} />
      <pointLight position={[-8, 8, -12]} intensity={0.3} color="#a78bfa" distance={25} />
      <pointLight position={[8, 6, -5]} intensity={0.3} color="#fbbf24" distance={20} />

      {/* Starfield */}
      <Stars
        radius={80}
        depth={60}
        count={3000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Ocean plane */}
      <Ocean />

      {/* Floating particle effects */}
      <Particles />

      {/* Floating Islands */}
      {ISLANDS.map((island) => (
        <FloatingIsland
          key={island.zoneId}
          zoneId={island.zoneId}
          position={island.position}
          label={island.label}
          color={island.color}
          icon={island.icon}
          scale={island.scale}
          visited={visitedZones.has(island.zoneId)}
          onInteract={onInteract}
          dialogOpen={dialogOpen}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={35}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
        target={[0, 0, -6]}
        autoRotate={!dialogOpen}
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}
