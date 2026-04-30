import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Tag, CheckCircle2, XCircle, Loader2,
  TrendingUp, Users, IndianRupee, ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Influencer {
  user_id: string;
  full_name: string;
  city: string | null;
  pending_balance: number;
  coupon_code: string | null;
  discount_pct: number;
  is_active: boolean;
  coupon_created_at: string | null;
  total_referrals: number;
  total_sales: number;
  total_commission: number;
}

interface UserSearchResult {
  user_id: string;
  full_name: string;
  city: string | null;
  role: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

import { api } from '@/services/api';

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminInfluencerPanel: React.FC = () => {
  const { user } = useAuth();

  // Influencer list
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create coupon form
  const [showForm, setShowForm] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<{ success: boolean; message: string } | null>(null);

  const getToken = async () => (user as any)?.getIdToken?.() ?? '';

  const loadInfluencers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.adminListInfluencers();
      setInfluencers(data.influencers || []);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInfluencers(); }, []);

  // Auto-generate coupon name from user
  useEffect(() => {
    if (selectedUser) {
      const first = selectedUser.full_name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
      setCouponCode(`${first}50`);
    }
  }, [selectedUser]);

  const handleUserSearch = async (q: string) => {
    setUserSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const data = await api.adminSearchProfiles(q);
      setSearchResults((data || []).slice(0, 6));
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!selectedUser || !couponCode.trim()) return;
    setCreating(true);
    setCreateResult(null);
    try {
      const data = await api.adminCreateCoupon({
        influencer_user_id: selectedUser.user_id,
        code: couponCode.trim().toUpperCase(),
        discount_pct: 50,
      });
      setCreateResult({ success: true, message: `✓ Created ${data.code} for ${data.influencer_name}` });
      setShowForm(false);
      setSelectedUser(null);
      setCouponCode('');
      setUserSearch('');
      setSearchResults([]);
      loadInfluencers();
    } catch (e: any) {
      setCreateResult({ success: false, message: e.response?.data?.detail || e.message });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleCoupon = async (code: string, currentState: boolean) => {
    try {
      await api.adminToggleCoupon(code, !currentState);
      setInfluencers(prev => prev.map(inf =>
        inf.coupon_code === code ? { ...inf, is_active: !currentState } : inf
      ));
    } catch (e: any) {
      alert(`Failed to toggle coupon: ${e.response?.data?.detail || e.message}`);
    }
  };

  return (
    <div className="space-y-12">

      {/* ── Header + Create Button ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Influence Network</span>
          <h2 className="text-4xl font-black tracking-tighter italic text-slate-900">Influencer Registry</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadInfluencers}
            className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all border border-black/[0.03]"
          >
            <RefreshCw size={16} />
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowForm(v => !v); setCreateResult(null); }}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-800 transition-all shadow-lg"
          >
            <Plus size={14} />
            Create Coupon
          </motion.button>
        </div>
      </div>

      {/* ── Create Coupon Panel ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[3rem] border border-black/[0.03] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.06)] p-12 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                  <Tag size={16} className="text-white" />
                </div>
                <h3 className="text-2xl font-black italic tracking-tight text-slate-900">Create Promo Code</h3>
              </div>

              {/* Step 1: Search User */}
              <div className="space-y-3">
                <label className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400">
                  Step 1 — Find Influencer Profile
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => handleUserSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-black/[0.04] rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition-all"
                  />
                  {searching && <Loader2 size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 animate-spin" />}
                </div>

                {/* Search results */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border border-black/[0.04] rounded-2xl overflow-hidden bg-white shadow-lg"
                    >
                      {searchResults.map(u => (
                        <button
                          key={u.user_id}
                          onClick={() => {
                            setSelectedUser(u);
                            setUserSearch(u.full_name);
                            setSearchResults([]);
                          }}
                          className={`w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-50 transition-colors border-b border-black/[0.03] last:border-0 ${selectedUser?.user_id === u.user_id ? 'bg-slate-50' : ''}`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                            {u.full_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{u.full_name}</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{u.city || 'Unknown'} · {u.role}</p>
                          </div>
                          {selectedUser?.user_id === u.user_id && <CheckCircle2 size={14} className="ml-auto text-slate-900" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedUser && (
                  <div className="flex items-center gap-3 bg-slate-50 border border-black/[0.03] rounded-2xl px-5 py-3">
                    <CheckCircle2 size={14} className="text-slate-900 shrink-0" />
                    <p className="text-xs font-bold text-slate-900">{selectedUser.full_name}</p>
                    <button onClick={() => { setSelectedUser(null); setUserSearch(''); setCouponCode(''); }} className="ml-auto text-[10px] text-slate-300 hover:text-slate-600 font-bold uppercase tracking-widest">
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Coupon Code */}
              <div className="space-y-3">
                <label className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400">
                  Step 2 — Coupon Code (auto-generated, editable)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="e.g. SAKSHAM50"
                  maxLength={20}
                  className="w-full px-6 py-4 bg-slate-50 border border-black/[0.04] rounded-2xl font-mono text-xl font-black tracking-[0.3em] text-slate-900 placeholder:text-slate-200 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition-all uppercase"
                />
                <p className="text-[9px] text-slate-300 uppercase tracking-widest font-bold px-1">
                  50% discount will be applied to all users who enter this code · Influencer earns 10% commission per sale
                </p>
              </div>

              {/* Result feedback */}
              <AnimatePresence>
                {createResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl border text-sm font-bold ${
                      createResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    {createResult.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {createResult.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowForm(false); setSelectedUser(null); setCouponCode(''); setUserSearch(''); }}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all border border-black/[0.03]"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreateCoupon}
                  disabled={!selectedUser || !couponCode.trim() || creating}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-800 transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  {creating ? 'Creating...' : 'Issue Code'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ── */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4 text-rose-700 text-sm font-bold flex items-center gap-3">
          <XCircle size={14} />
          {error}
        </div>
      )}

      {/* ── Influencer Roster Table ── */}
      {loading ? (
        <div className="py-20 flex items-center justify-center gap-4 text-slate-300">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">Loading registry...</span>
        </div>
      ) : influencers.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <Users size={32} className="text-slate-200 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">No influencers yet</p>
          <p className="text-xs text-slate-300">Create a coupon above to onboard your first influencer.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-black/[0.02] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.04)]">
          {/* Summary stats */}
          <div className="grid grid-cols-3 divide-x divide-black/[0.03] border-b border-black/[0.03]">
            {[
              { label: 'Total Influencers', value: influencers.length, icon: Users },
              { label: 'Total Referrals', value: influencers.reduce((s, i) => s + (i.total_referrals || 0), 0), icon: TrendingUp },
              { label: 'Total Commissions', value: `₹${influencers.reduce((s, i) => s + (i.total_commission || 0), 0).toFixed(0)}`, icon: IndianRupee },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="px-10 py-8 space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300">
                  <Icon size={10} /> {label}
                </div>
                <p className="text-3xl font-black italic text-slate-900 tracking-tighter">{value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
              <thead className="bg-[#f8fafc]">
                <tr>
                  {['Influencer', 'Coupon Code', 'Referrals', 'Total Sales', 'Commission Owed', 'Status'].map(h => (
                    <th key={h} className="px-10 py-6 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.02]">
                {influencers.map((inf, i) => (
                  <motion.tr
                    key={inf.user_id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="group hover:bg-black/[0.008] transition-all"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                          {inf.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm italic">{inf.full_name}</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{inf.city || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      {inf.coupon_code ? (
                        <span className="font-mono text-sm font-black tracking-[0.2em] text-slate-700 bg-slate-50 border border-black/[0.04] px-4 py-2 rounded-xl">
                          {inf.coupon_code}
                        </span>
                      ) : (
                        <span className="text-slate-200 text-xs italic">–</span>
                      )}
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-2xl font-black italic text-slate-900 tabular-nums">{inf.total_referrals || 0}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-lg font-black italic text-slate-700">₹{(inf.total_sales || 0).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-0.5">
                        <span className="text-lg font-black italic text-amber-600">₹{(inf.pending_balance || 0).toFixed(2)}</span>
                        <p className="text-[8px] text-slate-300 uppercase tracking-widest font-bold">Pending</p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      {inf.coupon_code && (
                        <button
                          onClick={() => handleToggleCoupon(inf.coupon_code!, inf.is_active)}
                          className="flex items-center gap-2 transition-all"
                          title={inf.is_active ? 'Deactivate coupon' : 'Activate coupon'}
                        >
                          {inf.is_active ? (
                            <><ToggleRight size={22} className="text-slate-900" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active</span></>
                          ) : (
                            <><ToggleLeft size={22} className="text-slate-300" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Inactive</span></>
                          )}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInfluencerPanel;
