'use client';

import { useState, useEffect } from 'react';
import { Zap, X, Loader2, CheckCircle, TrendingUp, Timer } from 'lucide-react';
import { boostListing, BOOST_PLANS, formatBoostPrice } from '../../lib/boost';
import { useToast } from '../../context/ToastContext';

const planIcons = { basic: TrendingUp, standard: TrendingUp, premium: Timer, ultimate: Zap };

export default function BoostModal({ isOpen, onClose, listing, user, onBoostSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBoost = async () => {
    setLoading(true);
    try {
      const result = await boostListing(listing.id, selectedPlan, user?.uid);
      if (result.success) {
        setSuccess(true);
        showSuccess(`Listing boosted with ${result.plan.name}!`);
        onBoostSuccess?.();
        setTimeout(() => { setSuccess(false); onClose(); }, 2000);
      } else {
        showError(result.error || 'Failed to boost listing');
      }
    } catch (error) {
      console.error('Error boosting listing:', error);
      showError('Failed to boost listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed mb-18 inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      {/* Dimmed Background Overlay */}
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      {/* Main Modal Window Panel (Fitted for strict mobile height limits) */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[75vh] flex flex-col overflow-hidden animate-slideUp">
        
        {/* Header Section */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Promote Product</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-none">
          {success ? (
            <div className="text-center py-8 space-y-3 animate-fadeIn">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Promotion Active!</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 max-w-xs mx-auto">
                  Your product has been boosted successfully. It will now rank higher in customer searches.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Context Summary Box */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 bg-sky-500 text-slate-950 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Zap size={18} className="fill-slate-950/10" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Get More Sales</h3>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">Choose a promo tier below to display this ad to more buyers.</p>
                </div>
              </div>

              {/* Minimal Clean Plan Selector Loop */}
              <div className="space-y-2">
                {Object.entries(BOOST_PLANS).map(([key, plan]) => {
                  const Icon = planIcons[key];
                  const isSelected = selectedPlan === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50/50 shadow-sm' 
                          : 'border-slate-200/70 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                          isSelected 
                            ? 'bg-sky-500 border-sky-600 text-slate-950' 
                            : 'bg-slate-50 border-slate-200/60 text-slate-400'
                        }`}>
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{plan.name}</p>
                          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{plan.days} Days Exposure Track</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <p className="font-black text-xs sm:text-sm text-slate-900 tracking-tight">{formatBoostPrice(plan.price)}</p>
                        {isSelected && (
                          <span className="text-[9px] font-black tracking-widest text-sky-700 bg-sky-100 border border-sky-200/50 px-1.5 py-0.5 rounded-md uppercase">Selected</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Simplified Layman Explainer List */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-2.5">Promotion Perks:</h4>
                <ul className="space-y-2">
                  {[
                    'Places your item at the top of search result lists',
                    'Displays your product badge prominently on our home page',
                    'Sends out automated platform alerts directly to active shoppers'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600 leading-normal">
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0 mt-1.5" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Action Button Footer */}
        {!success && (
          <div className="shrink-0 px-5 py-4 border-t border-slate-100 bg-white">
            <button
              onClick={handleBoost}
              disabled={loading}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 active:scale-[0.995]"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing Promotion...</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="fill-slate-950/10" />
                  <span>Activate Promotion — {formatBoostPrice(BOOST_PLANS[selectedPlan].price)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}