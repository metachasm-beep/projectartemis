import React, { useEffect, useState } from 'react';
import { DiscoveryCard } from '../components/DiscoveryCard';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, Crown, Shield } from 'lucide-react';

const DEMO_WOMAN_ID = 'woman_demo_888';

export const Discovery: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await api.getDiscoveryProfiles(DEMO_WOMAN_ID);
      if (data && data.length > 0) {
        setProfiles(data);
      } else {
        setProfiles([
          { 
            user_id: '1', 
            full_name: 'Aravind Sharma', 
            age: 28, 
            bio: 'Sovereign Tech Lead in Bengaluru.', 
            image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000',
            rank_score: 94
          }
        ]);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAction = async (action: 'match' | 'skip' | 'save') => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile) {
      await api.selectAction(DEMO_WOMAN_ID, currentProfile.user_id, action);
    }
    setCurrentIndex((prev: number) => (prev + 1) % (profiles.length || 1));
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <div className="mb-6 rounded-2xl bg-[#6E3FF3]/10 p-4 border border-[#6E3FF3]/20 shadow-glow animate-pulse">
        <Crown className="w-10 h-10 text-[#6E3FF3]" strokeWidth={1.5} />
      </div>
      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] animate-pulse">Scanning Sovereigns...</div>
    </div>
  );

  if (!profiles.length) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <div className="mb-6 rounded-2xl bg-[#6E3FF3]/10 p-4 border border-[#6E3FF3]/20">
        <X className="w-10 h-10 text-[#6E3FF3]" strokeWidth={1.5} />
      </div>
      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em]">No Sovereigns Found</div>
    </div>
  );

  const profile = profiles[currentIndex];

  return (
    <div className="h-screen flex flex-col pt-24 pb-48 overflow-hidden px-8 bg-[#0A0A0B]">
      <header className="px-8 mb-16 text-center flex flex-col items-center">
        <div className="mb-6 rounded-xl bg-[#6E3FF3]/10 p-3 border border-[#6E3FF3]/20 shadow-glow">
          <Crown className="w-6 h-6 text-[#6E3FF3]" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-black text-[#F6F3EE] italic tracking-tighter uppercase mb-2 font-sora">MATRIARCH</h1>
        <div className="text-[10px] tracking-[0.6em] font-black text-[#6E3FF3] uppercase">Selective Discovery</div>
      </header>

      <main className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={profile.user_id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md px-4"
          >
            <div className="surface-premium rounded-xl overflow-hidden shadow-premium border-none p-2 relative group">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <DiscoveryCard 
                imageSrc={profile.image_url}
                altText={profile.full_name}
                captionText={profile.full_name}
                overlayContent={
                  <div className="text-white p-8 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent">
                    <div className="flex justify-between items-end mb-6">
                       <div>
                          <h2 className="text-5xl font-black text-[#F6F3EE] mb-2 tracking-tighter">{profile.full_name}, {profile.age}</h2>
                          <div className="flex items-center gap-3">
                             <Shield className="w-3.5 h-3.5 text-[#6E3FF3]" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6E3FF3]">Sovereign Verified</span>
                          </div>
                       </div>
                       <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-2 rounded-xl text-[10px] font-black text-[#D4AF37] tracking-[0.3em] uppercase shadow-glow">RANK {Math.round(profile.rank_score)}</div>
                    </div>
                    <p className="text-sm font-medium bg-white/5 p-6 rounded-xl backdrop-blur-3xl border border-white/5 leading-relaxed text-[#A6A0B3] italic">
                      "{profile.bio}"
                    </p>
                  </div>
                }
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="absolute bottom-16 left-0 right-0 flex justify-center gap-10 px-8 z-20">
        <motion.button 
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAction('skip')}
          className="w-20 h-20 rounded-xl flex items-center justify-center surface-raised border border-red-500/10 text-red-400/40 hover:text-red-500 hover:bg-red-500/5 transition-all shadow-premium"
        >
          <X size={32} strokeWidth={1.5} />
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAction('save')}
          className="w-20 h-20 rounded-xl flex items-center justify-center surface-raised border border-white/5 text-white/10 hover:text-[#6E3FF3] hover:border-[#6E3FF3]/20 transition-all shadow-premium"
        >
          <Star size={32} strokeWidth={1.5} />
        </motion.button>
 
        <motion.button 
          whileHover={{ scale: 1.15, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction('match')}
          className="w-24 h-24 rounded-xl flex items-center justify-center bg-[#6E3FF3] text-white shadow-glow hover:shadow-[0_0_50px_rgba(110,63,243,0.5)] transition-all"
        >
          <Heart size={40} fill="currentColor" />
        </motion.button>
      </nav>
    </div>
  );
};

export default Discovery;
