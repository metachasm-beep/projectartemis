import { MessagingMatch } from '@/lib/messaging';

export type Role = 'man' | 'woman' | 'admin';
export type Tab = 'discovery' | 'profile' | 'messages' | 'admin';

export interface MatriarchProfile {
  user_id: string;
  full_name: string;
  role: Role;
  date_of_birth?: string;
  bio?: string;
  city?: string;
  intent?: string;
  occupation?: string;
  education?: string;
  height?: number;
  religion?: string;
  marital_status?: string;
  mother_tongue?: string;
  hobbies?: string[];
  diet?: string;
  smoking?: boolean;
  drinking?: boolean;
  photos?: string[];
  profile_strength?: number;
  onboarding_status?: 'STARTED' | 'COMPLETED';
  is_verified?: boolean;
  rank_boost_count?: number;
  last_login_at?: string;
  consecutive_days?: number;
  longest_streak?: number;
  created_at?: string;
}

export interface SanctuaryContextType {
  user: any;
  profile: MatriarchProfile | null;
  loading: boolean;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface SanctuaryMatch extends MessagingMatch {
  otherUser: any;
}
