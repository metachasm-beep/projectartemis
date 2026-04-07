import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Medal, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SanctuaryService } from '@/services/sanctuary';
import { VerificationBadge } from '../verification/VerificationBadge';

interface LeaderboardProps {
  onClose: () => void;
  myRank?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose, myRank }) => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const data = await SanctuaryService.getLeaderboard(50);
        setLeaders(data);
      } catch (err) {
        console.error("Leaderboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="text-mat-gold" size={24} />;
    if (rank === 2) return <Medal className="text-slate-300" size={22} />;
    if (rank === 3) return <Medal className="text-amber-600" size={20} />;
    return <span className="text-white/20 font-black text-xs">#{rank}</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-mat-obsidian/95 backdrop-blur-3xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <header className="px-6 py-10 md:px-16 md:py-16 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-6">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon"
            className="rounded-full bg-white/5 border border-white/10 text-white hover:bg-mat-wine"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-mat-cream font-['Impact']">
              The Rooted <span className="text-mat-gold">Ascent</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <TrendingUp size={12} className="text-mat-gold" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Global Aspirant Rankings</span>
            </div>
          </div>
        </div>

        {myRank && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Your Standing</span>
            <span className="text-2xl font-black italic text-mat-gold">#{myRank.toLocaleString()}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 md:px-16 pb-32 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
               <Sparkles className="text-mat-gold animate-spin" size={48} />
               <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Syncing with the Oracle</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {leaders.map((aspirant, idx) => {
                const photos = JSON.parse(aspirant.photos || '[]');
                return (
                  <motion.div
                    key={aspirant.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`
                      group relative flex items-center justify-between p-4 md:p-6 rounded-[2rem] border transition-all duration-500
                      ${aspirant.absolute_rank <= 3 
                        ? 'bg-mat-gold/5 border-mat-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4 md:gap-8">
                       {/* Rank Indicator */}
                       <div className="w-12 flex justify-center items-center">
                          {getRankIcon(aspirant.absolute_rank)}
                       </div>

                       {/* Profile Info */}
                       <div className="flex items-center gap-4">
                          <div className="relative">
                             <img 
                               src={photos[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${aspirant.user_id}`} 
                               className="w-12 h-12 md:w-16 md:h-16 rounded-2xl object-cover border border-white/10 grayscale-[0.5] group-hover:grayscale-0 transition-all"
                               alt=""
                             />
                             <div className="absolute -bottom-1 -right-1 scale-75 origin-bottom-right">
                                <VerificationBadge verified={aspirant.is_verified} />
                             </div>
                          </div>
                          <div>
                             <h4 className="text-lg md:text-xl font-bold italic text-white leading-none">
                               {aspirant.full_name.split(' ')[0]}, {aspirant.age}
                             </h4>
                             <div className="flex items-center gap-2 mt-2 text-white/40">
                                <MapPin size={10} />
                                <span className="text-[10px] uppercase tracking-widest">{aspirant.city}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Score / Status */}
                    <div className="flex flex-col items-end">
                       <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                         aspirant.absolute_rank <= 3 ? 'bg-mat-gold/10 border-mat-gold/20 text-mat-gold' : 'bg-white/5 border-white/10 text-white/40'
                       }`}>
                         {aspirant.absolute_rank <= 10 ? 'Elite' : aspirant.absolute_rank <= 50 ? 'Vanguard' : 'Aspirant'}
                       </div>
                    </div>

                    {/* Decorative Hover Mask */}
                    <div className="absolute inset-0 bg-gradient-to-r from-mat-gold/0 via-mat-gold/0 to-mat-gold/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-20">
         <p className="text-[10px] font-black uppercase tracking-[1em] text-white">The Matriarch Protocol</p>
      </footer>
    </motion.div>
  );
};
