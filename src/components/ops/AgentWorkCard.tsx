import { useMemo } from 'react';
import type { AgentId, AgentWorkState } from '@/hooks/useLiveAgentState';

interface AgentWorkCardProps {
  agentId: AgentId;
  name: string;
  state: AgentWorkState;
  currentTask: string | null;
  taskStartTime: number | null;
  lastActionTimestamp: number;
  isActive: boolean;
}

/**
 * Agent Work Card - Individual agent activity display
 * 
 * Shows:
 * - Avatar thumbnail (60px)
 * - Agent name
 * - Current task
 * - Task duration timer (count-up)
 * - Pink eye glow when active
 * - Last action timestamp
 */
export function AgentWorkCard({
  agentId,
  name,
  state,
  currentTask,
  taskStartTime,
  lastActionTimestamp,
  isActive,
}: AgentWorkCardProps) {
  // Task duration (count-up timer)
  const taskDuration = useMemo(() => {
    if (!taskStartTime) return '00:00:00';
    
    const elapsedSeconds = Math.floor((Date.now() - taskStartTime) / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [taskStartTime]);

  // Last action display
  const lastActionDisplay = useMemo(() => {
    const secondsAgo = Math.floor((Date.now() - lastActionTimestamp) / 1000);
    if (secondsAgo < 10) return 'just now';
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo}h ago`;
  }, [lastActionTimestamp]);

  // Status color
  const statusColor =
    state === 'idle' ? '#6B6680' :
    state === 'thinking' ? '#AF64C8' :
    state === 'tool_use' ? '#3D5BFF' :
    state === 'speaking' ? '#FF1493' :
    '#D17282'; // blocked

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
        isActive
          ? 'bg-surface/60 border-primary/30'
          : 'bg-surface/30 border-border/40 opacity-50'
      }`}
    >
      {/* Avatar thumbnail */}
      <div className="relative shrink-0">
        <img
          src={`/avatars/${agentId}.jpg`}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />

        {/* Pink eye glow when active */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
            style={{
              background: `radial-gradient(circle at center, #FF1493 0%, transparent 70%)`,
              opacity: 0.7,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}

        {/* Status dot */}
        <div
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      {/* Agent info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-foreground">
            {name}
          </span>
          {isActive && taskStartTime && (
            <span className="text-[0.65rem] font-mono text-muted-foreground tabular-nums">
              {taskDuration}
            </span>
          )}
        </div>

        <div className="text-[0.7rem] text-muted-foreground truncate">
          {currentTask || 'Idle'}
        </div>

        <div className="text-[0.6rem] text-muted-foreground/60">
          Last action: {lastActionDisplay}
        </div>
      </div>
    </div>
  );
}
