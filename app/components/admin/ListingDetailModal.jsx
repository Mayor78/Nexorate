'use client';

import { X, MapPin, Eye, Zap, Calendar, User as UserIcon, Package, Tag, Clock, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../../lib/formatters';

export default function ListingDetailModal({ isOpen, onClose, listing }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  const thumb = listing.images?.[0];
  const thumbUrl = typeof thumb === 'object' ? thumb?.url : thumb;
  
  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', text: 'Active' };
      case 'sold':
        return { icon: CheckCircle, color: 'text-slate-400', bg: 'bg-slate-500/10', text: 'Sold' };
      case 'pending':
        return { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', text: 'Pending' };
      default:
        return { icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-500/10', text: status || 'Unknown' };
    }
  };
  
  const statusConfig = getStatusConfig(listing.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl animate-fadeIn overflow-hidden" style={{ maxHeight: 'calc(100vh - 32px)' }}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Package size={16} className="text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Listing Details</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <div className="p-6 space-y-6">
            
            {/* Image Gallery Section */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10">
              {thumbUrl ? 
                <Image src={thumbUrl} alt={listing.title} fill className="object-cover" /> : 
                <div className="w-full h-full flex flex-col items-center justify-center text-4xl">
                  <Package size={48} className="text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">No image available</p>
                </div>
              }
              
              {/* Badges overlay */}
              <div className="absolute top-3 left-3 flex gap-2">
                {listing.isBoosted && (
                  <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                    <Zap size={10} /> BOOSTED
                  </span>
                )}
                <span className={`${statusConfig.bg} ${statusConfig.color} text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg backdrop-blur-sm`}>
                  <StatusIcon size={10} />
                  {statusConfig.text}
                </span>
              </div>
            </div>
            
            {/* Title & Price Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white leading-tight">{listing.title}</h2>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-3xl font-black text-amber-400">{formatPrice(listing.price)}</p>
                {listing.originalPrice && listing.originalPrice > listing.price && (
                  <p className="text-sm text-slate-500 line-through">{formatPrice(listing.originalPrice)}</p>
                )}
              </div>
            </div>
            
            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Seller Info */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <UserIcon size={12} className="text-amber-400" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seller</p>
                </div>
                <p className="text-sm font-medium text-white">{listing.sellerName || 'Unknown'}</p>
                {listing.sellerEmail && (
                  <p className="text-xs text-slate-500 mt-1">{listing.sellerEmail}</p>
                )}
              </div>
              
              {/* Location */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <MapPin size={12} className="text-amber-400" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</p>
                </div>
                <p className="text-sm text-white">{listing.location || 'Not specified'}</p>
              </div>
              
              {/* Category */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Tag size={12} className="text-amber-400" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</p>
                </div>
                <p className="text-sm text-white">{listing.category || 'General'}</p>
              </div>
              
              {/* Stats */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Eye size={12} className="text-amber-400" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statistics</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">{listing.views || 0} views</span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={10} />
                    <span>Posted: {listing.createdAt?.toDate?.() ? new Date(listing.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description Section */}
            {listing.description && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/5 rounded-md flex items-center justify-center">
                    <Package size={10} className="text-slate-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Description</h4>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </div>
            )}
            
            {/* Additional Images */}
            {listing.images && listing.images.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/5 rounded-md flex items-center justify-center">
                    <Image size={10} className="text-slate-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Additional Images ({listing.images.length - 1})</h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {listing.images.slice(1, 4).map((img, idx) => {
                    const imgUrl = typeof img === 'object' ? img?.url : img;
                    return imgUrl ? (
                      <div key={idx} className="relative aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10">
                        <Image src={imgUrl} alt={`${listing.title} - ${idx + 2}`} fill className="object-cover" />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Link 
                href={`/listings/${listing.id}`} 
                target="_blank" 
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-sm text-center hover:from-amber-600 hover:to-amber-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <ExternalLink size={16} />
                View Live Listing
              </Link>
              <button 
                onClick={onClose} 
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}