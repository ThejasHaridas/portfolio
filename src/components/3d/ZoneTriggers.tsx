'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ZoneId } from '@/lib/gameData';

interface ZoneTriggersProps {
  onZoneTrigger: (zoneId: ZoneId) => void;
  activeZone: ZoneId | null;
}

const ZONE_CONFIG: { zoneId: ZoneId; position: [number, number, number]; color: string }[] = [
  { zoneId: 'crossroads', position: [0, 0, 0], color: '#a3e635' },
  { zoneId: 'scholars-hollow', position: [-18, 0, -8], color: '#a78bfa' },
  { zoneId: 'academy', position: [14, 0, -20], color: '#60a5fa' },
  { zoneId: 'guild', position: [22, 0, 5], color: '#fbbf24' },
  { zoneId: 'forge', position: [-10, 0, -25], color: '#f97316' },
  { zoneId: 'quest-board', position: [-22, 0, 12], color: '#34d399' },
  { zoneId: 'tavern', position: [5, 0, -38], color: '#e879f9' },
];

export default function ZoneTriggers({ onZoneTrigger, activeZone }: ZoneTriggersProps) {
  return (
    <>
      {ZONE_CONFIG.map((zone) => (
        <ZoneSensor
          key={zone.zoneId}
          zoneId={zone.zoneId}
          position={zone.position}
          color={zone.color}
          onTrigger={onZoneTrigger}
          isActive={activeZone === zone.zoneId}
        />
      ))}
    </>
  );
}

function ZoneSensor({
  zoneId,
  position,
  color,
  onTrigger,
  isActive,
}: {
  zoneId: ZoneId;
  position: [number, number, number];
  color: string;
  onTrigger: (zoneId: ZoneId) => void;
  isActive: boolean;
}) {
  const cooldownRef = useRef(false);
  const groundRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groundRingRef.current) {
      const t = clock.getElapsedTime();
      const mat = groundRingRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1 + Math.sin(t * 2 + position[0]) * 0.5;
    }
  });

  const handleIntersection = () => {
    if (cooldownRef.current || isActive) return;
    cooldownRef.current = true;
    onTrigger(zoneId);
    setTimeout(() => {
      cooldownRef.current = false;
    }, 2000);
  };

  return (
    <group position={position}>
      {/* Trigger zone - sensor only, no physics collision */}
      <RigidBody type="fixed" sensor onIntersectionEnter={handleIntersection}>
        <CuboidCollider args={[3, 3, 3]} position={[0, 2, 0]} sensor />
      </RigidBody>

      {/* Animated ground ring indicator */}
      <mesh
        ref={groundRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <ringGeometry args={[2.5, 3, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
