import { AgentWorkCard } from './AgentWorkCard';
import type { AgentWork } from '@/hooks/useLiveAgentState';

interface AgentWorkFeedProps {
  agents: AgentWork[];
}

/**
 * Agent Work Feed - Row 3
 * 
 * Live feed of agent activity.
 * Active agents shown first (pink glow), idle agents below (muted).
 * 
 * Element Dental excluded per parked observer rule.
 */
export function AgentWorkFeed({ agents }: AgentWorkFeedProps) {
  const activeAgents = agents.filter(a => a.isActive);
  const idleAgents = agents.filter(a => !a.isActive);

  return (
    <div className="flex-1 min-h-0 shell-panel rounded-2xl overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-border/60">
        <div className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Agent Work Feed
        </div>
        <div className="mt-1 text-[0.65rem] text-muted-foreground">
          {activeAgents.length} active • {idleAgents.length} idle
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {/* Active agents first */}
        {activeAgents.length > 0 && (
          <div className="space-y-2">
            {activeAgents.map(agent => (
              <AgentWorkCard
                key={agent.agentId}
                agentId={agent.agentId}
                name={agent.name}
                state={agent.state}
                currentTask={agent.currentTask}
                taskStartTime={agent.taskStartTime}
                lastActionTimestamp={agent.lastActionTimestamp}
                isActive={agent.isActive}
              />
            ))}
          </div>
        )}

        {/* Idle agents below */}
        {idleAgents.length > 0 && (
          <div className="space-y-2">
            {activeAgents.length > 0 && (
              <div className="h-px bg-border/40 my-4" />
            )}
            {idleAgents.map(agent => (
              <AgentWorkCard
                key={agent.agentId}
                agentId={agent.agentId}
                name={agent.name}
                state={agent.state}
                currentTask={agent.currentTask}
                taskStartTime={agent.taskStartTime}
                lastActionTimestamp={agent.lastActionTimestamp}
                isActive={agent.isActive}
              />
            ))}
          </div>
        )}

        {agents.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No agent activity data available
          </div>
        )}
      </div>
    </div>
  );
}
