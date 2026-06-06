'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Eye, MousePointerClick, MessageCircle, TrendingUp, Zap, Timer, BarChart3 } from 'lucide-react';
import { getBoostAnalytics } from '../../lib/analytics';
import { BOOST_PLANS } from '../../lib/boost';

export default function BoostAnalytics({ isOpen, onClose, listing, onBoost }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLoading(true);
      getBoostAnalytics(listing.id).then(data => {
        setAnalytics(data);
        setLoading(false);
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, listing.id]);

  if (!isOpen) return null;

  const metrics = [
    { label: 'Views', value: analytics?.totalViews || 0, icon: Eye, color: 'text-sky-600', bg: 'bg-slate-50' },
    { label: 'Clicks', value: analytics?.totalClicks || 0, icon: MousePointerClick, color: 'text-emerald-600', bg: 'bg-slate-50' },
    { label: 'Chats', value: analytics?.totalConversations || 0, icon: MessageCircle, color: 'text-violet-600', bg: 'bg-slate-50' },
  ];

  const boostMetrics = [
    { label: 'Promo Views', value: analytics?.viewsSinceBoost || 0, icon: Eye, color: 'text-sky-600', bg: 'bg-white/80' },
    { label: 'Promo Clicks', value: analytics?.clicksSinceBoost || 0, icon: TrendingUp, color: 'text-sky-600', bg: 'bg-white/80' },
    { label: 'Promo Chats', value: analytics?.conversationsSinceBoost || 0, icon: MessageCircle, color: 'text-sky-600', bg: 'bg-white/80' },
  ];

  const boostPlan = analytics?.boostPlan ? BOOST_PLANS[analytics.boostPlan] : null;
  const boostEnd = analytics?.boostEndsAt ? new Date(analytics.boostEndsAt) : null;
  const daysLeft = boostEnd ? Math.ceil((boostEnd - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="fixed mb-15 inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      {/* Dimmed Background Overlay */}
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      {/* Main Container Panel with strict height limits for mobile viewports */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">
        
        {/* Header Section */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BarChart3 size={15} className="text-sky-600" /> Ad Performance
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Metrics View Track */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-none">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-16 gap-2">
              <Loader2 size={32} className="animate-spin text-sky-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Loading performance data</p>
            </div>
          ) : !analytics ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-400 font-medium text-xs">No analytics parameters logged for this ad asset.</p>
            </div>
          ) : (
            <>
              {/* Overall Performance Segment */}
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-0.5">Lifetime Totals</h3>
                <div className="grid grid-cols-3 gap-2">
                  {metrics.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} className={`${m.bg} border border-slate-100 rounded-xl p-3 text-center`}>
                        <Icon size={14} className={`${m.color} mx-auto mb-1`} />
                        <p className="text-base font-black text-slate-900 tracking-tight">{m.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{m.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Promotion Status Segment */}
              {analytics.isBoosted && (
                <div className="space-y-2.5 pt-1">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-0.5">Promotion Visibility Impact</h3>
                  
                  <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4 space-y-4">
                    {/* Upper Badges Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-sky-500 text-slate-950 rounded-lg flex items-center justify-center shrink-0">
                          <Zap size={14} className="fill-slate-950/10" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{boostPlan?.name || 'Active Boost'}</p>
                          <p className="text-[10px] font-semibold text-slate-400">Priority Level {analytics.boostLevel}</p>
                        </div>
                      </div>
                      
                      {analytics.isBoostActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-md">Running</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-md">Ended</span>
                      )}
                    </div>

                    {/* Expiration Timer Banner */}
                    {analytics.isBoostActive && daysLeft > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-100/60 border border-sky-200/40 px-2.5 py-1.5 rounded-lg w-fit">
                        <Timer size={13} />
                        <span>{daysLeft} day{daysLeft !== 1 ? 's' : ''} left to promote</span>
                      </div>
                    )}

                    {/* Promotional Activity Sub-grid */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {boostMetrics.map((m) => {
                        const Icon = m.icon;
                        return (
                          <div key={m.label} className={`${m.bg} border border-sky-200/30 rounded-lg p-2.5 text-center`}>
                            <Icon size={13} className={`${m.color} mx-auto mb-1`} />
                            <p className="text-sm font-black text-slate-900 tracking-tight">{m.value}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-0.5">{m.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Expired/Non-boosted Layman Call-to-action Block */}
              {!analytics.isBoostActive && (
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-center space-y-3">
                  <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                    <Zap size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800">
                      {analytics.isBoosted ? 'Your promotion package has ended' : 'This product has no active promotion'}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 leading-normal max-w-xs mx-auto mt-0.5">
                      {analytics.isBoosted
                        ? 'Renew your ad placement to keep pushing it to the top of customer search channels.'
                        : 'Boost this ad package now to show it to more customers and close sales faster.'}
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => { onClose(); onBoost?.(); }}
                      className="w-full sm:w-auto px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 active:scale-[0.995]"
                    >
                      <Zap size={13} className="inline mr-1.5 fill-slate-950/10" />
                      {analytics.isBoosted ? 'Promote Again' : 'Boost Ad Placement'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}