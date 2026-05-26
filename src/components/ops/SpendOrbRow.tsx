import { SpendOrb } from './SpendOrb';
import type { ServiceSpend } from '@/hooks/useSpendData';

interface SpendOrbRowProps {
  services: ServiceSpend[];
}

/**
 * Spend Orb Row - Row 2
 * 
 * Horizontal row of API spend orbital widgets.
 * One orb per service (Anthropic, OpenAI, ElevenLabs, Twilio).
 */
export function SpendOrbRow({ services }: SpendOrbRowProps) {
  return (
    <div className="shell-panel rounded-2xl px-6 py-5">
      <div className="mb-4 text-[0.6rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
        API Spend Monitoring
      </div>

      <div className="flex justify-around items-center gap-6">
        {services.map(service => (
          <SpendOrb
            key={service.service}
            service={service.service}
            label={service.label}
            brandColor={service.brandColor}
            todaySpend={service.todaySpend}
            dailyBudget={service.dailyBudget}
            percentUsed={service.percentUsed}
            requestCount={service.requestCount}
            lastCallTimestamp={service.lastCallTimestamp}
            isActive={service.isActive}
            isMockData={service.isMockData}
          />
        ))}
      </div>
    </div>
  );
}
