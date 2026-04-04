import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Users, 
  ChevronRight,
  X,
  MessageCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { turso } from '@/lib/turso';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import DecryptedText from "@/components/ui/react-bits/DecryptedText";

interface Profile {
  user_id: string;
  full_name: string;
  age: number;
  bio: string;
  avatar_url: string;
  is_verified: boolean;
  rank_boost_count: number;
  location?: string;
  interests?: string[];
  role: string;
}

export const SeekerBrowse: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  
  const loader = useRef(null);
  const LIMIT = 12;

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'man')
        .eq('is_active', true)
        .order('rank_boost_count', { ascending: false })
        .order('created_at', { ascending: true })
        .range(offset, offset + LIMIT - 1);

      if (error) throw error;

      if (data) {
        setProfiles(prev => [...prev, ...data]);
        setHasMore(data.length === LIMIT);
      }
    } catch (err) {
      console.error("Discovery error:", err);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setOffset(prev => prev + LIMIT);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-5xl mat-text-display-pro text-white leading-tight">
            <DecryptedText text="Boundless" animateOn="view" speed={100} className="inline-block" sequential /> <span className="mat-text-gradient-gold">Discovery</span>
          </h2>
          <p className="mat-text-label-pro">Gaze upon verified seekers in the Sanctuary</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="py-1.5 border-mat-gold/20 text-mat-gold/60 uppercase text-[9px] tracking-widest font-black">
            {profiles.length} Souls Found
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map((profile, idx) => (
          <motion.div
            key={profile.user_id + idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx % LIMIT) * 0.05 }}
            onClick={() => setSelectedProfile(profile)}
            className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 cursor-pointer hover:border-mat-gold/30 transition-all duration-500"
          >
            {/* Profile Image */}
            <div className="absolute inset-0">
              <img 
                src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
                alt={profile.full_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            </div>

            {/* Verification Badge */}
            {profile.is_verified && (
              <div className="absolute top-6 right-6 p-2 rounded-full bg-black/40 backdrop-blur-md border border-mat-gold/30 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-mat-gold" />
              </div>
            )}

            {/* Rank Indicator */}
            {profile.rank_boost_count > 0 && (
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-mat-gold text-black mat-text-label-pro !text-[8px] !text-black shadow-xl not-italic font-bold">
                <Zap size={10} fill="black" />
                Featured
              </div>
            )}

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 transform transition-transform group-hover:translate-y-[-8px]">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl lg:text-3xl mat-text-display-pro text-white leading-none">
                    {profile.full_name.split(' ')[0]}, {profile.age}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mat-text-label-pro opacity-60">
                  <MapPin size={10} className="text-mat-gold" />
                  {profile.location || 'Echo Sanctuary'}
                </div>
                <div className="pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="mat-text-label-pro text-mat-gold not-italic">Enter Story</span>
                  <ChevronRight size={12} className="text-mat-gold" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading State / Observer Target */}
      <div ref={loader} className="py-20 flex flex-col items-center justify-center gap-4">
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-mat-gold/40" />
            </motion.div>
            <span className="mat-text-label-pro text-mat-gold/20">Invoking more souls...</span>
          </>
        ) : !hasMore && profiles.length > 0 ? (
          <div className="p-12 rounded-[2.5rem] border border-white/5 bg-white/[0.02] text-center max-w-md mx-auto">
             <Info className="w-6 h-6 text-mat-gold/20 mx-auto mb-4" />
             <p className="mat-text-label-pro opacity-40 leading-relaxed italic">You have reached the horizon of the Sanctuary.</p>
          </div>
        ) : null}
      </div>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />
            
            <motion.div
              layoutId={`profile-${selectedProfile.user_id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full md:max-w-5xl h-full md:h-[90vh] bg-[#0F0F10] md:border border-white/10 md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)]"
            >
               <button 
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-6 right-6 lg:top-8 lg:right-8 z-[110] p-3 lg:p-4 rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  <X size={20} />
               </button>

               <div className="flex flex-col md:flex-row h-full">
                  {/* Image Side */}
                  <div className="relative w-full md:w-[45%] h-[40vh] md:h-full overflow-hidden">
                    <img 
                       src={selectedProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.user_id}`} 
                       alt={selectedProfile.full_name}
                       className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0F0F10] opacity-60" />
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-6 lg:p-16 overflow-y-auto custom-scrollbar space-y-12 lg:space-y-16 pb-safe">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Badge variant="gold" className="text-[10px] px-3 py-1 uppercase tracking-widest h-fit font-black">
                          {selectedProfile.is_verified ? "Seal of Truth" : "Aspirant"}
                        </Badge>
                        {selectedProfile.rank_boost_count > 10 && (
                          <Badge variant="violet" className="text-[10px] px-3 py-1 uppercase tracking-widest h-fit font-black">
                            High Radiance
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-4xl lg:text-7xl mat-text-display-pro text-white leading-tight break-words overflow-visible-important py-2 pr-4">
                        {selectedProfile.full_name}
                      </h2>
                      <div className="flex items-center gap-6 lg:gap-8 mat-text-label-pro text-mat-gold not-italic">
                        <span className="flex items-center gap-2 space-x-1"><Users size={14} /> <span>Age {selectedProfile.age}</span></span>
                        <span className="flex items-center gap-2 space-x-1"><MapPin size={14} /> <span>{selectedProfile.location || 'India'}</span></span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="mat-text-label-pro text-white/40">The Soul Story</h4>
                      <p className="text-lg lg:text-2xl text-white/80 leading-relaxed italic font-medium break-words">
                        {selectedProfile.bio || "This seeker has yet to weave their story into words, but their presence speaks of depth and intention."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                        <div className="p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4">
                           <h5 className="mat-text-label-pro text-mat-gold">Interests</h5>
                           <div className="flex flex-wrap gap-2 pt-2">
                              {(selectedProfile.interests || ['Truth', 'Connection', 'Purpose']).map((int, i) => (
                                <Badge key={i} variant="outline" className="bg-black/40 border-white/10 text-[8px] lg:text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                  {int}
                                </Badge>
                              ))}
                           </div>
                        </div>
                        <div className="p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4">
                           <h5 className="mat-text-label-pro text-mat-gold">Aura Strength</h5>
                           <p className="text-3xl lg:text-4xl mat-text-display-pro text-white not-italic mat-text-shimmer-subtle">
                             {(selectedProfile.rank_boost_count * 12 + 150).toLocaleString()} <span className="text-[8px] lg:text-[10px] text-white/40 uppercase tracking-[0.4em] font-black italic ml-2">Nodes</span>
                           </p>
                        </div>
                     </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                       <Button className="flex-1 h-16 rounded-2xl bg-mat-gold text-black hover:bg-mat-gold/90 font-black uppercase tracking-widest shadow-mat-gold text-[10px]">
                          <Heart className="mr-3" size={18} fill="currentColor" />
                          Express Interest
                       </Button>
                       <Button 
                          onClick={async () => {
                             // Check if woman (initiation rule)
                             const { data: { user } } = await supabase.auth.getUser();
                             if (!user) return;
                             
                             const res = await turso.execute("SELECT role, is_verified FROM profiles WHERE user_id = ?", [user.id]);
                             const me = res.rows[0];
                             
                             if (me?.role !== 'woman') {
                                alert("A seeker walks a path of patience. Connection begins only when she initiates.");
                                return;
                             }
                             if (!me?.is_verified || !selectedProfile.is_verified) {
                                alert("Both souls must be verified by the Matriarch to resonant dialogues.");
                                return;
                             }

                             // Send initial "Whisper"
                             const msgId = crypto.randomUUID();
                             await turso.execute(
                               "INSERT INTO messages (id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)",
                               [msgId, user.id, selectedProfile.user_id, "I have gazed upon your story and seek resonance."]
                             );
                             
                             window.location.reload(); // Refresh to show in Messages (Simple fix)
                          }}
                          variant="outline" 
                          className="flex-1 h-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px]"
                       >
                          <MessageCircle className="mr-3" size={18} />
                          Send a Whispers
                       </Button>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
