import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  role: 'man' | 'woman' | null;
  auraTokens: number;
  hasUsedFreeMatch: boolean;
  unlockedMatchIds: string[];
  setRole: (role: 'man' | 'woman') => void;
  addTokens: (amount: number) => void;
  useTokens: (amount: number) => void;
  useFreeMatch: () => void;
  unlockMatch: (matchId: string) => void;
  reset: () => void;
}

/**
 * userStore: Central state for Matriarch user data.
 * Manages Aura tokens, role selection, and match unlock history.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      role: null,
      auraTokens: 0,
      hasUsedFreeMatch: false,
      unlockedMatchIds: [],

      setRole: (role) => set({ role }),
      
      addTokens: (amount) => set((state) => ({ 
        auraTokens: state.auraTokens + amount 
      })),
      
      useTokens: (amount) => set((state) => ({ 
        auraTokens: Math.max(0, state.auraTokens - amount) 
      })),
      
      useFreeMatch: () => set({ hasUsedFreeMatch: true }),
      
      unlockMatch: (matchId) => set((state) => ({
        unlockedMatchIds: [...state.unlockedMatchIds, matchId]
      })),

      reset: () => set({
        role: null,
        auraTokens: 0,
        hasUsedFreeMatch: false,
        unlockedMatchIds: []
      }),
    }),
    {
      name: 'matriarch-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
