import { useEffect, useRef } from 'react';
import { SanctuaryService } from '@/services/sanctuary';

/**
 * 💓 Session Pulse: Quantifying resonance through presence.
 * Increments the user's total session time in the sanctuary.
 */
export const useSessionPulse = (userId: string | undefined) => {
  const lastPulse = useRef<number>(Date.now());

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = Math.floor((now - lastPulse.current) / 1000);
      
      // Update the archive if at least 30 seconds have passed
      if (deltaSeconds >= 30) {
        SanctuaryService.trackSessionTime(userId, deltaSeconds)
          .catch(e => console.warn("Pulse Ritual interrupted:", e));
        lastPulse.current = now;
      }
    }, 60000); // Check every minute

    // Final pulse on unmount to capture the remaining time
    return () => {
      clearInterval(interval);
      if (userId) {
        const now = Date.now();
        const deltaSeconds = Math.floor((now - lastPulse.current) / 1000);
        if (deltaSeconds > 5) {
          SanctuaryService.trackSessionTime(userId, deltaSeconds).catch(() => {});
        }
      }
    };
  }, [userId]);
};
