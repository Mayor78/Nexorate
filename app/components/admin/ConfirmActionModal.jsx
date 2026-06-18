'use client';

import { X, AlertTriangle, CheckCircle, Trash2, Zap, Eye, ShoppingBag, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function ConfirmActionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  actionType = 'danger', // 'danger', 'warning', 'success', 'info'
  itemTitle = ''
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Get action-specific styling and icons
  const getActionConfig = () => {
    switch(actionType) {
      case 'delete':
        return {
          icon: Trash2,
          iconBg: 'bg-red-500/10',
          iconColor: 'text-red-400',
          buttonBg: 'bg-red-500 hover:bg-red-600',
          buttonText: 'Delete',
          title: 'Delete Item'
        };
      case 'markSold':
        return {
          icon: ShoppingBag,
          iconBg: 'bg-emerald-500/10',
          iconColor: 'text-emerald-400',
          buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
          buttonText: 'Mark as Sold',
          title: 'Mark as Sold'
        };
      case 'markActive':
        return {
          icon: RotateCcw,
          iconBg: 'bg-amber-500/10',
          iconColor: 'text-amber-400',
          buttonBg: 'bg-amber-500 hover:bg-amber-600',
          buttonText: 'Mark as Active',
          title: 'Reactivate Listing'
        };
      case 'removeBoost':
        return {
          icon: Zap,
          iconBg: 'bg-amber-500/10',
          iconColor: 'text-amber-400',
          buttonBg: 'bg-amber-500 hover:bg-amber-600',
          buttonText: 'Remove Boost',
          title: 'Remove Boost'
        };
      default:
        return {
          icon: AlertTriangle,
          iconBg: 'bg-red-500/10',
          iconColor: 'text-red-400',
          buttonBg: 'bg-red-500 hover:bg-red-600',
          buttonText: confirmText,
          title: title || 'Confirm Action'
        };
    }
  };

  const config = getActionConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn overflow-hidden">
        {/* Decorative top bar */}
        <div className={`h-1 w-full ${config.buttonBg.replace('hover:', '')}`} />
        
        <div className="p-6">
          {/* Header with icon */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
              <IconComponent size={24} className={config.iconColor} />
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              {config.title}
            </h3>
            
            {/* Item title highlight */}
            {itemTitle && (
              <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-slate-400">Item affected:</p>
                <p className="text-white font-medium">"{itemTitle}"</p>
              </div>
            )}
            
            <p className="text-sm text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 py-2.5 border border-white/10 text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/5 hover:border-white/20 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className={`flex-1 py-2.5 ${config.buttonBg} text-white rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
            >
              {config.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}