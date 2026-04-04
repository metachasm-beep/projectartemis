import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { turso, tursoHelpers } from '@/lib/turso';
import type { MatriarchProfile } from '@/types';
import { SanctuaryService } from '@/services/sanctuary';

export const useAuth = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const streakProcessed = useRef<string | null>(null);

  /**
   * 🛡️ Identity Synchronization: The Silent Ritual of Continuity.
   * Backgrounds streak updates to prevent blocking the sanctuary entrance.
   */
  const syncStreak = useCallback(async (p: MatriarchProfile) => {
    if (streakProcessed.current === p.user_id + p.last_login_at) return;
    streakProcessed.current = p.user_id + p.last_login_at;

    const now = new Date();
    const lastLogin = p.last_login_at ? new Date(p.last_login_at) : null;
    let newStreak = p.consecutive_days || 0;
    let rankBonus = 0;
    let bonusReason = "";

    if (!lastLogin) {
      newStreak = 1;
    } else {
      const diffMs = now.getTime() - lastLogin.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
        if (newStreak === 7) { rankBonus = 100; bonusReason = "7-Day Resonance Continuity"; }
        if (newStreak === 30) { rankBonus = 1000; bonusReason = "30-Day Sovereign Presence"; }
      } else if (diffDays > 1) {
        newStreak = 1;
      } else if (diffDays === 0) {
        return; // Already processed resonance today
      }
    }

    try {
      if (rankBonus > 0) {
        await SanctuaryService.rewardRank(p.user_id, rankBonus, bonusReason);
      }
      
      await turso.execute(
        "UPDATE profiles SET consecutive_days = ?, last_login_at = ? WHERE user_id = ?",
        [newStreak, now.toISOString(), p.user_id]
      );
      
      // Update local state silently to reflect the new streak and timestamp
      setProfile(prev => prev ? { ...prev, consecutive_days: newStreak, last_login_at: now.toISOString() } : null);
    } catch (e) {
      console.warn("Streak synchronization ritual interrupted:", e);
    }
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
       setProfile(null);
       setLoading(false);
       return;
    }
    
    setFetchingProfile(true);
    try {
      const result = await turso.execute({
        sql: "SELECT * FROM profiles WHERE user_id = ?",
        args: [userId]
      });
      const rawProfile = result.rows[0];
      
      if (rawProfile) {
        const data: MatriarchProfile = {
          ...(rawProfile as any),
          photos: tursoHelpers.deserialize(rawProfile.photos as string) || [],
          hobbies: tursoHelpers.deserialize(rawProfile.hobbies as string) || [],
          is_verified: !!rawProfile.is_verified,
          rank_boost_count: Number(rawProfile.rank_boost_count || 0),
          consecutive_days: Number(rawProfile.consecutive_days || 0)
        };

        setProfile(data);
        // 🔮 Trigger streak processing in the background
        syncStreak(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Auth Hook Exception:", err);
      // Don't clear profile on transient errors if we already have it
      if (!profile) setProfile(null);
    } finally {
      setFetchingProfile(false);
      setLoading(false);
    }
  }, [syncStreak, profile]);

  const refreshProfile = useCallback(async () => {
    const { data: { session: freshSession } } = await supabase.auth.getSession();
    const targetUserId = freshSession?.user?.id || user?.id;
    if (targetUserId) {
       await fetchProfile(targetUserId);
    }
  }, [user?.id, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    streakProcessed.current = null;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
         await fetchProfile(currentSession.user.id);
      } else {
         setLoading(false);
      }
    };
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
         await fetchProfile(currentSession.user.id);
      } else {
         setProfile(null);
         setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return { session, user, profile, loading, fetchingProfile, setProfile, refreshProfile, signOut };
};
