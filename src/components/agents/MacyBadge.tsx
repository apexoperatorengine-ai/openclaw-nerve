import { useMemo } from 'react';

/**
 * Macy Operator Badge - visual representation of family architecture.
 * 
 * Shows Macy as Mother/junior operator near Apex (Father/Creator/Orchestrator).
 * 
 * Calendar dot: Wed/Thu nights or alternate weekends = "kids night"
 * Logic: Wed=3, Thu=4, OR (Sat=6 or Sun=0) AND week number is odd
 */
export function MacyBadge() {
  const isKidsNight = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    
    // Wed or Thu nights
    if (dayOfWeek === 3 || dayOfWeek === 4) {
      return true;
    }
    
    // Alternate weekends (odd week numbers)
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      // Calculate week number (simple: days since epoch / 7)
      const weekNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24 * 7));
      return weekNumber % 2 === 1;
    }
    
    return false;
  }, []);

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/60 border border-primary/30"
      title={`Macy — junior operator and coordination partner${isKidsNight ? ' • Kids night' : ''}`}
    >
      {/* Heart icon */}
      <span className="text-sm" style={{ color: '#FF1493' }}>❤️</span>
      
      {/* MOM label */}
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        MOM
      </span>
      
      {/* Calendar dot indicator */}
      {isKidsNight && (
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: '#FF1493' }}
          aria-label="Kids night"
        />
      )}
    </div>
  );
}
