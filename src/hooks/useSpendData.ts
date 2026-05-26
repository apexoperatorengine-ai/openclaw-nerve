import { useState, useEffect } from 'react';

export interface ServiceSpend {
  service: 'anthropic' | 'openai' | 'elevenlabs' | 'twilio';
  label: string;
  brandColor: string;
  todaySpend: number;
  dailyBudget: number;
  percentUsed: number;
  requestCount: number;
  lastCallTimestamp: number | null;
  isActive: boolean;
  isMockData: boolean;
}

export interface SpendDataState {
  services: ServiceSpend[];
  totalSpend: number;
  last24hSparkline: number[];
}

/**
 * API spend data aggregator.
 * 
 * Pulls from:
 * - Anthropic/OpenAI: Gateway metrics (if available) or mock
 * - ElevenLabs: Mock (Phase 5 will wire real data)
 * - Twilio: Existing twilio_voice.py logs or mock
 * 
 * Updates every 10 seconds.
 * 
 * @param isMockMode - Force mock data for Phase 4 (default: true)
 */
export function useSpendData(isMockMode: boolean = true): SpendDataState {
  const [services, setServices] = useState<ServiceSpend[]>([
    {
      service: 'anthropic',
      label: 'ANTHROPIC',
      brandColor: '#D4A55E', // Anthropic orange
      todaySpend: 0,
      dailyBudget: 50,
      percentUsed: 0,
      requestCount: 0,
      lastCallTimestamp: null,
      isActive: false,
      isMockData: true,
    },
    {
      service: 'openai',
      label: 'OPENAI',
      brandColor: '#5FB89A', // OpenAI green
      todaySpend: 0,
      dailyBudget: 30,
      percentUsed: 0,
      requestCount: 0,
      lastCallTimestamp: null,
      isActive: false,
      isMockData: true,
    },
    {
      service: 'elevenlabs',
      label: 'ELEVENLABS',
      brandColor: '#AF64C8', // ElevenLabs purple
      todaySpend: 0,
      dailyBudget: 5,
      percentUsed: 0,
      requestCount: 0,
      lastCallTimestamp: null,
      isActive: false,
      isMockData: true,
    },
    {
      service: 'twilio',
      label: 'TWILIO',
      brandColor: '#D17282', // Twilio red
      todaySpend: 0,
      dailyBudget: 20,
      percentUsed: 0,
      requestCount: 0,
      lastCallTimestamp: null,
      isActive: false,
      isMockData: true,
    },
  ]);

  const [last24hSparkline] = useState<number[]>([
    0.12, 0.15, 0.22, 0.18, 0.31, 0.42, 0.38, 0.45, 0.52, 0.61,
    0.58, 0.64, 0.59, 0.55, 0.62, 0.68, 0.72, 0.69, 0.64, 0.58,
    0.51, 0.48, 0.42, 0.38,
  ]);

  useEffect(() => {
    if (!isMockMode) {
      // TODO Phase 5: Wire real API spend data
      // - Anthropic: fetch from ~/.openclaw/logs/ or gateway metrics
      // - OpenAI: fetch from ~/.openclaw/logs/ or gateway metrics
      // - ElevenLabs: fetch from ElevenLabs API
      // - Twilio: fetch from twilio_voice.py logs
      return;
    }

    // Mock data generator (realistic Phase 4 values)
    const generateMockData = () => {
      const now = Date.now();
      
      setServices(prev => prev.map(svc => {
        // Simulate spend accumulation
        const mockSpend = 
          svc.service === 'anthropic' ? 0.42 + (Math.random() * 0.1) :
          svc.service === 'openai' ? 0.28 + (Math.random() * 0.08) :
          svc.service === 'elevenlabs' ? 0.05 + (Math.random() * 0.02) :
          0.12 + (Math.random() * 0.05); // twilio

        const mockRequests =
          svc.service === 'anthropic' ? 24 :
          svc.service === 'openai' ? 18 :
          svc.service === 'elevenlabs' ? 3 :
          8; // twilio

        // Simulate active state (random)
        const isActive = Math.random() > 0.85;
        const lastCall = isActive ? now : now - Math.floor(Math.random() * 300000); // 0-5 min ago

        return {
          ...svc,
          todaySpend: mockSpend,
          percentUsed: (mockSpend / svc.dailyBudget) * 100,
          requestCount: mockRequests,
          lastCallTimestamp: lastCall,
          isActive,
        };
      }));
    };

    generateMockData();
    const interval = setInterval(generateMockData, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, [isMockMode]);

  const totalSpend = services.reduce((sum, svc) => sum + svc.todaySpend, 0);

  return {
    services,
    totalSpend,
    last24hSparkline,
  };
}
