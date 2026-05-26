import { useState, useEffect } from 'react';

interface StatusBarProps {
  uptimeDisplay: string;
  activeAgents: number;
  totalAgents: number;
  activeSessions: number;
  healthStatus: 'healthy' | 'degraded' | 'blocked';
  totalSpend: number;
  last24hSparkline: number[];
  dailyBudgetTotal?: number;
}

/**
 * OPS Status Bar - Row 1
 * 
 * Three glanceable cards:
 * 1. Live clock + date
 * 2. System uptime + active agents
 * 3. Daily cost summary + sparkline
 */
export function StatusBar({
  uptimeDisplay,
  activeAgents,
  totalAgents,
  activeSessions,
  healthStatus,
  totalSpend,
  last24hSparkline,
  dailyBudgetTotal = 105, // Sum of all service budgets (50+30+5+20)
}: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time (locale-aware)
  const timeDisplay = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Format date
  const dateDisplay = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Health dot color
  const healthColor =
    healthStatus === 'healthy' ? '#5FB89A' :
    healthStatus === 'degraded' ? '#D4A55E' :
    '#D17282';

  // Daily budget percentage
  const budgetPercent = (totalSpend / dailyBudgetTotal) * 100;
  const budgetColor =
    budgetPercent < 25 ? '#5FB89A' :
    budgetPercent < 75 ? '#D4A55E' :
    '#D17282';

  // Sparkline max value for scaling
  const sparklineMax = Math.max(...last24hSparkline, 1);

  return (
    <div className="flex gap-3 w-full">
      {/* CARD 1: Live Clock + Date */}
      <div className="flex-1 shell-panel rounded-2xl px-4 py-3 relative overflow-hidden">
        {/* Orbital ring background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#FF1493"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-spin"
              style={{ animationDuration: '20s' }}
            />
          </svg>
        </div>

        <div className="relative z-10 space-y-1">
          <div className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            System Time
          </div>
          <div className="text-2xl font-mono font-bold text-foreground tabular-nums">
            {timeDisplay}
          </div>
          <div className="text-[0.7rem] text-muted-foreground">
            {dateDisplay}
          </div>
        </div>
      </div>

      {/* CARD 2: System Uptime + Active Agents */}
      <div className="flex-1 shell-panel rounded-2xl px-4 py-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: healthColor }}
            />
            <div className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              System Status
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[0.65rem] text-muted-foreground">Uptime:</span>
              <span className="text-sm font-mono font-semibold text-foreground tabular-nums">
                {uptimeDisplay}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[0.65rem] text-muted-foreground">Active Agents:</span>
              <span className="text-sm font-semibold text-foreground">
                {activeAgents} of {totalAgents}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[0.65rem] text-muted-foreground">Sessions:</span>
              <span className="text-sm font-semibold text-foreground">
                {activeSessions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Daily Cost Summary */}
      <div className="flex-1 shell-panel rounded-2xl px-4 py-3">
        <div className="space-y-2">
          <div className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Today's Spend
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-foreground tabular-nums">
              ${totalSpend.toFixed(2)}
            </span>
            <span className="text-[0.7rem] text-muted-foreground">
              / ${dailyBudgetTotal.toFixed(0)}
            </span>
          </div>

          {/* Sparkline (last 24h) */}
          <div className="flex items-end gap-px h-8">
            {last24hSparkline.map((value, i) => {
              const heightPercent = (value / sparklineMax) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-200"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: budgetColor,
                    opacity: 0.6 + (i / last24hSparkline.length) * 0.4, // Fade in from left
                  }}
                  title={`$${value.toFixed(2)}`}
                />
              );
            })}
          </div>

          <div className="text-[0.65rem]" style={{ color: budgetColor }}>
            {budgetPercent.toFixed(1)}% of daily budget
          </div>
        </div>
      </div>
    </div>
  );
}
