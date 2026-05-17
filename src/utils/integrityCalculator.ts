import type { MatriarchProfile } from '@/types';

/**
 * Calculates the composite integrity score (0-100%) for an Aspirant's profile.
 * Evaluates narrative completeness, portrait visibility, verification status, and occupation.
 */
export const calculateIntegrity = (profile: Partial<MatriarchProfile>): number => {
  if (!profile) return 0;
  
  let score = 0;
  if (profile.full_name) score += 10;
  if (profile.bio && profile.bio.length > 50) score += 20;
  if (profile.city) score += 10;
  if (profile.is_verified) score += 30;
  if ((profile.photos?.length || 0) > 0) score += 20;
  if (profile.occupation) score += 10;
  
  return Math.min(100, score);
};
