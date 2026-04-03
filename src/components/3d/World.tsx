'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { ZoneId } from '@/lib/gameData';

interface WorldProps {
  visitedZones: Set<ZoneId>;
}

// Zone positions in world space - spread out for driving
const ZONE_POSITIONS: Record<ZoneId, [number, number, number]> = {
  crossroads: [0, 0, 0],
  'scholars-hollow': [-18, 0, -8],
  academy: [14, 0, -20],
  guild: [22, 0, 5],
  forge: [-10, 0, -25],
  'quest-board': [-22, 0, 12],
  tavern: [5, 0, -38],
};

const ZONE_COLORS: Record<ZoneId, string> = {
  crossroads: '#a3e635',
  'scholars-hollow': '#a78bfa',
  academy: '#60a5fa',
  guild: '#fbbf24',
  forge: '#f97316',
  'quest-board': '#34d399',
  tavern: '#e879f9',
};

export default function World({ visitedZones }: WorldProps) {
  return (
    <>
      {/* Main ground plane */}
      <RigidBody type="fixed" friction={1}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -10]}>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#1a2a1a" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* Grid lines on ground */}
      <gridHelper args={[120, 60, '#ffffff08', '#ffffff05']} position={[0, 0.01, -10]} />

      {/* Roads connecting zones */}
      <Roads />

      {/* Zone platforms & decorations */}
      {(Object.entries(ZONE_POSITIONS) as [ZoneId, [number, number, number]][]).map(([zoneId, pos]) => (
        <ZonePlatform
          key={zoneId}
          zoneId={zoneId}
          position={pos}
          color={ZONE_COLORS[zoneId]}
          visited={visitedZones.has(zoneId)}
        />
      ))}

      {/* Scattered environment objects */}
      <EnvironmentProps />

      {/* Ramps for fun */}
      <Ramp position={[8, 0, -8]} rotation={0} />
      <Ramp position={[-14, 0, -16]} rotation={Math.PI / 3} />
      <Ramp position={[18, 0, -10]} rotation={-Math.PI / 4} />

      {/* Boundary walls (invisible) */}
      <Boundaries />
    </>
  );
}

