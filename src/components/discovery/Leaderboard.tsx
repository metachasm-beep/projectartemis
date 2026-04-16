import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Crown, 
  MapPin, 
  Search, 
  TrendingUp,
  Medal,
  Users
} from 'lucide-react';
import { turso } from '@/lib/turso';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  user_id: string;
  name: string;
  age: number;
  city: string;
  photos: string[];
  is_verified: boolean;
  absolute_rank: number;
  created_at: string;
  rank_score: number;
}

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      let query = `
        SELECT user_id, full_name, date_of_birth, city, photos, is_verified, absolute_rank, rank_score, created_at
        FROM profiles 
        WHERE role = 'man'
      `;
      const args: any[] = [];

      if (selectedCity) {
        query += " AND city = ?";
        args.push(selectedCity);
      }

      query += " ORDER BY absolute_rank ASC";

      const result = await turso.execute(query, args);
      
      const mapped = result.rows.map((r: any) => {
        const dob = new Date(r.date_of_birth);
        const age = isNaN(dob.getTime()) ? 25 : new Date().getFullYear() - dob.getFullYear();
        
        return {
          user_id: r.user_id,
          name: r.full_name?.split(' ')[0] || 'Aspirant',
          age,
          city: r.city || 'Skyline',
          photos: JSON.parse(r.photos || '[]'),
          is_verified: !!r.is_verified,
          absolute_rank: Number(r.absolute_rank) || 999,
          created_at: r.created_at,
          rank_score: r.rank_score || 0
        };
      });

      setUsers(mapped);

      // Extract unique cities for filtering
      if (!selectedCity) {
        const uniqueCities = Array.from(new Set(mapped.map(u => u.city))).filter(Boolean) as string[];
        setCities(uniqueCities);
      }
    } catch (err) {
      console.error("Leaderboard ritual failed:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const hallOfFame = users.slice(0, 10);
  const top100 = users.slice(10, 100);

  return (
    <div className="space-y-16 pb-32">
      {/* 🏛️ Leaderboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-mat-rose/20">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-mat-gold/20 text-mat-gold text-[9px] font-bold uppercase tracking-[0.4em] rounded-full bg-mat-gold/5">Global Stand // Rankings</Badge>
          <h1 className="text-6xl md:text-8xl mat-text-display-pro text-mat-wine italic leading-none">The <br /><span className="text-mat-rose/30">Lords.</span></h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-slate/40 w-4 h-4" />
             <Input 
               placeholder="Filter by city..." 
               value={cityFilter}
               onChange={(e) => setCityFilter(e.target.value)}
               className="pl-12 bg-mat-glass border-mat-rose/10 rounded-2xl text-[10px] uppercase font-bold tracking-widest h-14"
             />
          </div>
          <div className="flex gap-2">
             {cities.filter(c => c.toLowerCase().includes(cityFilter.toLowerCase())).slice(0, 3).map(city => (
               <Button 
                 key={city}
                 variant={selectedCity === city ? "default" : "outline"}
                 onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                 className={cn(
                   "h-14 rounded-2xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all",
                   selectedCity === city ? "bg-mat-wine text-white" : "border-mat-rose/10 text-mat-wine hover:bg-mat-rose/5"
                 )}
               >
                 {city}
               </Button>
             ))}
          </div>
        </div>
      </div>

      {/* 🏆 HALL OF FAME (TOP 10) */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
           <Trophy className="text-mat-gold w-8 h-8" />
           <h3 className="text-3xl font-bold italic text-mat-wine">Hall of Fame.</h3>
           <div className="h-px flex-1 bg-mat-gold/20" />
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-gold">Elite Ten</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           <AnimatePresence mode="popLayout">
             {hallOfFame.map((user, i) => (
               <motion.div 
                 key={user.user_id}
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="relative group aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-mat-gold/20 hover:border-mat-gold transition-all duration-700 shadow-mat-premium bg-mat-obsidian"
               >
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 z-20 w-10 h-10 bg-mat-gold rounded-2xl flex items-center justify-center border-2 border-mat-obsidian/20 shadow-2xl">
                     <span className="mat-text-impact text-mat-obsidian text-lg">#{user.absolute_rank}</span>
                  </div>

                  {/* Identity Portrait */}
                  <div className="absolute inset-0 grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110">
                     <img 
                       src={user.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_id}`} 
                       className="w-full h-full object-cover" 
                       alt={user.name}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-mat-obsidian via-mat-obsidian/20 to-transparent" />
                  </div>

                  {/* Status HUD */}
                  <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                     <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-mat-cream italic truncate">{user.name}</span>
                        {user.is_verified && <Crown size={12} className="text-mat-gold" fill="currentColor" />}
                     </div>
                     <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-white/50">
                        <span>Age {user.age}</span>
                        <div className="flex items-center gap-1">
                           <MapPin size={8} className="text-mat-gold" />
                           <span>{user.city}</span>
                        </div>
                     </div>
                  </div>

                  {/* Holographic Overlays for Top 3 */}
                  {user.absolute_rank <= 3 && <div className="absolute inset-0 mat-card-holographic pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity" />}
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </section>

      {/* 🔱 TOP 100 RANKINGS */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
           <Medal className="text-mat-wine/40 w-8 h-8" />
           <h3 className="text-3xl font-bold italic text-mat-wine">Ascending Ranks.</h3>
           <div className="h-px flex-1 bg-mat-rose/10" />
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-mat-rose/40">Top 100</span>
        </div>

        <div className="mat-glass rounded-[3.5rem] border-mat-rose/10 overflow-hidden shadow-mat-premium">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-mat-rose/10">
                       <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.5em] text-mat-wine/40">Rank</th>
                       <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.5em] text-mat-wine/40">Identity</th>
                       <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.5em] text-mat-wine/40">Age</th>
                       <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.5em] text-mat-wine/40">Sovereign Point</th>
                       <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.5em] text-mat-wine/40">Stand</th>
                    </tr>
                 </thead>
                 <tbody>
                    {top100.map((user) => (
                       <tr key={user.user_id} className="group hover:bg-mat-rose/5 transition-all duration-300">
                          <td className="px-10 py-6">
                             <span className="mat-text-impact text-3xl text-mat-rose/20 group-hover:text-mat-rose/40 transition-colors">#{user.absolute_rank}</span>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-mat-rose/20 grayscale group-hover:grayscale-0 transition-all">
                                   <img 
                                     src={user.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_id}`} 
                                     referrerPolicy="no-referrer"
                                     crossOrigin="anonymous"
                                     className="w-full h-full object-cover" 
                                     alt="Thumb" 
                                   />
                                </div>
                                <div className="flex flex-col">
                                   <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-mat-wine uppercase tracking-widest">{user.name}</span>
                                      {user.is_verified && <Badge className="bg-mat-gold/10 text-mat-gold text-[7px] border-mat-gold/20 h-4 px-1">VERIFIED</Badge>}
                                   </div>
                                   <span className="text-[10px] text-mat-slate font-medium italic">Aura Power: {user.rank_score}</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <span className="text-xs font-bold text-mat-slate/60">{user.age}</span>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-mat-gold" />
                                <span className="text-xs font-bold text-mat-wine italic">{user.city}</span>
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-3">
                                <TrendingUp size={14} className="text-mat-wine/20" />
                                <Badge variant="outline" className="border-mat-rose/20 text-mat-rose text-[9px] font-bold rounded-lg uppercase tracking-widest">Aspirant</Badge>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* 📊 Empty State Handling */}
      {users.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center p-24 mat-glass rounded-[3.5rem] border-dashed border-mat-rose/20 text-center space-y-6">
           <div className="w-20 h-20 bg-mat-rose/5 rounded-full flex items-center justify-center text-mat-rose/20">
              <Users size={40} />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-bold text-mat-wine italic">Void Resonance.</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-mat-slate/40">No aspirants found in this sector.</p>
           </div>
           <Button onClick={() => setSelectedCity(null)} className="h-12 bg-mat-wine text-white px-8 rounded-xl text-[9px] font-bold uppercase tracking-widest">Reset Sector</Button>
        </div>
      )}
    </div>
  );
};
