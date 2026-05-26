import { useState, useEffect } from 'react';

export interface SystemUptimeData {
  uptimeSeconds: number;
  uptimeDisplay: string;
  activeAgents: number;
  totalAgents: number;
  activeSessions: number;
  healthStatus: 'healthy' | 'degraded' | 'blocked';
}

/**
 * System uptime and agent activity metrics.
 * 
 * Pulls from existing gateway data + session state.
 * Updates every 5 seconds.
 */
export function useSystemUptime(sessions: any[] = []): SystemUptimeData {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [startTime] = useState(Date.now());

  // Update uptime every second
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Format uptime as HH:MM:SS
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Count active agents (non-idle sessions)
  const activeAgentSessions = sessions.filter(s => 
    s.sessionKey?.includes('agent:') && s.busyState !== 'idle'
  );
  const activeAgents = new Set(
    activeAgentSessions.map(s => s.sessionKey?.split(':')[1])
  ).size;

  // Total agents (7 in roster, excluding Element)
  const totalAgents = 7;

  // Health status based on session states
  const blockedSessions = sessions.filter(s => s.busyState === 'blocked').length;
  const healthStatus: 'healthy' | 'degraded' | 'blocked' = 
    blockedSessions > 0 ? 'blocked' :
    activeAgents > 5 ? 'degraded' :
    'healthy';

  return {
    uptimeSeconds,
    uptimeDisplay: formatUptime(uptimeSeconds),
    activeAgents,
    totalAgents,
    activeSessions: sessions.length,
    healthStatus,
  };
}
