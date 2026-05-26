import { StatusBar } from '@/components/ops/StatusBar';
import { SpendOrbRow } from '@/components/ops/SpendOrbRow';
import { AgentWorkFeed } from '@/components/ops/AgentWorkFeed';
import { useSystemUptime } from '@/hooks/useSystemUptime';
import { useSpendData } from '@/hooks/useSpendData';
import { useLiveAgentState } from '@/hooks/useLiveAgentState';

interface OpsViewProps {
  sessions?: any[];
  eventEntries?: any[];
}

/**
 * OPS Tab - Operations Nerve Center
 * 
 * Phase 4 deliverable: Real-time operations dashboard
 * 
 * Layout:
 * - Row 1: Status Bar (clock, uptime, daily cost)
 * - Row 2: API Spend Orbs (4 services with orbital fill gauges)
 * - Row 3: Agent Work Feed (live activity feed)
 * 
 * Data sources:
 * - System uptime: calculated from session start
 * - API spend: MOCK DATA for Phase 4 (real data in Phase 5)
 * - Agent activity: SSE event stream
 */
export function OpsView({
  sessions = [],
  eventEntries = [],
}: OpsViewProps) {
  // Hook into system data
  const systemUptime = useSystemUptime(sessions);
  const spendData = useSpendData(true); // Mock mode for Phase 4
  const agentWork = useLiveAgentState(eventEntries);

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden">
      {/* Row 1: Status Bar (~80px) */}
      <div className="shrink-0">
        <StatusBar
          uptimeDisplay={systemUptime.uptimeDisplay}
          activeAgents={systemUptime.activeAgents}
          totalAgents={systemUptime.totalAgents}
          activeSessions={systemUptime.activeSessions}
          healthStatus={systemUptime.healthStatus}
          totalSpend={spendData.totalSpend}
          last24hSparkline={spendData.last24hSparkline}
        />
      </div>

      {/* Row 2: Spend Orbs (~280px) */}
      <div className="shrink-0">
        <SpendOrbRow services={spendData.services} />
      </div>

      {/* Row 3: Agent Work Feed (fills remaining height) */}
      <div className="flex-1 min-h-0">
        <AgentWorkFeed agents={agentWork} />
      </div>

      {/* Mock data warning (removable in Phase 5) */}
      {spendData.services.some(s => s.isMockData) && (
        <div className="shrink-0 text-center text-[0.6rem] text-muted-foreground/50 italic">
          API spend data is currently mocked (real data integration in Phase 5)
        </div>
      )}
    </div>
  );
}
