import React from 'react';
import { Home, User, MessageCircle, LogOut, Wallet, Shield, Trophy, Search, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { turso } from '@/lib/turso';

interface MatriarchToolbarProps {
  activeTab: 'discovery' | 'profile' | 'messages' | 'sovereign_browse' | 'store' | 'admin_panel';
  setActiveTab: (tab: 'discovery' | 'profile' | 'messages' | 'sovereign_browse' | 'store' | 'admin_panel') => void;
  onLogout: () => void;
  isImmersive?: boolean;
}

export const MatriarchToolbar: React.FC<MatriarchToolbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout,
  isImmersive = false
}) => {
  const { profile, isAdmin } = useAuth() as any;
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (profile?.role === 'man') {
      const fetchPending = async () => {
        const result = await turso.execute({
          sql: "SELECT COUNT(*) as count FROM matches WHERE man_user_id = ? AND status = 'PENDING_ACCEPTANCE'",
          args: [profile.user_id]
        });
        setPendingCount(result.rows[0].count as number);
      };
      fetchPending();
      const interval = setInterval(fetchPending, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [profile]);
  
  const navItems = [
    ...(profile?.role === 'admin' ? [{ id: 'admin_panel' as const, label: 'Control Panel', icon: Shield }] : []),
    ...(profile?.role === 'woman' 
      ? [{ id: 'discovery' as const, label: 'Browse', icon: Search }] 
      : [{ id: 'leaderboard' as const, label: 'Results', icon: Trophy }]
    ),
    ...(profile?.role !== 'admin' 
      ? [{ id: 'profile' as const, label: profile?.role === 'woman' ? 'Home' : 'Profile', icon: profile?.role === 'woman' ? Home : User }] 
      : []
    ),
    { id: 'messages' as const, label: 'Messages', icon: MessageCircle },
    ...(profile?.role !== 'woman' ? [
      { id: 'store' as const, label: 'Buy Aura', icon: Wallet },
      { id: 'faq' as const, label: 'Manual', icon: HelpCircle }
    ] : []),
  ];

  const handleAdminToggle = (role: 'man' | 'woman' | 'admin') => {
    sessionStorage.setItem('adminViewRole', role);
    window.location.reload();
  };

  // 🍷 Don't show toolbar in Sovereign Browse mode to maximize visual essence
  if (activeTab === 'sovereign_browse') return null;

  return (
      <div className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[1000] w-auto max-w-[95%] px-2 py-1.5 md:px-3 md:py-2 rounded-full backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/20 flex items-center gap-1 md:gap-2 transition-all duration-500 ${
      activeTab === 'faq' 
        ? 'bg-mat-obsidian/90' 
        : (profile?.role === 'woman' || (!isImmersive && profile?.role === 'man'))
          ? 'bg-mat-cream/95 border-mat-gold/40 shadow-[0_20px_40px_rgba(0,0,0,0.2)]' 
          : 'bg-white/10'
    }`}>
        <div className="flex items-center gap-0.5 md:gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Extract<typeof activeTab, string>)}
              className={`flex items-center gap-2 px-3.5 py-2.5 md:px-5 md:py-3 rounded-full transition-all duration-300 group relative ${
                activeTab === item.id 
                ? 'bg-mat-gold text-mat-obsidian shadow-xl' 
                : (profile?.role === 'woman' || (!isImmersive && profile?.role === 'man'))
                  ? 'text-mat-obsidian/40 hover:text-mat-obsidian hover:bg-black/5'
                  : 'text-mat-bone/40 hover:text-mat-bone hover:bg-white/5'
              }`}
            >
              <item.icon size={16} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              {item.id === 'messages' && pendingCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-mat-gold text-mat-wine text-[8px] font-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {pendingCount}
                 </span>
              )}
              <span className={`text-[12px] font-bold uppercase tracking-[0.2em] hidden sm:block ${activeTab === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* 🍷 Divider */}
        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          {isAdmin && (
             <div className="hidden lg:flex bg-black/20 p-1 rounded-full items-center border border-white/5">
               <button 
                 onClick={() => handleAdminToggle('man')}
                 className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${profile?.role === 'man' ? 'bg-mat-gold text-mat-wine shadow-mat-gold' : 'text-mat-bone/80 hover:text-mat-bone'}`}
               >
                 Man
               </button>
               <button 
                 onClick={() => handleAdminToggle('woman')}
                 className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${profile?.role === 'woman' ? 'bg-mat-gold text-mat-wine shadow-mat-gold' : 'text-mat-bone/80 hover:text-mat-bone'}`}
               >
                 Woman
               </button>
               <button 
                 onClick={() => handleAdminToggle('admin')}
                 className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${profile?.role === 'admin' ? 'bg-mat-bone text-mat-wine shadow-mat-rose' : 'text-mat-bone/80 hover:text-mat-bone'}`}
               >
                 Admin
               </button>
             </div>
          )}

          <button
            onClick={onLogout}
            className={`p-3 rounded-full transition-all group ${
              (profile?.role === 'woman' || (!isImmersive && profile?.role === 'man'))
                ? 'bg-black/5 text-mat-obsidian/60 hover:text-mat-obsidian hover:bg-black/10' 
                : 'bg-white/10 text-mat-bone/60 hover:text-mat-bone hover:bg-white/20'
            }`}
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
  );
};
