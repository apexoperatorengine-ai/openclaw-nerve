import { useMemo } from 'react';

interface SpendOrbProps {
  service: string;
  label: string;
  brandColor: string;
  todaySpend: number;
  dailyBudget: number;
  percentUsed: number;
  requestCount: number;
  lastCallTimestamp: number | null;
  isActive: boolean;
  isMockData?: boolean;
}

/**
 * API Spend Orbital Widget
 * 
 * Matches council avatar visual language:
 * - Circular orb with service icon
 * - Orbital ring that fills clockwise as spend accumulates
 * - Pink eye glow when service actively called
 * - Ring color shifts: brand → amber (75%) → red (90%+)
 */
export function SpendOrb({
  service,
  label,
  brandColor,
  todaySpend,
  dailyBudget,
  percentUsed,
  requestCount,
  lastCallTimestamp,
  isActive,
  isMockData = false,
}: SpendOrbProps) {
  // Ring color based on spend percentage
  const ringColor = useMemo(() => {
    if (percentUsed >= 90) return '#D17282'; // Red
    if (percentUsed >= 75) return '#D4A55E'; // Amber
    return brandColor; // Brand color
  }, [percentUsed, brandColor]);

  // Ring fill percentage (0-100)
  const fillPercent = Math.min(100, percentUsed);

  // Eye glow when active
  const eyeGlowOpacity = isActive ? 0.8 : 0;

  // Last call time display
  const lastCallDisplay = useMemo(() => {
    if (!lastCallTimestamp) return 'Never';
    const secondsAgo = Math.floor((Date.now() - lastCallTimestamp) / 1000);
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo}h ago`;
  }, [lastCallTimestamp]);

  // Cost per request
  const costPerRequest = requestCount > 0 ? todaySpend / requestCount : 0;

  return (
    <div
      className="flex flex-col items-center gap-3"
      title={`${label}\nCost per request: $${costPerRequest.toFixed(4)}\nRequests: ${requestCount}\nLast call: ${lastCallDisplay}${isMockData ? '\n(Mock data)' : ''}`}
    >
      {/* Orbital ring + center icon */}
      <div className="relative" style={{ width: 120, height: 120 }}>
        {/* Orbital ring background */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 120 120"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
          />
          {/* Filled ring (clockwise progress) */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={ringColor}
            strokeWidth="4"
            strokeDasharray={`${(fillPercent / 100) * (2 * Math.PI * 54)} ${2 * Math.PI * 54}`}
            strokeLinecap="round"
            className={percentUsed >= 90 ? 'animate-pulse' : ''}
          />
        </svg>

        {/* Center circle (service icon container) */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full bg-surface/80 border-2"
          style={{
            borderColor: ringColor,
            margin: 16,
          }}
        >
          {/* Service icon (text for Phase 4, replace with logos in Phase 5) */}
          <div
            className="text-2xl font-bold uppercase tracking-wider"
            style={{ color: brandColor }}
          >
            {service[0]}
          </div>
        </div>

        {/* Pink eye glow overlay (when active) */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
            style={{
              background: `radial-gradient(circle at center, #FF1493 0%, transparent 70%)`,
              opacity: eyeGlowOpacity,
              transition: 'opacity 0.2s ease-out',
              margin: 16,
            }}
          />
        )}
      </div>

      {/* Status text */}
      <div className="text-center space-y-1">
        <div className="text-[0.7rem] font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
          {label}
        </div>
        <div className="text-[0.65rem] text-muted-foreground font-mono">
          ${todaySpend.toFixed(2)} / ${dailyBudget.toFixed(2)}
        </div>
        <div className="text-[0.6rem] text-muted-foreground">
          {percentUsed.toFixed(1)}% used
        </div>
        {isMockData && (
          <div className="text-[0.55rem] text-muted-foreground/50 italic">
            (mock)
          </div>
        )}
      </div>
    </div>
  );
}
