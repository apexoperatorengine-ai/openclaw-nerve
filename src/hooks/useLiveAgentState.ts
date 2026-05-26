import { useState, useEffect } from 'react';

export type AgentId = 'apex' | 'nami' | 'nova' | 'architect' | 'forge' | 'sentinel' | 'neuro';
export type AgentWorkState = 'idle' | 'thinking' | 'tool_use' | 'speaking' | 'blocked';

export interface AgentWork {
  agentId: AgentId;
  name: string;
  state: AgentWorkState;
  currentTask: string | null;
  taskStartTime: number | null;
  lastActionTimestamp: number;
  isActive: boolean;
}

const AGENT_NAMES: Record<AgentId, string> = {
  apex: 'APEX',
  nami: 'NAMI',
  nova: 'NOVA',
  architect: 'ARCHITECT',
  forge: 'FORGE',
  sentinel: 'SENTINEL',
  neuro: 'NEURO',
};

/**
 * Live agent work state tracker.
 * 
 * Subscribes to SSE /api/events stream and tracks:
 * - Current task per agent
 * - Task duration
 * - Last action timestamp
 * - Active/idle state
 * 
 * Element Dental excluded per parked observer rule.
 */
export function useLiveAgentState(eventEntries: any[] = []): AgentWork[] {
  const [agentStates, setAgentStates] = useState<Map<AgentId, AgentWork>>(
    new Map(
      (Object.keys(AGENT_NAMES) as AgentId[]).map(id => [
        id,
        {
          agentId: id,
          name: AGENT_NAMES[id],
          state: 'idle',
          currentTask: null,
          taskStartTime: null,
          lastActionTimestamp: Date.now(),
          isActive: false,
        },
      ])
    )
  );

  useEffect(() => {
    if (eventEntries.length === 0) return;

    const latestEvents = eventEntries.slice(0, 50); // Last 50 events
    const now = Date.now();

    setAgentStates(prev => {
      const updated = new Map(prev);

      // Parse events for agent activity
      latestEvents.forEach(event => {
        const sessionKey = event.sessionKey || '';
        const match = sessionKey.match(/^agent:([a-z]+):/);
        if (!match) return;

        const agentId = match[1] as AgentId;
        if (!AGENT_NAMES[agentId]) return; // Skip unknown/Element

        const currentState = updated.get(agentId);
        if (!currentState) return;

        // Determine state from event type
        const eventType = event.type || '';
        let newState: AgentWorkState = 'idle';
        let task: string | null = null;

        if (eventType.includes('tool_call') || eventType.includes('tool_use')) {
          newState = 'tool_use';
          task = event.data?.toolName || 'Tool execution';
        } else if (eventType.includes('thinking') || eventType.includes('stream')) {
          newState = 'thinking';
          task = 'Processing';
        } else if (eventType.includes('speaking') || eventType.includes('tts')) {
          newState = 'speaking';
          task = 'Speaking';
        } else if (eventType.includes('blocked') || eventType.includes('error')) {
          newState = 'blocked';
          task = 'Blocked';
        }

        const isNewTask = task !== currentState.currentTask;
        const taskStartTime = isNewTask ? now : currentState.taskStartTime;
        const isActive = newState !== 'idle';

        updated.set(agentId, {
          ...currentState,
          state: newState,
          currentTask: task,
          taskStartTime,
          lastActionTimestamp: now,
          isActive,
        });
      });

      // Mark agents as idle if no recent activity (>60s)
      updated.forEach((agent, id) => {
        if (now - agent.lastActionTimestamp > 60000 && agent.state !== 'idle') {
          updated.set(id, {
            ...agent,
            state: 'idle',
            currentTask: null,
            taskStartTime: null,
            isActive: false,
          });
        }
      });

      return updated;
    });
  }, [eventEntries]);

  // Return as sorted array: active first, then idle
  return Array.from(agentStates.values()).sort((a, b) => {
    if (a.isActive === b.isActive) {
      return a.name.localeCompare(b.name);
    }
    return a.isActive ? -1 : 1;
  });
}
