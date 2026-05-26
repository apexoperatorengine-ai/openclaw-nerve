import { AgentAvatar, type AgentId, type AgentState } from './AgentAvatar';

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
  onAgentClick?: (agentId: AgentId) => void;
}

/**
 * Council Table view - 7-agent semicircle layout.
 * 
 * Layout:
 * - Apex centered top (250px, orchestrator visual weight)
 * - 6 surrounding agents in semicircle (180px each):
 *   NAMI (left), Nova (upper-left), Architect (upper-right), 
 *   Forge (right), Sentinel (lower-right), Neuro (lower-left)
 * - Macy operator badge near Apex
 * - Status indicators below each avatar
 */
export function CouncilTable({
  agents,
  focusModeActive = false,
  onAgentClick,
}: CouncilTableProps) {
  // Helper to find agent info by ID
  const getAgent = (id: AgentId): AgentInfo | undefined => 
    agents.find(a => a.id === id);

  // Layout positions (percentage-based for responsive scaling)
  const layout = {
    apex: { top: '10%', left: '50%', translate: '-50% 0', size: 250 },
    nami: { top: '25%', left: '15%', translate: '0 0', size: 180 },
    nova: { top: '20%', left: '25%', translate: '0 0', size: 180 },
    architect: { top: '20%', left: '75%', translate: '-100% 0', size: 180 },
    forge: { top: '25%', left: '85%', translate: '-100% 0', size: 180 },
    sentinel: { top: '55%', left: '80%', translate: '-100% 0', size: 180 },
    neuro: { top: '55%', left: '20%', translate: '0 0', size: 180 },
  };

  return (
    <div className="relative w-full h-full min-h-[700px] overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center 30%, rgba(17, 17, 28, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)',
        }}
      />

      {/* Agent positions */}
      <div className="relative w-full h-full">
        {(Object.keys(layout) as AgentId[]).map(agentId => {
          const agent = getAgent(agentId);
          if (!agent) return null;

          const pos = layout[agentId];
          const isApex = agentId === 'apex';

          return (
            <div
              key={agentId}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                transform: `translate(${pos.translate})`,
              }}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <AgentAvatar
                  agentId={agentId}
                  size={pos.size}
                  speaking={agent.speaking}
                  audioAmplitude={agent.audioAmplitude}
                  state={agent.state}
                  focusModeActive={focusModeActive}
                  onClick={() => onAgentClick?.(agentId)}
                />

                {/* Agent name */}
                <div className="text-center">
                  <div className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    {agent.name}
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <div
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${agent.state !== 'idle' ? 'animate-pulse' : ''}
                      `}
                      style={{
                        backgroundColor: 
                          agent.state === 'idle' ? '#6B6680' :
                          agent.state === 'speaking' ? '#FF1493' :
                          agent.state === 'thinking' ? '#AF64C8' :
                          agent.state === 'tool_use' ? '#3D5BFF' :
                          agent.state === 'blocked' ? '#D17282' :
                          agent.state === 'verifying' ? '#5FB89A' :
                          '#6B6680',
                      }}
                    />
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {agent.state.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Macy operator badge (only for Apex) */}
                {isApex && (
                  <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/60 border border-primary/30">
                    <span className="text-xs text-primary">❤️</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      MOM
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
