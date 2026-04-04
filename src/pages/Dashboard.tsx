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
    // Global Watchdog: Force end loading if it takes too long
    const watchdog = setTimeout(() => {
      if (loading) {
        console.warn("MATRIARCH_DASHBOARD: Synchronization timeout. Forcing UI entry.");
        setLoading(false);
      }
    }, 10000);

    const fetchData = async () => {
      console.log("MATRIARCH_API: Connecting to sanctuary at", import.meta.env.VITE_API_URL || 'RELATIVE_PATH');
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.warn("MATRIARCH_DASHBOARD: No user found. Redirecting to landing.");
          setLoading(false);
          return;
        }

        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        let finalProfile = profileData;
        
        // Admin Force Logic (Matching App.tsx)
        const ADMIN_EMAILS = ['metachasm@gmail.com', 'testeradmin@gmail.com'];
        if (user.email && ADMIN_EMAILS.includes(user.email)) {
          finalProfile = {
            ...profileData,
            role: 'admin',
            onboarding_status: 'COMPLETED'
          };
        }

        setProfile(finalProfile);

        // Fetch Status from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/rank/${user.id}/status`, {
            signal: controller.signal
          });
          const data = await response.json();
          if (data) {
            setStatus(data);
          }
        } catch (fetchErr) {
          console.warn("MATRIARCH_API: Failed to fetch rank status (possibly offline or timeout). Continuing with profile data only.", fetchErr);
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error("MATRIARCH_DASHBOARD: Critical fetch failure", err);
      } finally {
        setLoading(false);
        clearTimeout(watchdog);
      }
    };
    fetchData();
    
    return () => clearTimeout(watchdog);
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
