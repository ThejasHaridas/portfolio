'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ZoneId } from '@/lib/gameData';

interface FloatingIslandProps {
  zoneId: ZoneId;
  position: [number, number, number];
  label: string;
  color: string;
  icon: string;
  scale: number;
  visited: boolean;
  onInteract: (zoneId: ZoneId) => void;
  dialogOpen: boolean;
}

export default function FloatingIsland({
  zoneId,
  position,
  label,
  color,
  icon,
  scale,
  visited,
  onInteract,
  dialogOpen,
}: FloatingIslandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const threeColor = useMemo(() => new THREE.Color(color), [color]);
  const darkColor = useMemo(() => new THREE.Color(color).multiplyScalar(0.3), [color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 2 + position[0]) * 0.1;
    }

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.5;
      ringRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }
  });

  const handleClick = () => {
    if (!dialogOpen) {
      onInteract(zoneId);
    }
  };

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.5}
      floatingRange={[-0.2, 0.2]}
    >
      <group
        ref={groupRef}
        position={position}
        scale={hovered ? scale * 1.05 : scale}
        onClick={handleClick}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {/* Main island body — flattened sphere */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 32, 24]} />
          <MeshDistortMaterial
            color={darkColor}
            roughness={0.8}
            metalness={0.1}
            distort={0.15}
            speed={1.5}
          />
        </mesh>

        {/* Top surface - flat disc */}
        <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.1, 32]} />
          <meshStandardMaterial
            color={darkColor}
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Bottom stalactite */}
        <mesh position={[0, -0.8, 0]}>
          <coneGeometry args={[0.8, 1.5, 8]} />
          <meshStandardMaterial
            color={new THREE.Color(color).multiplyScalar(0.15)}
            roughness={0.9}
          />
        </mesh>

        {/* Glowing orb on top */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color={threeColor}
            emissive={threeColor}
            emissiveIntensity={hovered ? 3 : 1.5}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>

        {/* Orb glow halo */}
        <mesh ref={glowRef} position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial
            color={threeColor}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Floating ring */}
        <mesh ref={ringRef} position={[0, 1.3, 0]}>
          <torusGeometry args={[0.5, 0.02, 8, 32]} />
          <meshStandardMaterial
            color={threeColor}
            emissive={threeColor}
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Point light from orb */}
        <pointLight
          position={[0, 1.5, 0]}
          color={color}
          intensity={hovered ? 3 : 1}
          distance={5}
        />

        {/* Small decorative crystals */}
        {[0, 1, 2].map(i => {
          const angle = (i / 3) * Math.PI * 2;
          const x = Math.cos(angle) * 0.7;
          const z = Math.sin(angle) * 0.7;
          return (
            <mesh key={i} position={[x, 0.7, z]} rotation={[0, angle, 0.2]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color={threeColor}
                emissive={threeColor}
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}

        {/* Tiny floating particles around island */}
        {Array.from({ length: 6 }).map((_, i) => (
          <IslandParticle key={i} index={i} color={color} />
        ))}

        {/* Visited checkmark */}
        {visited && (
          <Html position={[0.8, 2.0, 0]} center distanceFactor={8}>
            <div
              className="font-pixel text-green-400 select-none"
              style={{
                fontSize: 14,
                textShadow: '0 0 10px rgba(74,222,128,0.8)',
              }}
            >
              ✓
            </div>
          </Html>
        )}

        {/* Label */}
        <Html position={[0, 2.2, 0]} center distanceFactor={10}>
          <div
            className="font-pixel text-center select-none pointer-events-none whitespace-nowrap"
            style={{
              fontSize: 8,
              color: color,
              textShadow: `0 0 12px ${color}88`,
              opacity: hovered ? 1 : 0.8,
              transform: `scale(${hovered ? 1.1 : 1})`,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
            {label}
            {hovered && (
              <div
                className="animate-pulse mt-1"
                style={{ fontSize: 6, color: '#ffffff88' }}
              >
                CLICK TO EXPLORE
              </div>
            )}
          </div>
        </Html>
      </group>
    </Float>
  );
}

// Small animated particles floating around each island
function IslandParticle({ color }: { index: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => 0.5 + Math.random() * 0.5, []);
  const radius = useMemo(() => 1.2 + Math.random() * 0.5, []);
  const yOff = useMemo(() => 0.5 + Math.random() * 1.5, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = yOff + Math.sin(t * 2) * 0.2;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(t * 3) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}
