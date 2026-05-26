import { useEffect, useState, useRef } from 'react';

export type AgentId = 'apex' | 'nami' | 'nova' | 'architect' | 'forge' | 'sentinel' | 'neuro';

interface AudioAmplitudeState {
  amplitude: number; // 0-1 normalized RMS amplitude
  speaking: boolean;
  speakingAgent: AgentId | null;
}

/**
 * Web Audio API analyser hook for audio-reactive agent visualizations.
 * 
 * Connects to active TTS playback audio stream, calculates RMS amplitude,
 * and updates amplitude value 0-1 for visual feedback.
 * 
 * Usage:
 * ```tsx
 * const { amplitude, speaking, speakingAgent } = useAudioAmplitude(audioElement);
 * ```
 * 
 * @param audioElement - HTMLAudioElement playing TTS speech
 * @param agentId - Which agent is speaking (for per-agent isolation)
 * @returns amplitude 0-1, speaking boolean, speakingAgent ID
 */
export function useAudioAmplitude(
  audioElement: HTMLAudioElement | null,
  agentId: AgentId | null
): AudioAmplitudeState {
  const [amplitude, setAmplitude] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [speakingAgent, setSpeakingAgent] = useState<AgentId | null>(null);
  
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!audioElement || !agentId) {
      // No audio or agent - reset state
      setAmplitude(0);
      setSpeaking(false);
      setSpeakingAgent(null);
      return;
    }

    // Create AudioContext and AnalyserNode
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    
    // Connect audio element to analyser
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Configure analyser
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    // Animation loop to calculate amplitude
    const updateAmplitude = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      // Get time-domain data
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current as Uint8Array<ArrayBuffer>);

      // Calculate RMS (root mean square) amplitude
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const normalized = (dataArrayRef.current[i] - 128) / 128; // -1 to 1
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / dataArrayRef.current.length);

      // Normalize to 0-1 range with some scaling for visual impact
      const normalizedAmplitude = Math.min(1, rms * 3);

      setAmplitude(normalizedAmplitude);

      rafIdRef.current = requestAnimationFrame(updateAmplitude);
    };

    // Start/stop tracking based on audio playback
    const handlePlay = () => {
      setSpeaking(true);
      setSpeakingAgent(agentId);
      updateAmplitude();
    };

    const handlePause = () => {
      setSpeaking(false);
      setAmplitude(0);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };

    const handleEnded = () => {
      setSpeaking(false);
      setSpeakingAgent(null);
      setAmplitude(0);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioElement, agentId]);

  return { amplitude, speaking, speakingAgent };
}
