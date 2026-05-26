interface OrbitalRingProps {
  size: number; // Avatar size in px
  orbitRadius?: number; // Orbital ring radius (default: size * 0.6)
  pointCount?: number; // Number of orbital points (default: 8)
  speed?: number; // Rotation speed multiplier (default: 1)
  paused?: boolean; // Pause animation (focus mode or calm mode)
  opacity?: number; // Ring opacity 0-1 (for calm mode fade)
}

/**
 * Orbital ring animation around agent avatar.
 * 
 * Creates rotating points in circular orbit with subtle glow.
 * Pauses when focus mode active or calm mode engaged.
 */
export function OrbitalRing({
  size,
  orbitRadius = size * 0.6,
  pointCount = 8,
  speed = 1,
  paused = false,
  opacity = 0.6,
}: OrbitalRingProps) {
  const points = Array.from({ length: pointCount }, (_, i) => {
    const angle = (i / pointCount) * Math.PI * 2;
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;
    return { x, y, delay: i * (1 / pointCount) };
  });

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Orbital ring path */}
      <svg
        className="absolute inset-0"
        viewBox={`${-size/2} ${-size/2} ${size} ${size}`}
        style={{ opacity: opacity * 0.3 }}
      >
        <circle
          cx="0"
          cy="0"
          r={orbitRadius}
          fill="none"
          stroke="rgba(255, 20, 147, 0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* Orbital points */}
      {points.map((point, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: '6px',
            height: '6px',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%)`,
          }}
        >
          <div
            className={paused ? '' : 'animate-orbital-spin'}
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: '50% 50%',
              animation: paused ? 'none' : `orbital-spin ${20 / speed}s linear infinite`,
              animationDelay: `${-point.delay * (20 / speed)}s`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: '6px',
                height: '6px',
                left: `calc(50% + ${point.x}px)`,
                top: `calc(50% + ${point.y}px)`,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255, 20, 147, 0.8) 0%, transparent 70%)',
                borderRadius: '50%',
                opacity,
                transition: paused ? 'none' : 'opacity 0.3s ease',
              }}
            />
          </div>
        </div>
      ))}

      {/* CSS animation keyframes */}
      <style>{`
        @keyframes orbital-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
