'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { getBoostedListings } from '../../lib/boost';
import ListingCard from '../ui/ListingCard';

export default function BoostedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoosted = async () => {
      try {
        const boosted = await getBoostedListings();
        setListings(boosted);
      } catch (error) {
        console.error('Error fetching boosted listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoosted();
  }, []);

  if (loading || listings.length === 0) return null;

  return (
    <div className="px-4 py-6 bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-amber-50/80 border-y border-amber-100 md:px-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-slate-900">Boosted Listings</h2>
        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">PREMIUM</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
