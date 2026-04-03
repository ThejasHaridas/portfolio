'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface VehicleProps {
  frozen: boolean;
}

const SPEED = 18;
const TURN_SPEED = 2.5;
const CAMERA_LERP = 0.05;
const CAMERA_OFFSET = new THREE.Vector3(0, 8, 14);

export default function Vehicle({ frozen }: VehicleProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Current heading angle
  const headingRef = useRef(0);
  const velocityRef = useRef(0);

  const [, getKeys] = useKeyboardControls();

  // Reset vehicle position
  const resetVehicle = () => {
    if (!bodyRef.current) return;
    bodyRef.current.setTranslation({ x: 0, y: 2, z: 0 }, true);
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    headingRef.current = 0;
    velocityRef.current = 0;
  };

  // Initialize position
  useEffect(() => {
    setTimeout(resetVehicle, 100);
  }, []);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;
    const keys = getKeys() as { forward: boolean; backward: boolean; left: boolean; right: boolean; brake: boolean; reset: boolean };

    if (keys.reset) {
      resetVehicle();
      return;
    }

    const pos = bodyRef.current.translation();

    // Fall off edge reset
    if (pos.y < -10) {
      resetVehicle();
      return;
    }

    if (!frozen) {
      // Steering
      let turnInput = 0;
      if (keys.left) turnInput += 1;
      if (keys.right) turnInput -= 1;

      // Throttle
      let throttle = 0;
      if (keys.forward) throttle = 1;
      if (keys.backward) throttle = -0.6;

      // Brake
      if (keys.brake) {
        velocityRef.current *= 0.92;
      }

      // Update velocity
      velocityRef.current += throttle * SPEED * delta;
      velocityRef.current *= 0.96; // friction

      // Clamp
      velocityRef.current = THREE.MathUtils.clamp(velocityRef.current, -SPEED * 0.5, SPEED);

      // Turn only when moving
      const speedFactor = Math.min(Math.abs(velocityRef.current) / 5, 1);
      headingRef.current += turnInput * TURN_SPEED * delta * speedFactor;

      // Compute forward direction
      const forwardX = -Math.sin(headingRef.current) * velocityRef.current;
      const forwardZ = -Math.cos(headingRef.current) * velocityRef.current;

      // Apply velocity (keep existing Y velocity for gravity)
      const currentVel = bodyRef.current.linvel();
      bodyRef.current.setLinvel(
        { x: forwardX, y: currentVel.y, z: forwardZ },
        true
      );

      // Rotate body
      const quat = new THREE.Quaternion();
      quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), headingRef.current);
      bodyRef.current.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
    } else {
      // When dialog open, slow to stop
      velocityRef.current *= 0.9;
      const currentVel = bodyRef.current.linvel();
      bodyRef.current.setLinvel(
        { x: currentVel.x * 0.9, y: currentVel.y, z: currentVel.z * 0.9 },
        true
      );
    }

    // Update visual mesh
    if (meshRef.current) {
      meshRef.current.position.set(pos.x, pos.y, pos.z);
      meshRef.current.rotation.y = headingRef.current;

      // Tilt based on velocity
      const tiltZ = -Math.sin(headingRef.current) * velocityRef.current * 0.003;
      const tiltX = -Math.cos(headingRef.current) * velocityRef.current * 0.003;
      meshRef.current.rotation.z = tiltZ;
      meshRef.current.rotation.x = tiltX;
    }

    // Camera follow
    const targetCamPos = new THREE.Vector3(
      pos.x + Math.sin(headingRef.current) * CAMERA_OFFSET.z,
      pos.y + CAMERA_OFFSET.y,
      pos.z + Math.cos(headingRef.current) * CAMERA_OFFSET.z,
    );
    camera.position.lerp(targetCamPos, CAMERA_LERP);
    camera.lookAt(pos.x, pos.y + 1, pos.z);
  });

  return (
    <>
      {/* Physics body */}
      <RigidBody
        ref={bodyRef}
        type="dynamic"
        mass={1}
        position={[0, 2, 0]}
        linearDamping={0.5}
        angularDamping={2}
        enabledRotations={[false, false, false]}
      >
        <CuboidCollider args={[0.7, 0.35, 1.1]} position={[0, 0.35, 0]} />
      </RigidBody>

      {/* Visual mesh (separate from physics for smooth rendering) */}
      <group ref={meshRef}>
        {/* Car body */}
        <mesh castShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[1.4, 0.5, 2.2]} />
          <meshStandardMaterial color="#ff6b35" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Cabin */}
        <mesh castShadow position={[0, 0.7, -0.15]}>
          <boxGeometry args={[1.1, 0.4, 1.2]} />
          <meshStandardMaterial color="#ff8855" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Windshield */}
        <mesh position={[0, 0.72, 0.4]}>
          <boxGeometry args={[0.9, 0.3, 0.05]} />
          <meshStandardMaterial color="#88ccff" roughness={0.1} metalness={0.8} transparent opacity={0.6} />
        </mesh>

        {/* Wheels */}
        {[
          [-0.65, 0.15, 0.7],
          [0.65, 0.15, 0.7],
          [-0.65, 0.15, -0.7],
          [0.65, 0.15, -0.7],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 12]} />
            <meshStandardMaterial color="#222" roughness={0.8} />
          </mesh>
        ))}

        {/* Headlights */}
        {[-0.4, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0.4, 1.1]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={2} />
          </mesh>
        ))}

        {/* Headlight beams */}
        <spotLight
          position={[0, 0.5, 1.2]}
          target-position={[0, 0, 10]}
          angle={0.4}
          penumbra={0.5}
          intensity={3}
          color="#ffffdd"
          distance={15}
          castShadow={false}
        />

        {/* Tail lights */}
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 0.35, -1.1]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>
    </>
  );
}
