'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function SavedListingsTab({ savedListings, formatPrice }) {
  return (
    <div>
      <h2 className="font-semibold text-slate-800 mb-4">Saved Listings</h2>
      {savedListings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Heart size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500">No saved listings yet</p>
          <p className="text-sm text-slate-400 mt-1">Heart listings you like to save them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedListings.map((listing) => (
            <Link href={`/listings/${listing.id}`} key={listing.id}>
              <div className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                <div>
                  <h3 className="font-semibold text-slate-800">{listing.title}</h3>
                  <p className="text-sky-600 font-medium">{formatPrice(listing.price)}</p>
                  <p className="text-xs text-slate-500 mt-1">{listing.location || 'Unknown location'}</p>
                </div>
                <Heart size={20} className="fill-red-500 text-red-500 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}