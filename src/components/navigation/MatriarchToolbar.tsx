import React from 'react';
import { Home, User, MessageCircle, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

interface MatriarchToolbarProps {
  activeTab: 'discovery' | 'profile' | 'messages' | 'sovereign_browse';
  setActiveTab: (tab: 'discovery' | 'profile' | 'messages' | 'sovereign_browse') => void;
  onLogout: () => void;
}

export const MatriarchToolbar: React.FC<MatriarchToolbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout 
}) => {
  const { profile } = useAuth();
  
  const navItems = [
    { id: 'discovery', label: 'My Home', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ] as const;

  // 🍷 Don't show toolbar in Sovereign Browse mode to maximize visual essence
  if (activeTab === 'sovereign_browse') return null;

  return (
    <TooltipProvider>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl px-6 py-4 rounded-[2.5rem] bg-mat-wine/95 backdrop-blur-xl shadow-mat-premium border border-mat-rose/20 flex items-center justify-between">
        {/* Identity & Navigation Group */}
        <div className="flex items-center gap-4">
          {/* 💎 Sovereign Avatar */}
          <div className="relative group/avatar cursor-pointer" onClick={() => setActiveTab('profile')}>
             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-mat-rose/20 group-hover/avatar:border-mat-rose transition-colors duration-500">
                <img 
                  src={profile?.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.user_id}`} 
                  alt="Identity" 
                  className="w-full h-full object-cover grayscale brightness-110 group-hover/avatar:grayscale-0 group-hover/avatar:scale-110 transition-all duration-700" 
                />
             </div>
             {profile?.is_verified && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-mat-gold rounded-full border-2 border-mat-wine" />}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {navItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] transition-all duration-300 group ${
                      activeTab === item.id 
                      ? 'bg-mat-cream text-mat-wine shadow-mat-rose' 
                      : 'text-mat-cream/40 hover:text-mat-cream hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={18} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block ${activeTab === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                      {item.label}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[9px] font-black tracking-widest">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Action Group */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onLogout}
              className="p-4 rounded-full bg-mat-rose text-mat-cream transition-all hover:bg-mat-rose-deep shadow-mat-rose hover:scale-105 active:scale-90 group"
            >
              <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-mat-wine text-mat-cream border-none font-bold uppercase tracking-widest text-[9px] px-4 py-2">
            Dissolve Session
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
