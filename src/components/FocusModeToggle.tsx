import { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FocusModeToggleProps {
  onToggle?: (active: boolean) => void;
}

/**
 * Focus Mode Toggle - ADHD-aware animation override.
 * 
 * When ON:
 * - All orbital animations freeze
 * - Eye glow becomes static dot when speaking
 * - Audio data collected but not visualized
 * - Status badges update (text only, no motion)
 * 
 * Keyboard shortcut: Cmd+Shift+F (Mac) / Ctrl+Shift+F (Windows/Linux)
 * Persists to localStorage: 'focus_mode_active'
 * Default: OFF (full animation)
 */
export function FocusModeToggle({ onToggle }: FocusModeToggleProps) {
  const [active, setActive] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_mode_active');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('focus_mode_active', String(active));
    } catch {
      // ignore storage errors
    }
    onToggle?.(active);
  }, [active, onToggle]);

  // Keyboard shortcut: Cmd+Shift+F / Ctrl+Shift+F
  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if (e.key === 'f' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setActive(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [handleKeyboard]);

  const handleClick = () => {
    setActive(prev => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative flex items-center gap-2 px-3 py-1.5 rounded-lg
        transition-all duration-200
        ${active 
          ? 'bg-primary/20 text-primary border border-primary/40' 
          : 'bg-surface/60 text-muted-foreground border border-border/40 hover:bg-surface/80'
        }
      `}
      title={`Focus Mode ${active ? 'ON' : 'OFF'} (${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+F)`}
      aria-label={`Focus mode ${active ? 'on' : 'off'}`}
      aria-pressed={active}
    >
      {active ? (
        <Eye className="w-4 h-4" />
      ) : (
        <EyeOff className="w-4 h-4 opacity-60" />
      )}
      <span className="text-xs font-medium uppercase tracking-wide">
        {active ? 'Focus' : 'Focus'}
      </span>
      
      {/* Keyboard hint tooltip */}
      <div className="
        absolute top-full right-0 mt-2 px-2 py-1 
        bg-surface border border-border rounded
        text-xs text-muted-foreground whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none
      ">
        {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+F
      </div>
    </button>
  );
}
