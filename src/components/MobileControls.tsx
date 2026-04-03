'use client';

interface MobileControlsProps {
  onLeft: (pressed: boolean) => void;
  onRight: (pressed: boolean) => void;
  onInteract: () => void;
}

export default function MobileControls({
  onLeft,
  onRight,
  onInteract,
}: MobileControlsProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-between items-end px-4 md:hidden pointer-events-none">
      {/* D-pad */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onPointerDown={() => onLeft(true)}
          onPointerUp={() => onLeft(false)}
          onPointerLeave={() => onLeft(false)}
          onPointerCancel={() => onLeft(false)}
          className="select-none touch-none"
          style={{
            width: 56,
            height: 56,
            background: 'rgba(0,0,0,0.8)',
            border: '3px solid rgba(202,138,4,0.7)',
            color: '#ca8a04',
            fontFamily: 'monospace',
            fontSize: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            borderRadius: 4,
            boxShadow: '0 0 10px rgba(202,138,4,0.3)',
          }}
          aria-label="Move Left"
        >
          ◀
        </button>
        <button
          onPointerDown={() => onRight(true)}
          onPointerUp={() => onRight(false)}
          onPointerLeave={() => onRight(false)}
          onPointerCancel={() => onRight(false)}
          className="select-none touch-none"
          style={{
            width: 56,
            height: 56,
            background: 'rgba(0,0,0,0.8)',
            border: '3px solid rgba(202,138,4,0.7)',
            color: '#ca8a04',
            fontFamily: 'monospace',
            fontSize: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            borderRadius: 4,
            boxShadow: '0 0 10px rgba(202,138,4,0.3)',
          }}
          aria-label="Move Right"
        >
          ▶
        </button>
      </div>

      {/* Interact button */}
      <button
        onPointerDown={onInteract}
        className="select-none touch-none pointer-events-auto"
        style={{
          width: 64,
          height: 64,
          background: 'rgba(0,0,0,0.8)',
          border: '3px solid rgba(168,85,247,0.7)',
          color: '#a855f7',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          boxShadow: '0 0 10px rgba(168,85,247,0.3)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        aria-label="Interact"
      >
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#a855f7' }}>E</span>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: '#6b7280' }}>
          TALK
        </span>
      </button>
    </div>
  );
}
