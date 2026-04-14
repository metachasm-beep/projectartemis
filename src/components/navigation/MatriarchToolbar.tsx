import React from 'react';
import { Home, User, MessageCircle, LogOut, Wallet, Shield, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { turso } from '@/lib/turso';

interface MatriarchToolbarProps {
  activeTab: 'discovery' | 'profile' | 'messages' | 'sovereign_browse' | 'store' | 'admin_panel';
  setActiveTab: (tab: 'discovery' | 'profile' | 'messages' | 'sovereign_browse' | 'store' | 'admin_panel') => void;
  onLogout: () => void;
}

export const MatriarchToolbar: React.FC<MatriarchToolbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout 
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
      ? [{ id: 'discovery' as const, label: 'Browse', icon: User }] 
      : [{ id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy }]
    ),
    ...(profile?.role !== 'admin' 
      ? [{ id: 'profile' as const, label: profile?.role === 'woman' ? 'My Home' : 'My Profile', icon: profile?.role === 'woman' ? Home : User }] 
      : []
    ),
    { id: 'messages' as const, label: 'Messages', icon: MessageCircle },
    { id: 'store' as const, label: 'Buy Aura', icon: Wallet },
  ];

  const handleAdminToggle = (role: 'man' | 'woman' | 'admin') => {
    sessionStorage.setItem('adminViewRole', role);
    window.location.reload();
  };

  // 🍷 Don't show toolbar in Sovereign Browse mode to maximize visual essence
  if (activeTab === 'sovereign_browse') return null;

  return (
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl px-4 md:px-6 py-3 md:py-4 rounded-[2.5rem] bg-mat-wine/95 backdrop-blur-xl shadow-mat-premium border border-mat-rose/20 flex items-center justify-between transition-all duration-500">
        {/* 🏛️ Identity & Navigation Group */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* 💎 Sovereign Avatar / Logo (Left-Aligned Symmetry) */}
          <div className="relative group/avatar cursor-pointer" onClick={() => setActiveTab('profile')}>
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-mat-rose/20 group-hover/avatar:border-mat-rose transition-colors duration-500">
                <img 
                  src={profile?.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.user_id}`} 
                  alt="Identity" 
                  className="w-full h-full object-cover grayscale brightness-110 group-hover/avatar:grayscale-0 group-hover/avatar:scale-110 transition-all duration-700" 
                />
             </div>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Extract<typeof activeTab, string>)}
                className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-[1.5rem] transition-all duration-300 group ${
                  activeTab === item.id 
                  ? 'bg-mat-cream text-mat-wine shadow-mat-rose' 
                  : 'text-mat-cream/40 hover:text-mat-cream hover:bg-white/5'
                }`}
              >
                <item.icon size={16} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                {item.id === 'messages' && pendingCount > 0 && (
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-mat-gold text-mat-wine text-[8px] font-black rounded-full flex items-center justify-center shadow-mat-gold-glow animate-bounce">
                      {pendingCount}
                   </span>
                )}
                <span className={`text-[9px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] hidden md:block ${activeTab === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 🍷 Action Ritual (Right-Aligned Symmetry) */}
        <div className="flex items-center gap-2 md:gap-4">
          {isAdmin && (
             <div className="hidden lg:flex bg-black/30 p-1 rounded-full items-center border border-white/10">
               <button 
                 onClick={() => handleAdminToggle('man')}
                 className={`px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all ${profile?.role === 'man' ? 'bg-mat-gold text-mat-wine shadow-mat-gold' : 'text-mat-cream/80 hover:text-mat-cream'}`}
               >
                 Man
               </button>
               <button 
                 onClick={() => handleAdminToggle('woman')}
                 className={`px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all ${profile?.role === 'woman' ? 'bg-mat-gold text-mat-wine shadow-mat-gold' : 'text-mat-cream/80 hover:text-mat-cream'}`}
               >
                 Woman
               </button>
               <button 
                 onClick={() => handleAdminToggle('admin')}
                 className={`px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all ${profile?.role === 'admin' ? 'bg-mat-cream text-mat-wine shadow-mat-rose' : 'text-mat-cream/80 hover:text-mat-cream'}`}
               >
                 Admin
               </button>
             </div>
          )}

          <button
            onClick={onLogout}
            className="p-3 md:p-4 rounded-full bg-mat-rose text-mat-cream transition-all hover:bg-mat-rose-deep shadow-mat-rose hover:scale-105 active:scale-90 group"
          >
            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
  );
};
