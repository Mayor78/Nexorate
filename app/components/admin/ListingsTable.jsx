'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Eye, Zap, Loader2, Filter, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteListing, markListingSold, markListingActive, removeBoost } from '../../lib/admin/listings';
import { useToast } from '../../context/ToastContext';
import ConfirmActionModal from './ConfirmActionModal';
import { formatPrice } from '../../lib/formatters';

export default function ListingsTable({ listings, loading, onRefresh, onViewListing }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const { success: showSuccess, error: showError } = useToast();

  // Apply filters
  let filtered = listings.filter(l =>
    (l.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.sellerName || '').toLowerCase().includes(search.toLowerCase())
  );

  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(l => l.status === statusFilter);
  }

  const handleAction = async (action, listingId) => {
    try {
      let r; 
      switch (action) { 
        case 'markSold': r = await markListingSold(listingId); break; 
        case 'markActive': r = await markListingActive(listingId); break; 
        case 'delete': r = await deleteListing(listingId); break; 
        case 'removeBoost': r = await removeBoost(listingId); break; 
        default: return; 
      }
      r.success ? showSuccess(`${action} successful`) : showError(r.error || 'Failed');
      if (r.success) onRefresh();
    } catch { 
      showError('Action failed'); 
    }
    setActionModal(null);
  };

  // Stats
  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    sold: listings.filter(l => l.status === 'sold').length,
    boosted: listings.filter(l => l.isBoosted).length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
        <p className="text-sm text-slate-500">Loading listings...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search by title, category, or seller..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.04] transition-all" 
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white hover:bg-white/[0.05] transition-all"
            >
              <Filter size={16} />
              Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <ChevronDown size={14} />
            </button>
            
            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-xl shadow-lg border border-white/10 z-20 overflow-hidden">
                  {['all', 'active', 'sold'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        statusFilter === status 
                          ? 'bg-amber-500/10 text-amber-400' 
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {status === 'all' ? 'All Listings' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        {(search || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total</p>
          <p className="text-xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
          <p className="text-[10px] text-emerald-400/70 uppercase tracking-wider">Active</p>
          <p className="text-xl font-bold text-emerald-400">{stats.active}</p>
        </div>
        <div className="bg-slate-500/5 border border-slate-500/10 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sold</p>
          <p className="text-xl font-bold text-slate-400">{stats.sold}</p>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
          <p className="text-[10px] text-amber-400/70 uppercase tracking-wider">Boosted</p>
          <p className="text-xl font-bold text-amber-400">{stats.boosted}</p>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3 flex justify-between items-center">
        <p className="text-xs text-slate-500">
          Showing {filtered.length} of {listings.length} listings
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Listing</th>
              <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left hidden sm:table-cell">Price</th>
              <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left hidden md:table-cell">Status</th>
              <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left hidden lg:table-cell">Views</th>
              <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filtered.slice(0, 50).map((listing) => {
              const thumb = listing.images?.[0];
              const thumbUrl = typeof thumb === 'object' ? thumb?.url : thumb;
              return (
                <tr key={listing.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {/* Image */}
                      <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/5">
                        {thumbUrl ? 
                          <Image src={thumbUrl} alt="" width={40} height={40} className="w-full h-full object-cover" /> : 
                          <div className="w-full h-full flex items-center justify-center text-sm">📦</div>
                        }
                      </div>
                      
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-blue-500 text-sm truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">
                            {listing.title}
                          </p>
                          {listing.isBoosted && (
                            <span className="shrink-0 bg-amber-500/10 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Zap size={9} /> BOOSTED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {listing.category} • {listing.sellerName}
                        </p>
                        
                        {/* Mobile-only price & status */}
                        <div className="flex gap-2 mt-1.5 sm:hidden">
                          <span className="font-bold text-white text-xs">{formatPrice(listing.price)}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            listing.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                            listing.status === 'sold' ? 'bg-slate-500/10 text-slate-400' : 
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {listing.status || 'active'}
                          </span>
                        </div>
                      </div>
                    </div>
                   </td>
                  
                  <td className="py-3 px-4 font-bold text-white text-xs hidden sm:table-cell">
                    {formatPrice(listing.price)}
                  </td>
                  
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      listing.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                      listing.status === 'sold' ? 'bg-slate-500/10 text-slate-400' : 
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {listing.status || 'active'}
                    </span>
                  </td>
                  
                  <td className="py-3 px-4 text-xs text-slate-500 hidden lg:table-cell">
                    {listing.views || 0}
                  </td>
                  
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* View on site */}
                      <Link 
                        href={`/listings/${listing.id}`} 
                        target="_blank" 
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="View on site"
                      >
                        <Eye size={14} />
                      </Link>
                      
                      {/* View details */}
                      <button 
                        onClick={() => onViewListing?.(listing)} 
                        className="p-1.5 text-slate-500 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-all"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      
                      {/* Mark sold/active */}
                      <button 
                        onClick={() => setActionModal({ 
                          action: listing.status === 'active' ? 'markSold' : 'markActive', 
                          listing, 
                          label: `Mark "${listing.title}" as ${listing.status === 'active' ? 'sold' : 'active'}?` 
                        })} 
                        className={`p-1.5 rounded-lg transition-all ${
                          listing.status === 'active' 
                            ? 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10' 
                            : 'text-slate-500 hover:text-amber-400 hover:bg-amber-400/10'
                        }`}
                        title={listing.status === 'active' ? 'Mark as sold' : 'Mark as active'}
                      >
                        {listing.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      </button>
                      
                      {/* Remove boost */}
                      {listing.isBoosted && (
                        <button 
                          onClick={() => setActionModal({ 
                            action: 'removeBoost', 
                            listing, 
                            label: `Remove boost from "${listing.title}"?` 
                          })} 
                          className="p-1.5 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all"
                          title="Remove boost"
                        >
                          <Zap size={14} />
                        </button>
                      )}
                      
                      {/* Delete */}
                      <button 
                        onClick={() => setActionModal({ 
                          action: 'delete', 
                          listing, 
                          label: `Delete "${listing.title}"? This cannot be undone.` 
                        })} 
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Delete listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={32} className="text-slate-600" />
                    <p className="text-slate-500 text-sm">No listings found</p>
                    {(search || statusFilter !== 'all') && (
                      <button 
                        onClick={() => {
                          setSearch('');
                          setStatusFilter('all');
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 mt-2"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      <ConfirmActionModal 
        isOpen={!!actionModal} 
        onClose={() => setActionModal(null)} 
        onConfirm={() => actionModal && handleAction(actionModal.action, actionModal.listing.id)} 
        title="Confirm Action" 
        message={actionModal?.label || ''} 
        confirmText={actionModal?.action || 'Confirm'} 
      />
    </div>
  );
}