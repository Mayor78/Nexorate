'use client';

import { X, Mail, Calendar, Shield, CheckCircle, Ban, MapPin, Phone, Briefcase, Clock } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

export default function UserDetailModal({ isOpen, onClose, user }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    try {
      const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-sky-400" />
            <h3 className="font-bold text-white">User Details</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName} width={64} height={64} className="rounded-xl object-cover" />
              ) : (
                (user.displayName || user.email || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">{user.displayName || 'No name set'}</h2>
              <p className="text-xs text-slate-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {user.isVerified && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-1">
                    <CheckCircle size={8} /> Verified
                  </span>
                )}
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  user.status === 'suspended' 
                    ? 'bg-red-500/10 text-red-400' 
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {user.status === 'suspended' ? 'Suspended' : 'Active'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
              <Mail size={14} className="text-slate-500" />
              <div className="flex-1">
                <p className="text-[10px] text-slate-500">Email</p>
                <p className="text-xs text-white">{user.email}</p>
              </div>
            </div>
            
            {user.phone && (
              <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
                <Phone size={14} className="text-slate-500" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500">Phone</p>
                  <p className="text-xs text-white">{user.phone}</p>
                </div>
              </div>
            )}
            
            {user.location && (
              <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
                <MapPin size={14} className="text-slate-500" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500">Location</p>
                  <p className="text-xs text-white">{user.location}</p>
                </div>
              </div>
            )}
            
            {user.bio && (
              <div className="flex items-start gap-3 p-2.5 bg-white/5 rounded-lg">
                <Briefcase size={14} className="text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500">Bio</p>
                  <p className="text-xs text-white leading-relaxed">{user.bio}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
              <Calendar size={14} className="text-slate-500" />
              <div className="flex-1">
                <p className="text-[10px] text-slate-500">Joined</p>
                <p className="text-xs text-white">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            
            {user.lastLogin && (
              <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
                <Clock size={14} className="text-slate-500" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500">Last Login</p>
                  <p className="text-xs text-white">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-[10px] text-slate-500">Listings</p>
              <p className="text-lg font-bold text-white">{user.listingCount || 0}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-[10px] text-slate-500">Reviews</p>
              <p className="text-lg font-bold text-white">{user.reviewCount || 0}</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="w-full py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}