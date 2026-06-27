'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import ListingItem from './ListingItem';

export default function MyListingsTab({ listings, formatPrice, formatDate, onDeleteListing, onRefresh }) {
  const activeListings = listings.filter(l => l.status !== 'sold');
  const soldListings = listings.filter(l => l.status === 'sold');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">My Listings</h2>
        <Link href="/post" className="text-sky-600 text-sm hover:underline">
          + Post New
        </Link>
      </div>
      
      {listings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Package size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500">No listings yet</p>
          <Link href="/post" className="text-sky-600 text-sm mt-2 inline-block">
            Create your first listing →
          </Link>
        </div>
      ) : (
        <>
          {/* Active Listings */}
          {activeListings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Active Listings ({activeListings.length})</h3>
              <div className="space-y-3">
                {activeListings.map((listing) => (
                  <ListingItem 
                    key={listing.id} 
                    listing={listing} 
                    formatPrice={formatPrice} 
                    formatDate={formatDate}
                    onDelete={onDeleteListing}
                    onRefresh={onRefresh}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Sold Listings */}
          {soldListings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Sold Listings ({soldListings.length})</h3>
              <div className="space-y-3">
                {soldListings.map((listing) => (
                  <ListingItem 
                    key={listing.id} 
                    listing={listing} 
                    formatPrice={formatPrice} 
                    formatDate={formatDate}
                    onDelete={onDeleteListing}
                    onRefresh={onRefresh}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}