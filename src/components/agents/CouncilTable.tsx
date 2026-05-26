import { useState } from 'react';
import { AgentAvatar, type AgentId, type AgentState } from './AgentAvatar';
import { OrbitalRing } from './OrbitalRing';
import { MacyBadge } from './MacyBadge';

interface AgentInfo {
  id: AgentId;
  name: string;
  state: AgentState;
  speaking: boolean;
  audioAmplitude: number;
}

interface CouncilTableProps {
  agents: AgentInfo[];
  focusModeActive?: boolean;
  calmModeActive?: boolean;
  onAgentClick?: (agentId: AgentId) => void;
}

/**
 * Council Table view - 7-agent semicircle layout with click-to-focus.
 * 
 * Full Council Layout:
 * - Apex centered top (250px, orchestrator visual weight)
 * - 6 surrounding agents in semicircle (180px each):
 *   NAMI (left), Nova (upper-left), Architect (upper-right), 
 *   Forge (right), Sentinel (lower-right), Neuro (lower-left)
 * - Orbital animations around each avatar
 * - Macy operator badge near Apex
 * - Status indicators below each avatar
 * 
 * Click-to-Focus Mode:
 * - Clicked agent expands to conversation view
 * - Other 6 agents collapse to council ring at top (60px avatars)
 * - Click agent again or click outside → return to full council
 */
