import { useState } from 'react';

/**
 * Three-tier business filter strip for thehumanai.ai ecosystem.
 * 
 * Tier 1: Active commercial businesses (multi-select, all ON default)
 * Tier 2: Observer layer (parked, visually muted)
 * Tier 3: Experimental sandbox (Apex operational testing)
 */

type BusinessId =
  | 'exwai'
  | 'adhd-ai'
  | 'wonderloop-adult'
  | 'wonderloop-kids'
  | 'vibeloop'
  | 'novagrid'
  | 'element-dental'
  | 'vanta-society';

interface Business {
  id: BusinessId;
  label: string;
  tier: 1 | 2 | 3;
  badge?: string;
  tooltip?: string;
}

const BUSINESSES: Business[] = [
  // Tier 1: Active commercial layer
  { id: 'exwai', label: 'EXWAI', tier: 1 },
  { id: 'adhd-ai', label: 'ADHD AI', tier: 1 },
  { id: 'wonderloop-adult', label: 'WonderLoop Adult', tier: 1 },
  { id: 'wonderloop-kids', label: 'WonderLoop Kids', tier: 1 },
  { id: 'vibeloop', label: 'VIBELOOP', tier: 1 },
  { id: 'novagrid', label: 'NovaGrid', tier: 1 },
  
  // Tier 2: Observer layer
  {
    id: 'element-dental',
    label: 'Element Dental',
    tier: 2,
    badge: 'PARKED',
    tooltip: 'Observer layer - separate HIPAA workstream',
  },
  
  // Tier 3: Experimental sandbox
  {
    id: 'vanta-society',
    label: 'Vanta Society',
    tier: 3,
    badge: 'SANDBOX',
    tooltip: "Apex's operational sandbox inside the Human OS ecosystem. Experimental, not commercial.",
  },
];

export function BusinessFilterStrip() {
  // All Tier 1 businesses active by default
  const [activeFilters, setActiveFilters] = useState<Set<BusinessId>>(
    new Set(BUSINESSES.filter(b => b.tier === 1).map(b => b.id))
  );

  const toggleFilter = (id: BusinessId) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const tier1 = BUSINESSES.filter(b => b.tier === 1);
  const tier2 = BUSINESSES.filter(b => b.tier === 2);
  const tier3 = BUSINESSES.filter(b => b.tier === 3);

  return (
    <div className="flex flex-wrap items-center gap-2 max-[371px]:gap-1">
      {/* Tier 1: Active Commercial Businesses */}
      <div className="flex flex-wrap items-center gap-1.5 max-[371px]:gap-1">
        {tier1.map(business => {
          const isActive = activeFilters.has(business.id);
          return (
            <button
              key={business.id}
              onClick={() => toggleFilter(business.id)}
              className={`
                shell-chip min-h-9 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.08em]
                transition-all duration-150
                max-[371px]:min-h-[34px] max-[371px]:px-2 max-[371px]:text-[0.65rem]
                ${isActive 
                  ? 'bg-primary text-foreground border-primary shadow-[0_0_12px_rgba(255,20,147,0.3)]' 
                  : 'bg-surface text-muted-foreground border-border/50'
                }
              `}
              title={business.label}
            >
              {business.label}
            </button>
          );
        })}
      </div>

      {/* Visual separator */}
      <div className="h-6 w-px bg-border/40" />

      {/* Tier 2: Observer Layer */}
      <div className="flex items-center gap-1.5">
        {tier2.map(business => {
          const isActive = activeFilters.has(business.id);
          return (
            <button
              key={business.id}
              onClick={() => toggleFilter(business.id)}
              className={`
                shell-chip min-h-9 px-3 text-[0.7rem] font-medium uppercase tracking-[0.08em]
                opacity-50 transition-all duration-150
                max-[371px]:min-h-[34px] max-[371px]:px-2 max-[371px]:text-[0.65rem]
                ${isActive 
                  ? 'border-muted text-foreground' 
                  : 'bg-surface text-muted-foreground border-border/40'
                }
              `}
              title={business.tooltip}
            >
              <span>{business.label}</span>
              {business.badge && (
                <span className="ml-1.5 rounded-full bg-background/60 px-1.5 py-0.5 text-[0.6rem] text-muted-foreground">
                  {business.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Visual separator */}
      <div className="h-6 w-px bg-border/40" />

      {/* Tier 3: Experimental Sandbox */}
      <div className="flex items-center gap-1.5">
        {tier3.map(business => {
          const isActive = activeFilters.has(business.id);
          return (
            <button
              key={business.id}
              onClick={() => toggleFilter(business.id)}
              className={`
                shell-chip min-h-9 px-3 text-[0.7rem] font-medium uppercase tracking-[0.08em]
                transition-all duration-150
                max-[371px]:min-h-[34px] max-[371px]:px-2 max-[371px]:text-[0.65rem]
                ${isActive 
                  ? 'bg-primary/20 text-foreground border-primary shadow-[0_0_10px_rgba(255,20,147,0.25)]' 
                  : 'bg-surface text-muted-foreground border-secondary/30'
                }
              `}
              title={business.tooltip}
            >
              <span>{business.label}</span>
              {business.badge && (
                <span className="ml-1.5 rounded-full bg-background/60 px-1.5 py-0.5 text-[0.6rem] text-muted-foreground">
                  {business.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
