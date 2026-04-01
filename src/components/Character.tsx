'use client';

import { CHARACTER_WIDTH, CHARACTER_HEIGHT } from '@/lib/gameData';

interface CharacterProps {
  x: number;
  y: number;
  facing: 'left' | 'right';
  isWalking: boolean;
  walkFrame: number;
  domRef: React.RefObject<HTMLDivElement>;
}

// ─── Pixel art helpers ────────────────────────────────────────────────────
// Each pixel is [col, row, color]. Scale 4 means 1 logical pixel = 4×4 CSS px.
type Pixel = [number, number, string];
const S = 4; // pixel scale

function pixelsToBoxShadow(pixels: Pixel[]): string {
  return pixels
    .map(([x, y, c]) => `${x * S}px ${y * S}px 0 ${S - 1}px ${c}`)
    .join(', ');
}

// ─── Color palette ────────────────────────────────────────────────────────
const SK = '#f4a261'; // skin
const HA = '#3d2000'; // hair / dark
const SH = '#2563eb'; // shirt (blue brand)
const PA = '#1e3a5f'; // pants
const SH2 = '#1d4ed8'; // shirt shadow
// const SK2 = '#e0875a'; // skin shadow (reserved)
const WH = '#ffffff'; // white (eyes)
const BK = '#000000'; // black (outline)

// ─── Sprite frames (8 cols × 12 rows) ────────────────────────────────────
const IDLE: Pixel[] = [
  // Head (rows 0-3)
  [2,0,HA],[3,0,HA],[4,0,HA],[5,0,HA],
  [1,1,HA],[2,1,SK],[3,1,SK],[4,1,SK],[5,1,SK],[6,1,HA],
  [1,2,SK],[2,2,SK],[3,2,WH],[4,2,WH],[5,2,SK],[6,2,SK],
  [1,3,SK],[2,3,SK],[3,3,BK],[4,3,BK],[5,3,SK],[6,3,SK],
  // Body/shirt (rows 4-5)
  [2,4,SH],[3,4,SH],[4,4,SH],[5,4,SH],
  [1,5,SH2],[2,5,SH],[3,5,SH],[4,5,SH],[5,5,SH],[6,5,SH2],
  // Arms idle (rows 5-7)
  [0,5,SK],[7,5,SK],
  [0,6,SK],[7,6,SK],
  [1,6,SH],[2,6,SH],[3,6,SH],[4,6,SH],[5,6,SH],[6,6,SH],
  [1,7,SH],[6,7,SH],
  // Legs (rows 8-9)
  [2,8,PA],[3,8,PA],[4,8,PA],[5,8,PA],
  [2,9,PA],[3,9,PA],[4,9,PA],[5,9,PA],
  // Feet idle (rows 10-11)
  [2,10,BK],[3,10,BK],[4,10,BK],[5,10,BK],
  [2,11,BK],[3,11,BK],[4,11,BK],[5,11,BK],
];

const WALK_A: Pixel[] = [
  // Head
  [2,0,HA],[3,0,HA],[4,0,HA],[5,0,HA],
  [1,1,HA],[2,1,SK],[3,1,SK],[4,1,SK],[5,1,SK],[6,1,HA],
  [1,2,SK],[2,2,SK],[3,2,WH],[4,2,WH],[5,2,SK],[6,2,SK],
  [1,3,SK],[2,3,SK],[3,3,BK],[4,3,BK],[5,3,SK],[6,3,SK],
  // Body
  [2,4,SH],[3,4,SH],[4,4,SH],[5,4,SH],
  [1,5,SH2],[2,5,SH],[3,5,SH],[4,5,SH],[5,5,SH],[6,5,SH2],
  // Arms walk A (right arm forward, left back)
  [0,4,SK],[1,5,SK],[0,6,SK],  // left arm back
  [6,5,SK],[7,6,SK],[7,7,SK],  // right arm forward
  [1,6,SH],[2,6,SH],[3,6,SH],[4,6,SH],[5,6,SH],[6,6,SH],
  // Legs A (left forward, right back)
  [2,8,PA],[3,8,PA],[4,8,PA],[5,8,PA],
  [2,9,PA],[3,9,PA],[4,9,PA],[5,9,PA],
  // Left foot forward
  [1,10,BK],[2,10,BK],[3,10,BK],
  [1,11,BK],[2,11,BK],
  // Right foot back
  [4,10,BK],[5,10,BK],[6,10,BK],
  [5,11,BK],[6,11,BK],
];

const WALK_B: Pixel[] = [
  // Head
  [2,0,HA],[3,0,HA],[4,0,HA],[5,0,HA],
  [1,1,HA],[2,1,SK],[3,1,SK],[4,1,SK],[5,1,SK],[6,1,HA],
  [1,2,SK],[2,2,SK],[3,2,WH],[4,2,WH],[5,2,SK],[6,2,SK],
  [1,3,SK],[2,3,SK],[3,3,BK],[4,3,BK],[5,3,SK],[6,3,SK],
  // Body
  [2,4,SH],[3,4,SH],[4,4,SH],[5,4,SH],
  [1,5,SH2],[2,5,SH],[3,5,SH],[4,5,SH],[5,5,SH],[6,5,SH2],
  // Arms walk B (opposite of A)
  [7,4,SK],[6,5,SK],[7,6,SK],  // right arm back
  [0,5,SK],[0,6,SK],[0,7,SK],  // left arm forward
  [1,6,SH],[2,6,SH],[3,6,SH],[4,6,SH],[5,6,SH],[6,6,SH],
  // Legs B (right forward, left back)
  [2,8,PA],[3,8,PA],[4,8,PA],[5,8,PA],
  [2,9,PA],[3,9,PA],[4,9,PA],[5,9,PA],
  // Right foot forward
  [4,10,BK],[5,10,BK],[6,10,BK],
  [5,11,BK],[6,11,BK],
  // Left foot back
  [1,10,BK],[2,10,BK],[3,10,BK],
  [1,11,BK],[2,11,BK],
];

// ─── Precomputed shadow strings ───────────────────────────────────────────
const SHADOW_IDLE   = pixelsToBoxShadow(IDLE);
const SHADOW_WALK_A = pixelsToBoxShadow(WALK_A);
const SHADOW_WALK_B = pixelsToBoxShadow(WALK_B);

export default function Character({
  x,
  y,
  facing,
  isWalking,
  walkFrame,
  domRef,
}: CharacterProps) {
  const shadow = isWalking
    ? walkFrame % 2 === 0 ? SHADOW_WALK_A : SHADOW_WALK_B
    : SHADOW_IDLE;

  return (
    <div
      ref={domRef}
      className="absolute pixel-art"
      style={{
        left: x,
        top: y - CHARACTER_HEIGHT,
        width: CHARACTER_WIDTH,
        height: CHARACTER_HEIGHT,
        // character drop shadow
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
        // flip horizontally when facing left
        transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        transformOrigin: 'center center',
        willChange: 'transform, left, top',
        zIndex: 20,
      }}
    >
      {/* The pixel unit — the box-shadow paints the full character */}
      <div
        className="pixel-art"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: S,
          height: S,
          background: 'transparent',
          boxShadow: shadow,
        }}
      />

      {/* Character shadow on ground */}
      <div
        style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 28,
          height: 6,
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '50%',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
}
