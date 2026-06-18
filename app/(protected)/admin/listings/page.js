'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { getAllListings } from '../../../lib/admin/listings';
import ListingsTable from '../../../components/admin/ListingsTable';
import ListingDetailModal from '../../../components/admin/ListingDetailModal';

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewListing, setViewListing] = useState(null);

  const fetchListings = async () => { setLoading(true); setListings(await getAllListings()); setLoading(false); };
  useEffect(() => { fetchListings(); }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center">
          <Package size={20} className="text-green-400" />
        </div>
        <div>
          <h1 className="text-lg font-black text-white">Listings</h1>
          <p className="text-xs text-slate-500">{listings.length} listings on the platform</p>
        </div>
      </div>
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
        <ListingsTable listings={listings} loading={loading} onRefresh={fetchListings} onViewListing={setViewListing} />
      </div>
      <ListingDetailModal isOpen={!!viewListing} onClose={() => setViewListing(null)} listing={viewListing} />
    </div>
  );
}
