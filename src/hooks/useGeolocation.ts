import { useEffect, useState, useCallback } from 'react';
import { SanctuaryService } from '../services/sanctuary';

/**
 * 🛰️ useGeolocation: Sanctuary Mapping Hook
 * Handles browser position sync and persistence once per session.
 */
export const useGeolocation = (userId?: string) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  const syncPosition = useCallback(async (latitude: number, longitude: number) => {
    if (!userId || synced) return;
    try {
      await SanctuaryService.updateLocation(userId, latitude, longitude);
      setSynced(true);
      // Mark session as synced in sessionStorage to respect the "once per session" rule
      sessionStorage.setItem(`matriarch_geo_synced_${userId}`, 'true');
    } catch (err) {
      console.error("Geographical sync failure:", err);
    }
  }, [userId, synced]);

  useEffect(() => {
    if (!userId) return;

    // Check if we already synced in this session
    const hasSyncedThisSession = sessionStorage.getItem(`matriarch_geo_synced_${userId}`) === 'true';
    if (hasSyncedThisSession) {
      setSynced(true);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        syncPosition(latitude, longitude);
      },
      (err) => {
        setError(err.message);
        console.warn("Location permission denied or unavailable:", err);
      },
      {
        enableHighAccuracy: false, // Fuzzy/Power-efficient is fine for our social mapping
        timeout: 10000,
        maximumAge: 3600000 // 1 hour cache
      }
    );
  }, [userId, syncPosition]);

  return { location, error, synced };
};
