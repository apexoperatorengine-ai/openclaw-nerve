import { useState, useCallback, useMemo } from 'react';
import { CouncilTable } from '@/components/agents/CouncilTable';
import { FocusModeToggle } from '@/components/FocusModeToggle';
import { useIdle } from '@/hooks/useIdle';
import type { AgentId, AgentState } from '@/components/agents/AgentAvatar';

interface AgentInfo {
  id: AgentId;
  name: string;
  state: AgentState;
  speaking: boolean;
  audioAmplitude: number;
}

/**
 * Council View - Agent council orchestration layer.
 * 
 * Phase 3 deliverable:
 * - 7-agent council table with audio-reactive avatars
 * - Click-to-focus interaction (council ring collapse)
 * - Focus mode toggle (Cmd+Shift+F)
 * - Calm mode (60s idle → animation slow-down)
 * - Macy operator badge with kids night indicator
 * - Orbital ring animations
 * 
 * Phase 4+ (future):
 * - Voice integration (audio streams per agent)
 * - Conversation stream rendering in focus mode
 * - Multi-agent coordination visualizations
 */
export function CouncilView() {
  const [focusModeActive, setFocusModeActive] = useState(false);
  const { isIdle: calmModeActive } = useIdle(60000); // 60s idle timeout

  // Mock agent data (Phase 4 will connect to real agent state)
  const agents = useMemo<AgentInfo[]>(() => [
    {
      id: 'apex',
      name: 'Apex',
      state: 'idle',
      speaking: false,
      audioAmplitude: 0,
    },
    {
      id: 'nami',
      name: 'NAMI',
      state: 'idle',
      speaking: false,
      audioAmplitude: 0,
    },
    {
      id: 'nova',
      name: 'Nova',
      state: 'idle',
      speaking: false,
      audioAmplitude: 0,
    },
    {
      id: 'architect',
      name: 'Architect',
      state: 'idle',
      speaking: false,
      audioAmplitude: 0,
    },
    {
      id: 'forge',
      name: 'Forge',
      state: 'idle',
      speaking: false,
      audioAmplitude: 0,
    },
    {
      id: 'sentinel',
      name: 'Sentinel',
      state: 'idle',
      speaking: false,
      audioAmplitude: 0,
    },
    {
      id: 'neuro',
      name: 'Neuro',
      state: 'idle',
      speaking: false,
      audioAmplitude: 0,
    },
  ], []);

  const handleAgentClick = useCallback((agentId: AgentId) => {
    console.log('[CouncilView] Agent clicked:', agentId);
    // Phase 4: Open conversation stream, initiate voice call, etc.
  }, []);

  const handleFocusModeToggle = useCallback((active: boolean) => {
    setFocusModeActive(active);
    console.log('[CouncilView] Focus mode:', active ? 'ON' : 'OFF');
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Header with focus mode toggle */}
      <div className="absolute top-4 right-4 z-50">
        <FocusModeToggle onToggle={handleFocusModeToggle} />
      </div>

      {/* Council table */}
      <div className="flex-1 min-h-0">
        <CouncilTable
          agents={agents}
          focusModeActive={focusModeActive}
          calmModeActive={calmModeActive}
          onAgentClick={handleAgentClick}
        />
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-4 py-2 bg-surface/60 backdrop-blur-sm border border-border/40 rounded-full">
          {/* Focus mode indicator */}
          {focusModeActive && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="uppercase tracking-wide">Focus Mode</span>
            </div>
          )}

          {/* Calm mode indicator */}
          {calmModeActive && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" />
              <span className="uppercase tracking-wide">Calm Mode</span>
            </div>
          )}

          {/* Default state */}
          {!focusModeActive && !calmModeActive && (
            <div className="text-xs text-muted-foreground/60 uppercase tracking-wide">
              Council Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
