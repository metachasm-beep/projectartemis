import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { turso } from '@/lib/turso';
import { auth as firebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { SanctuaryService } from '@/services/sanctuary';
import type { MatriarchProfile } from '@/types';
import type { Session, User } from '@supabase/supabase-js';

// 🛡️ THE NUCLEAR LOCK: Module-level global to survive any React lifecycle re-mounts.
let GLOBAL_FETCH_LOCK = 0;
const COOLDOWN_MS = 3000; // 3-second hardened cooldown

interface AuthContextType {
  session: Session | null;
  user: User | FirebaseUser | null;
  profile: MatriarchProfile | null;
  loading: boolean;
  fetchingProfile: boolean;
  isAdmin: boolean;
  authProvider: 'supabase' | 'firebase' | null;
  setProfile: (p: MatriarchProfile | null) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | FirebaseUser | null>(null);
  const [authProvider, setAuthProvider] = useState<'supabase' | 'firebase' | null>(null);
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
        
        // 📉 RESONANCE DECAY PROTOCOL
        if (diffDays >= 3) {
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
      console.warn("Streak Sync Ritual interrupted:", err);
    }
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    if (fetchInProgress.current === userId) return;
    
    const now = Date.now();
    if (now - GLOBAL_FETCH_LOCK < COOLDOWN_MS) return;
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
    const targetUserId = user?.id || (user as any)?.uid;
    if (targetUserId) {
      await fetchProfile(targetUserId);
    }
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    if (authProvider === 'supabase') {
      await supabase.auth.signOut();
    } else if (authProvider === 'firebase') {
      await firebaseAuth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setAuthProvider(null);
  }, [authProvider]);

  useEffect(() => {
    // 🛡️ Supabase Listener
    const { data: { subscription: supabaseSub } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        setAuthProvider('supabase');
        fetchProfile(currentSession.user.id);
      } else if (!firebaseAuth.currentUser) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setAuthProvider(null);
        setLoading(false);
      }
    });

    // 🔥 Firebase Listener
    const firebaseSub = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setAuthProvider('firebase');
        fetchProfile(firebaseUser.uid);
      } else if (!session?.user) {
        setUser(null);
        setProfile(null);
        setAuthProvider(null);
        setLoading(false);
      }
    });

    return () => {
      supabaseSub.unsubscribe();
      firebaseSub();
    };
  }, [fetchProfile, session]);

  const isAdmin = profile?.role === 'admin';

  const value = useMemo(() => ({
    session,
    user,
    profile,
    loading,
    fetchingProfile,
    isAdmin,
    authProvider,
    setProfile,
    refreshProfile,
    signOut
  }), [session, user, profile, loading, fetchingProfile, isAdmin, authProvider, refreshProfile, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
