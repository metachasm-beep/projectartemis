import { useAuthContext } from '@/contexts/AuthContext';

/**
 * 🏛️ Matriarch Unified Authentication Proxy
 * Consumes the global AuthContext to ensure all components share a single source of truth.
 */
export const useAuth = () => {
  return useAuthContext();
};
