'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, Zap, Activity, DollarSign, Eye, ShoppingBag, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { getAdminStats } from '../../lib/admin/stats';
import StatsCards from '../../components/admin/StatsCards';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const highlights = [
    { label: 'New Users', value: stats?.newUsersToday || 0, icon: Users, trend: '+12%', color: 'from-blue-500 to-blue-600' },
    { label: 'New Listings', value: stats?.newListingsToday || 0, icon: Package, trend: '+8%', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Active Boosts', value: stats?.boostedListings || 0, icon: Zap, trend: '+23%', color: 'from-amber-500 to-amber-600' },
    { label: 'Boost Revenue', value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, trend: '+15%', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-xs text-slate-500">Real-time platform metrics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full border border-white/10">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-slate-400">Live Updates</span>
        </div>
      </div>

      {/* Key Metrics Grid - More Compact */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-20 mb-2" />
              <div className="h-7 bg-white/10 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div 
                key={h.label} 
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h.label}</span>
                  <div className={`w-7 h-7 bg-gradient-to-br ${h.color} rounded-lg flex items-center justify-center`}>
                    <Icon size={12} className="text-white" />
                  </div>
                </div>
                <p className="text-xl font-bold text-white tracking-tight mb-1">{h.value}</p>
                <div className="flex items-center gap-1">
                  <ArrowUp size={9} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">{h.trend}</span>
                  <span className="text-[10px] text-slate-500">vs last week</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Analytics</h2>
        </div>
        <StatsCards stats={stats} loading={loading} />
      </div>

      {/* Additional Metrics - Optional, can be removed if still too big */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <Eye size={12} className="text-slate-500" />
              <span className="text-[10px] text-emerald-400">+5.2k</span>
            </div>
            <p className="text-base font-bold text-white">{stats?.totalViews?.toLocaleString() || '0'}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Total Views</p>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <ShoppingBag size={12} className="text-slate-500" />
              <span className="text-[10px] text-emerald-400">+0.8%</span>
            </div>
            <p className="text-base font-bold text-white">{stats?.conversionRate || 2.4}%</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Conversion</p>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <DollarSign size={12} className="text-slate-500" />
              <span className="text-[10px] text-emerald-400">+₦1.2k</span>
            </div>
            <p className="text-base font-bold text-white">₦{stats?.avgOrderValue?.toLocaleString() || '0'}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Avg. Order</p>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <Clock size={12} className="text-slate-500" />
              <span className="text-[10px] text-emerald-400">-0.3h</span>
            </div>
            <p className="text-base font-bold text-white">{stats?.avgResponseTime || 2.5}h</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Response Time</p>
          </div>
        </div>
      )}
    </div>
  );
}