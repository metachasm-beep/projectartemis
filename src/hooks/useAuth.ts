import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { turso, tursoHelpers } from '@/lib/turso';
import { MatriarchProfile } from '@/types';
import { SanctuaryService } from '@/services/sanctuary';

export const useAuth = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) return;
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

        const now = new Date();
        const lastLogin = data.last_login_at ? new Date(data.last_login_at) : null;
        let newStreak = data.consecutive_days || 0;
        let rankBonus = 0;
        let bonusReason = "";

        if (!lastLogin) {
          newStreak = 1;
        } else {
          const diffMs = now.getTime() - lastLogin.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1;
            if (newStreak === 7) { rankBonus = 10; bonusReason = "7-Day Resonance Continuity"; }
            if (newStreak === 30) { rankBonus = 50; bonusReason = "30-Day Sovereign Presence"; }
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        }

        if (newStreak !== (data.consecutive_days || 0) || rankBonus > 0 || !lastLogin) {
          data.consecutive_days = newStreak;
          data.last_login_at = now.toISOString();
          
          if (rankBonus > 0) {
            await SanctuaryService.rewardRank(userId, rankBonus, bonusReason);
            data.rank_boost_count = (data.rank_boost_count || 0) + rankBonus;
          }
          
          await turso.execute(
            "UPDATE profiles SET consecutive_days = ?, last_login_at = ? WHERE user_id = ?",
            [newStreak, data.last_login_at, userId]
          );
        }
        setProfile(data);
      }
    } catch (err) {
      console.error("Auth Hook Exception:", err);
    } finally {
      setFetchingProfile(false);
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) await fetchProfile(currentSession.user.id);
      else setLoading(false);
    };
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (event === 'SIGNED_IN' && currentSession?.user) await fetchProfile(currentSession.user.id);
      else if (event === 'SIGNED_OUT') setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return { session, user, profile, loading, fetchingProfile, refreshProfile, signOut };
};