// ─── Zone Platform ────────────────────────────────────────────────────────
function ZonePlatform({
  position,
  color,
  visited,
}: {
  zoneId: ZoneId;
  position: [number, number, number];
  color: string;
  visited: boolean;
}) {
  const beaconRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beaconRef.current) {
      beaconRef.current.scale.y = 1 + Math.sin(t * 2 + position[0]) * 0.3;
      (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.5 + Math.sin(t * 3) * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Platform base */}
      <RigidBody type="fixed" friction={1}>
        <mesh receiveShadow castShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[4, 4.5, 0.3, 32]} />
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.2)} roughness={0.7} metalness={0.3} />
        </mesh>
      </RigidBody>

      {/* Glowing ring on platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
        <ringGeometry args={[3.2, 3.6, 32]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Beacon pillar */}
      <mesh ref={beaconRef} position={[0, 3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Floating orb */}
      <mesh position={[0, 6, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>

      {/* Orb glow */}
      <mesh position={[0, 6, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color={threeColor} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {/* Spinning ring around orb */}
      <mesh ref={ringRef} position={[0, 6, 0]}>
        <torusGeometry args={[0.8, 0.03, 8, 32]} />
        <meshStandardMaterial color={threeColor} emissive={threeColor} emissiveIntensity={1} />
      </mesh>

      {/* Point light */}
      <pointLight position={[0, 5, 0]} color={color} intensity={3} distance={12} />

      {/* Decorative pillars */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => {
        const x = Math.cos(angle) * 3.8;
        const z = Math.sin(angle) * 3.8;
        return (
          <RigidBody key={i} type="fixed">
            <mesh castShadow position={[x, 0.8, z]}>
              <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
              <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.4)} roughness={0.6} metalness={0.4} />
            </mesh>
            {/* Pillar top light */}
            <mesh position={[x, 1.7, z]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color={threeColor}
                emissive={threeColor}
                emissiveIntensity={2}
              />
            </mesh>
          </RigidBody>
        );
      })}

      {/* Visited checkmark or label floating text indicator */}
      {visited && (
        <mesh position={[0, 7.5, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={3} />
        </mesh>
      )}
    </group>
  );
}

// ─── Roads ────────────────────────────────────────────────────────────────
function Roads() {
  // Create simple road strips between zones
  const roads = [
    { from: [0, 0, 0], to: [-18, 0, -8] },
    { from: [0, 0, 0], to: [14, 0, -20] },
    { from: [0, 0, 0], to: [22, 0, 5] },
    { from: [0, 0, 0], to: [-10, 0, -25] },
    { from: [-18, 0, -8], to: [-22, 0, 12] },
    { from: [14, 0, -20], to: [5, 0, -38] },
    { from: [-10, 0, -25], to: [5, 0, -38] },
    { from: [22, 0, 5], to: [14, 0, -20] },
    { from: [-18, 0, -8], to: [-10, 0, -25] },
  ];

  return (
    <>
      {roads.map((road, i) => {
        const from = new THREE.Vector3(...road.from);
        const to = new THREE.Vector3(...road.to);
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const dir = to.clone().sub(from);
        const length = dir.length();
        const angle = Math.atan2(dir.x, dir.z);

        return (
          <mesh
            key={i}
            position={[mid.x, 0.02, mid.z]}
            rotation={[-Math.PI / 2, 0, -angle]}
            receiveShadow
          >
            <planeGeometry args={[2, length]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
          </mesh>
        );
      })}
    </>
  );
}

// ─── Ramp ─────────────────────────────────────────────────────────────────
function Ramp({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <RigidBody type="fixed" position={position} rotation={[0, rotation, 0]} friction={0.8}>
      <mesh castShadow receiveShadow rotation={[-0.2, 0, 0]} position={[0, 0.4, 0]}>
        <boxGeometry args={[2.5, 0.2, 4]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Ramp support */}
      <mesh castShadow position={[0, 0.15, -1.2]}>
        <boxGeometry args={[2.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#cc5522" roughness={0.7} />
      </mesh>
    </RigidBody>
  );
}

// ─── Environment Props ────────────────────────────────────────────────────
function EnvironmentProps() {
  // Scatter rocks, small objects
  const props = useMemo(() => {
    const items = [];
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80 - 10;
      // Skip if too close to zones
      const tooClose = Object.values(ZONE_POSITIONS).some(
        (zp) => Math.hypot(x - zp[0], z - zp[2]) < 7
      );
      if (tooClose) continue;

      items.push({
        position: [x, 0, z] as [number, number, number],
        scale: 0.3 + Math.random() * 0.8,
        type: Math.random() > 0.5 ? 'rock' : 'crystal',
      });
    }
    return items;
  }, []);

  return (
    <>
      {props.map((prop, i) => (
        <RigidBody key={i} type="fixed">
          {prop.type === 'rock' ? (
            <mesh castShadow position={prop.position}>
              <dodecahedronGeometry args={[prop.scale, 0]} />
              <meshStandardMaterial
                color={`hsl(${200 + Math.random() * 40}, 10%, ${15 + Math.random() * 10}%)`}
                roughness={0.9}
              />
            </mesh>
          ) : (
            <mesh castShadow position={[prop.position[0], prop.scale * 0.5, prop.position[2]]}>
              <octahedronGeometry args={[prop.scale * 0.4, 0]} />
              <meshStandardMaterial
                color={`hsl(${250 + Math.random() * 60}, 60%, 50%)`}
                emissive={`hsl(${250 + Math.random() * 60}, 60%, 30%)`}
                emissiveIntensity={0.5}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
          )}
        </RigidBody>
      ))}

      {/* Tall crystal formations at edges */}
      {[
        [30, 0, -30],
        [-30, 0, -35],
        [-35, 0, 10],
        [35, 0, -5],
        [10, 0, -50],
        [-25, 0, -45],
      ].map((pos, i) => (
        <group key={`tall-${i}`} position={pos as [number, number, number]}>
          <RigidBody type="fixed">
            <mesh castShadow position={[0, 2, 0]}>
              <coneGeometry args={[0.6, 4, 5]} />
              <meshStandardMaterial
                color={`hsl(${260 + i * 20}, 50%, 25%)`}
                emissive={`hsl(${260 + i * 20}, 50%, 15%)`}
                emissiveIntensity={0.3}
                roughness={0.4}
                metalness={0.6}
              />
            </mesh>
          </RigidBody>
          <pointLight
            position={[0, 4, 0]}
            color={`hsl(${260 + i * 20}, 70%, 60%)`}
            intensity={0.5}
            distance={8}
          />
        </group>
      ))}
    </>
  );
}

// ─── Boundaries ───────────────────────────────────────────────────────────
function Boundaries() {
  const size = 60;
  return (
    <>
      {/* Invisible walls */}
      {[
        [0, 2, -size - 10],   // North
        [0, 2, size - 10],    // South
        [-size, 2, -10],      // West
        [size, 2, -10],       // East
      ].map((pos, i) => (
        <RigidBody key={i} type="fixed" position={pos as [number, number, number]}>
          <CuboidCollider args={[i < 2 ? size : 1, 5, i < 2 ? 1 : size]} />
        </RigidBody>
      ))}
    </>
  );
}
