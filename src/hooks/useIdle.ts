import { useEffect, useState, useCallback, useRef } from 'react';

export interface IdleState {
  isIdle: boolean;
  lastActivityTime: number;
  resetIdle: () => void;
}

/**
 * Detect user inactivity for calm mode transitions.
 * 
 * Tracks mouse/keyboard/touch activity and triggers idle state
 * after specified timeout (default 60s).
 * 
 * Activity events:
 * - mousemove, mousedown
 * - keydown
 * - touchstart
 * - scroll
 * 
 * @param timeoutMs - Idle timeout in milliseconds (default 60000)
 * @returns IdleState with isIdle flag, lastActivityTime, resetIdle function
 */
export function useIdle(timeoutMs: number = 60000): IdleState {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdle = useCallback(() => {
    setIsIdle(false);
    setLastActivityTime(Date.now());

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    // Activity event handlers
    const handleActivity = () => {
      resetIdle();
    };

    // Register activity listeners
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize idle timer
    resetIdle();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetIdle]);

  return { isIdle, lastActivityTime, resetIdle };
}
