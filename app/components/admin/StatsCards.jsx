'use client';

import { DollarSign, Package, Users, Flag, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-xl font-bold text-white mt-1">
            {typeof value === 'number' && title.includes('Revenue') 
              ? `₦${value.toLocaleString()}` 
              : value.toLocaleString()}
          </p>
        </div>
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/5">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <span className={`text-[10px] font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-[10px] text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 animate-pulse">
            <div className="h-3 bg-white/10 rounded w-20 mb-2" />
            <div className="h-7 bg-white/10 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue || 0,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    {
      title: "Total Listings",
      value: stats?.totalListings || 0,
      change: stats?.listingsChange || 0,
      icon: Package,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: stats?.usersChange || 0,
      icon: Users,
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Active Reports",
      value: stats?.totalReports || 0,
      change: stats?.reportsChange || 0,
      icon: Flag,
      color: "bg-gradient-to-br from-red-500 to-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}