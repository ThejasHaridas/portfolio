'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 150;

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const offsets = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;       // x
      positions[i * 3 + 1] = Math.random() * 15 - 2;       // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;   // z
      speeds[i] = 0.1 + Math.random() * 0.3;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, speeds, offsets };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      // Gentle upward drift
      pos.array[idx + 1] += speeds[i] * 0.01;
      // Swirl
      pos.array[idx] += Math.sin(t * speeds[i] + offsets[i]) * 0.003;
      pos.array[idx + 2] += Math.cos(t * speeds[i] + offsets[i]) * 0.003;

      // Reset if too high
      if (pos.array[idx + 1] > 15) {
        pos.array[idx + 1] = -2;
        pos.array[idx] = (Math.random() - 0.5) * 40;
        pos.array[idx + 2] = (Math.random() - 0.5) * 40;
      }
    }
    pos.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#8888ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
