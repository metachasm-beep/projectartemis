import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { turso } from '@/lib/turso';
import type { MatriarchProfile } from '@/types';
import type { Session, User } from '@supabase/supabase-js';

// 🛡️ THE NUCLEAR LOCK: Module-level global to survive any React lifecycle re-mounts.
// Effectively terminates the 30-60 RPS re-mounting storm by enforcing a physical time barrier.
let GLOBAL_FETCH_LOCK = 0;
const COOLDOWN_MS = 3000; // 3-second hardened cooldown

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: MatriarchProfile | null;
  loading: boolean;
  fetchingProfile: boolean;
  isAdmin: boolean;
  setProfile: (p: MatriarchProfile | null) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MatriarchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  
  const fetchInProgress = useRef<string | null>(null);
  const streakProcessed = useRef<string | null>(null);

  const syncStreak = useCallback(async (p: MatriarchProfile) => {
    if (streakProcessed.current === p.user_id) return;
    streakProcessed.current = p.user_id;

    try {
      const now = new Date();
      const lastLogin = p.last_login_at ? new Date(p.last_login_at) : null;
      let newStreak = (p as any).consecutive_days || 0;

      if (!lastLogin) {
        newStreak = 1;
      } else {
        const diffDays = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));
        
        // 📉 RESONANCE DECAY PROTOCOL: Triggered if silence > 3 days
        if (diffDays >= 3) {
           console.log(`RESONANCE_DECAY: Identity ${p.user_id} was silent for ${diffDays} days. Applying penalty.`);
           await SanctuaryService.applyRankDecay(p.user_id, diffDays);
        }

        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      }

      await turso.execute({
        sql: "UPDATE profiles SET consecutive_days = ?, last_login_at = ?, updated_at = ? WHERE user_id = ?",
        args: [newStreak, now.toISOString(), now.toISOString(), p.user_id]
      });

      setProfile(prev => prev ? { ...prev, consecutive_days: newStreak, last_login_at: now.toISOString() } : null);
    } catch (err: any) {
      if (err?.message?.includes('no such column: consecutive_days') || err?.message?.includes('no such column: last_login_at')) {
        console.warn("STREAK_SYNC: Database schema mismatch (retention columns missing). Skipping ritual.");
      } else {
        console.warn("Streak Sync Ritual interrupted:", err);
      }
    }
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    if (fetchInProgress.current === userId) return;
    
    // 🛡️ GLOBAL COOLDOWN LOCK: Persistent across re-mounts.
    const now = Date.now();
    if (now - GLOBAL_FETCH_LOCK < COOLDOWN_MS) {
      return;
    }
    GLOBAL_FETCH_LOCK = now;

    fetchInProgress.current = userId;
    setFetchingProfile(true);

    try {
      const result = await turso.execute({
        sql: "SELECT * FROM profiles WHERE user_id = ?",
        args: [userId]
      });

      const raw = result.rows[0];
      if (raw) {
        // 🛠️ ROBUST NORMALIZATION: Bridge the gap between stringified Turso JSON and UI arrays.
        let photos: string[] = [];
        try {
          if (raw.photos) {
            photos = typeof raw.photos === 'string' ? JSON.parse(raw.photos) : raw.photos;
          } else if (raw.image_url) {
            photos = [raw.image_url as string];
          }
        } catch (e) {
          photos = [raw.photos as string].filter(Boolean);
        }

        const data: MatriarchProfile = {
          ...(raw as any),
          photos: Array.isArray(photos) ? photos : [photos].filter(Boolean),
          hobbies: typeof raw.hobbies === 'string' ? (JSON.parse(raw.hobbies) || []) : (raw.hobbies || []),
          is_verified: !!raw.is_verified,
        };
        setProfile(data);
        syncStreak(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Auth Globalization Error (Turso):", err);
    } finally {
      fetchInProgress.current = null;
      setFetchingProfile(false);
      setLoading(false);
    }
  }, [syncStreak]);

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
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // 🏎️ PERFORMANCE: Release loader immediately after session resolves.
      // Profile hydration happens in the background to avoid blocking initial paint.
      setLoading(false);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Non-blocking profile update
        fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });


    return () => subscription.unsubscribe();
    // 🛡️ SECURITY: fetchProfile is stable due to syncStreak identity stability.
  }, [fetchProfile]);

  const adminOverride = typeof window !== 'undefined' ? sessionStorage.getItem('adminViewRole') : null;
  const effectiveProfile = useMemo(() => {
    const isAdmin = profile?.role === 'admin';
    return isAdmin && adminOverride
      ? { ...profile, role: adminOverride as any }
      : profile;
  }, [profile, adminOverride]);

  const isAdmin = profile?.role === 'admin';

  const value = useMemo(() => ({
    session,
    user,
    profile: effectiveProfile,
    loading,
    fetchingProfile,
    isAdmin,
    setProfile,
    refreshProfile,
    signOut
  }), [session, user, effectiveProfile, loading, fetchingProfile, isAdmin, refreshProfile, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
