'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#050520') },
      uColor2: { value: new THREE.Color('#0a1628') },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      const pos = geo.attributes.position;
      const time = clock.getElapsedTime();

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const y =
          Math.sin(x * 0.3 + time * 0.5) * 0.15 +
          Math.cos(z * 0.4 + time * 0.3) * 0.1 +
          Math.sin((x + z) * 0.2 + time * 0.2) * 0.08;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -6]} receiveShadow>
      <planeGeometry args={[80, 80, 60, 60]} />
      <meshStandardMaterial
        color="#060818"
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
