import React, { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from "@/lib/supabase";
import { MenDashboard } from './dashboards/MenDashboard';
import { WomenDashboard } from './dashboards/WomenDashboard';

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(profileData);

        // Fetch Status from API
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`);
        const data = await response.json();
        if (data) {
          setStatus(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleBoost = async () => {
    if (!status || status.points < 100) {
      alert("Insufficient points for a boost. Refer others to earn more.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/boost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, points_to_spend: 100 }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        const statusRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`);
        const statusData = await statusRes.json();
        setStatus(statusData);
        alert("Visibility boost active! Presence elevated.");
      } else {
        alert(data.detail || "Boost failed.");
      }
    } catch (err) {
      console.error("Boost failed", err);
      alert("System error during presence boost.");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-8 p-1 rounded-full bg-gradient-to-tr from-mat-gold to-matriarch-violet"
      >
        <div className="bg-[#0A0A0B] rounded-full p-6">
          <Crown className="w-12 h-12 text-matriarch-gold" strokeWidth={1} />
        </div>
      </motion.div>
      <span className="text-[10px] font-black tracking-[0.6em] text-matriarch-gold/40 uppercase animate-pulse">Synchronizing Sanctuary...</span>
    </div>
  );

  if (profile?.role === 'man') {
    return (
      <MenDashboard 
        profile={profile} 
        status={status} 
        handleLogout={handleLogout} 
      />
    );
  }

  if (profile?.role === 'admin') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
          <Crown style={{ color: '#D4AF37', width: '48px', height: '48px' }} />
        </motion.div>
        <p className="mt-6 text-[9px] text-[#D4AF37]/40 font-black uppercase tracking-[0.6em]">Verifying Command Authority...</p>
      </div>
    );
  }

  return (
    <WomenDashboard 
      profile={profile} 
      status={status} 
      handleLogout={handleLogout} 
      handleBoost={handleBoost} 
    />
  );
};

export default Dashboard;
