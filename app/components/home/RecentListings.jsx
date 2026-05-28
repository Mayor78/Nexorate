'use client';

import { useState, useEffect } from 'react';
import { Filter, TrendingUp } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import ListingCard from '../ui/ListingCard';

export default function RecentListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Fetch all listings from Firestore, ordered by creation date (newest first)
        const q = query(
          collection(db, 'listings'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setListings(fetchedListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-dark-text flex items-center gap-2">
          Recent Listings
          <TrendingUp size={18} className="text-green-500" />
        </h2>
        <button className="flex items-center gap-1 text-dark-muted text-sm hover:text-primary transition">
          <Filter size={14} /> Filter
        </button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-200 rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          Error loading listings: {error}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-slate-500 text-center py-8">
          No listings available yet
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}