import { useState } from 'react';

export type AgentId = 'apex' | 'nami' | 'nova' | 'architect' | 'forge' | 'sentinel' | 'neuro';

export type AgentState = 'idle' | 'thinking' | 'speaking' | 'tool_use' | 'blocked' | 'verifying';

interface AgentAvatarProps {
  agentId: AgentId;
  size?: number; // px, default 200
  speaking?: boolean; // triggers pink eye glow
  audioAmplitude?: number; // 0-1, modulates glow intensity
  state?: AgentState;
  focusModeActive?: boolean; // kills all animation
  onClick?: () => void;
}

/**
 * Agent avatar with audio-reactive eye glow overlay.
 * 
 * Renders avatar image from /avatars/{agentId}.jpg with:
 * - Pink (#FF1493) eye glow overlay (opacity bound to audioAmplitude)
 * - Calm-mode breath animation when idle
 * - Hover lift effect
 * - Click target ripple
 */
export function AgentAvatar({
  agentId,
  size = 200,
  speaking = false,
  audioAmplitude = 0,
  state = 'idle',
  focusModeActive = false,
  onClick,
}: AgentAvatarProps) {
  const [ripple, setRipple] = useState(false);

  const handleClick = () => {
    if (onClick) {
      setRipple(true);
      setTimeout(() => setRipple(false), 600);
      onClick();
    }
  };

  // Calculate glow opacity: speaking triggers glow, amplitude modulates intensity
  const glowOpacity = speaking ? Math.max(0.3, audioAmplitude) : 0;

  // Calm-mode breath animation (disabled in focus mode or when speaking)
  const shouldBreathe = !focusModeActive && !speaking && state === 'idle';

  return (
    <button
      onClick={handleClick}
      disabled={!onClick}
      className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full"
      style={{ width: size, height: size }}
      aria-label={`${agentId} avatar`}
    >
      {/* Avatar image */}
      <img
        src={`/avatars/${agentId}.jpg`}
        alt={agentId}
        className={`
          w-full h-full rounded-full object-cover
          transition-transform duration-200
          ${onClick ? 'group-hover:scale-105 cursor-pointer' : ''}
          ${state !== 'idle' && state !== 'speaking' ? 'opacity-60' : 'opacity-100'}
        `}
        style={{
          filter: state === 'blocked' ? 'grayscale(0.5)' : undefined,
        }}
      />

      {/* Pink eye glow overlay (audio-reactive) */}
      {speaking && glowOpacity > 0 && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen backdrop-blur-sm"
          style={{
            background: `radial-gradient(circle at center, #FF1493 0%, transparent 70%)`,
            opacity: glowOpacity,
            transition: focusModeActive ? 'none' : 'opacity 0.1s ease-out',
          }}
        />
      )}

      {/* Calm-mode breath animation */}
      {shouldBreathe && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
          style={{
            background: `radial-gradient(circle at center, rgba(255, 20, 147, 0.1) 0%, transparent 60%)`,
            animationDuration: '3s',
          }}
        />
      )}

      {/* Click ripple effect */}
      {ripple && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 20, 147, 0.4) 0%, transparent 70%)',
            animation: 'ripple-fade 0.6s ease-out',
          }}
        />
      )}
    </button>
  );
}

// Ripple animation keyframes (add to global CSS if not present)
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-fade {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#agent-avatar-styles')) {
  style.id = 'agent-avatar-styles';
  document.head.appendChild(style);
}
