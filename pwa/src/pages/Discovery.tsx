import React, { useEffect, useState } from 'react';
import { DiscoveryCard } from '../components/DiscoveryCard';
import { MatriarchText } from '../components/MatriarchText';
import GlassSurface from '../components/GlassSurface';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star } from 'lucide-react';

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
        // Fallback demo data
        setProfiles([
          { 
            user_id: '1', 
            full_name: 'Aravind Sharma', 
            age: 28, 
            bio: 'Sovereign Tech Lead in Bengaluru.', 
            image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000' 
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
    setCurrentIndex(prev => (prev + 1) % (profiles.length || 1));
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <MatriarchText text="SCANNING SOVEREIGNS..." variant="h3" gold />
    </div>
  );

  if (!profiles.length) return (
    <div className="h-screen flex items-center justify-center">
      <MatriarchText text="NO SOVEREIGNS FOUND" variant="h3" gold />
    </div>
  );

  const profile = profiles[currentIndex];

  return (
    <div className="h-screen flex flex-col pt-20 pb-40 overflow-hidden px-4">
      <div className="px-6 mb-8 text-center">
        <MatriarchText text="MATRIARCH" variant="h1" gold />
        <MatriarchText text="Sovereign Selection" variant="caption" className="opacity-60" />
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={profile.user_id}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1, x: -20 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="w-full max-w-sm"
          >
            <GlassSurface 
              borderRadius={40} 
              brightness={15} 
              opacity={0.3} 
              blur={15}
              className="p-1 border border-gold/30 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            >
              <DiscoveryCard 
                imageSrc={profile.image_url}
                altText={profile.full_name}
                captionText={profile.full_name}
                overlayContent={
                  <div className="text-white p-4">
                    <div className="flex justify-between items-end mb-2">
                       <h2 className="text-4xl font-black text-gold">{profile.full_name}, {profile.age}</h2>
                       <div className="bg-gold/20 border border-gold/40 px-2 py-0.5 rounded-full text-[10px] font-black text-gold tracking-widest">RANK {Math.round(profile.rank_score)}</div>
                    </div>
                    <p className="text-xs border-l-4 border-gold pl-3 mt-3 font-medium bg-plum/40 p-4 rounded-xl backdrop-blur-xl border border-white/5 leading-relaxed text-white/90">
                      {profile.bio}
                    </p>
                  </div>
                }
              />
            </GlassSurface>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-6 px-6">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAction('skip')}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-graphite/40 backdrop-blur-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <X size={28} />
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAction('save')}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-graphite/40 backdrop-blur-lg border border-gold/20 text-gold/40 hover:text-gold transition-colors"
        >
          <Star size={28} />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAction('match')}
          className="w-20 h-20 rounded-full flex items-center justify-center bg-plum/60 backdrop-blur-2xl border-2 border-gold text-gold shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-shadow"
        >
          <Heart size={36} fill="currentColor" />
        </motion.button>
      </div>
    </div>
  );
};

export default Discovery;