export function CouncilTable({
  agents,
  focusModeActive = false,
  calmModeActive = false,
  onAgentClick,
}: CouncilTableProps) {
  const [focusedAgent, setFocusedAgent] = useState<AgentId | null>(null);

  // Helper to find agent info by ID
  const getAgent = (id: AgentId): AgentInfo | undefined => 
    agents.find(a => a.id === id);

  // Handle agent click
  const handleAgentClick = (agentId: AgentId) => {
    if (focusedAgent === agentId) {
      // Click same agent again → return to full council
      setFocusedAgent(null);
    } else {
      // Focus new agent
      setFocusedAgent(agentId);
    }
    onAgentClick?.(agentId);
  };

  // Full council layout positions (percentage-based for responsive scaling)
  const fullLayout = {
    apex: { top: '10%', left: '50%', translate: '-50% 0', size: 250 },
    nami: { top: '25%', left: '15%', translate: '0 0', size: 180 },
    nova: { top: '20%', left: '25%', translate: '0 0', size: 180 },
    architect: { top: '20%', left: '75%', translate: '-100% 0', size: 180 },
    forge: { top: '25%', left: '85%', translate: '-100% 0', size: 180 },
    sentinel: { top: '55%', left: '80%', translate: '-100% 0', size: 180 },
    neuro: { top: '55%', left: '20%', translate: '0 0', size: 180 },
  };

  // Council ring layout (when focused) - horizontal ring at top
  const ringLayout = {
    apex: { top: '5%', left: '50%', translate: '-50% 0', size: 60 },
    nami: { top: '5%', left: '20%', translate: '-50% 0', size: 60 },
    nova: { top: '5%', left: '30%', translate: '-50% 0', size: 60 },
    architect: { top: '5%', left: '70%', translate: '-50% 0', size: 60 },
    forge: { top: '5%', left: '80%', translate: '-50% 0', size: 60 },
    sentinel: { top: '5%', left: '65%', translate: '-50% 0', size: 60 },
    neuro: { top: '5%', left: '35%', translate: '-50% 0', size: 60 },
  };

  const isFocused = focusedAgent !== null;
  const layout = isFocused ? ringLayout : fullLayout;

  // Orbital animation speed (slows in calm mode)
  const orbitalSpeed = calmModeActive ? 0.2 : 1;
  const orbitalOpacity = calmModeActive ? 0.3 : 0.6;

  return (
    <div className="relative w-full h-full min-h-[700px] overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: calmModeActive 
            ? 'radial-gradient(circle at center 30%, rgba(17, 17, 28, 0.6) 0%, rgba(0, 0, 0, 0.95) 70%)'
            : 'radial-gradient(circle at center 30%, rgba(17, 17, 28, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)',
        }}
      />

      {/* Agent positions */}
      <div className="relative w-full h-full">
        {(Object.keys(fullLayout) as AgentId[]).map(agentId => {
          const agent = getAgent(agentId);
          if (!agent) return null;

          const pos = layout[agentId];
          const isApex = agentId === 'apex';
          const isInRing = isFocused && agentId !== focusedAgent;
          const isExpanded = isFocused && agentId === focusedAgent;

          return (
            <div
              key={agentId}
              className={`absolute transition-all duration-500 ease-in-out ${
                isInRing ? 'z-50' : isExpanded ? 'z-40' : 'z-10'
              }`}
              style={{
                top: pos.top,
                left: pos.left,
                transform: `translate(${pos.translate})`,
                opacity: isInRing ? 0.8 : 1,
              }}
            >
              {/* Avatar with orbital ring */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {/* Orbital ring (hidden in focus mode or for ring avatars) */}
                  {!focusModeActive && !isInRing && (
                    <OrbitalRing
                      size={pos.size}
                      speed={orbitalSpeed}
                      paused={focusModeActive || calmModeActive}
                      opacity={orbitalOpacity}
                    />
                  )}

                  {/* Avatar */}
                  <AgentAvatar
                    agentId={agentId}
                    size={pos.size}
                    speaking={agent.speaking}
                    audioAmplitude={agent.audioAmplitude}
                    state={agent.state}
                    focusModeActive={focusModeActive}
                    onClick={() => handleAgentClick(agentId)}
                  />
                </div>

                {/* Agent name and status (hidden for ring avatars) */}
                {!isInRing && (
                  <div className="text-center">
                    <div className="text-sm font-semibold uppercase tracking-wider text-foreground">
                      {agent.name}
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <div
                        className={`
                          w-2 h-2 rounded-full transition-all duration-300
                          ${agent.state !== 'idle' && !calmModeActive ? 'animate-pulse' : ''}
                        `}
                        style={{
                          backgroundColor: 
                            agent.state === 'idle' ? (calmModeActive ? '#4A4857' : '#6B6680') :
                            agent.state === 'speaking' ? '#FF1493' :
                            agent.state === 'thinking' ? '#AF64C8' :
                            agent.state === 'tool_use' ? '#3D5BFF' :
                            agent.state === 'blocked' ? '#D17282' :
                            agent.state === 'verifying' ? '#5FB89A' :
                            '#6B6680',
                        }}
                      />
                      <span className={`
                        text-xs uppercase tracking-wide transition-colors duration-1000
                        ${calmModeActive ? 'text-muted-foreground/50' : 'text-muted-foreground'}
                      `}>
                        {agent.state.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Macy operator badge (only for Apex, hidden when in ring) */}
                {isApex && !isInRing && (
                  <div className="mt-2">
                    <MacyBadge />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Focused agent conversation view placeholder */}
      {isFocused && focusedAgent && (
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-2/3 
                     bg-surface/40 backdrop-blur-sm border border-border/40 rounded-2xl
                     flex items-center justify-center transition-all duration-500"
          onClick={() => setFocusedAgent(null)}
        >
          <div className="text-center space-y-4">
            <div className="text-2xl font-semibold text-foreground">
              {getAgent(focusedAgent)?.name}
            </div>
            <div className="text-sm text-muted-foreground">
              Conversation stream (Phase 4)
            </div>
            <div className="text-xs text-muted-foreground/60">
              Click outside or press ESC to return to council
            </div>
          </div>
        </div>
      )}

      {/* ESC key handler for focused mode */}
      {isFocused && (
        <div
          className="absolute inset-0"
          onClick={() => setFocusedAgent(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setFocusedAgent(null);
            }
          }}
          tabIndex={-1}
          role="button"
          aria-label="Return to full council view"
        />
      )}

      {/* Responsive breakpoint adjustments */}
      <style>{`
        @media (max-width: 1024px) {
          /* Tablet: condensed layout */
          .council-table-responsive {
            /* Layout adjustments handled via CSS Grid fallback if needed */
          }
        }
        @media (max-width: 640px) {
          /* Mobile: vertical scroll list */
          .council-table-responsive {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            padding: 2rem 0;
          }
        }
      `}</style>
    </div>
  );
}
