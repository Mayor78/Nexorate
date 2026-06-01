'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, ChevronDown } from 'lucide-react';
import { collection, getDocs, orderBy, query, limit, startAfter } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import ListingCard from '../ui/ListingCard';
import { PAGINATION } from '../../lib/constants';

export default function FeaturedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // ✅ FIXED: Added limit(20) for pagination
        const q = query(
          collection(db, 'listings'),
          orderBy('createdAt', 'desc'),
          limit(PAGINATION.LISTINGS_PER_PAGE)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setListings(fetchedListings);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(fetchedListings.length === PAGINATION.LISTINGS_PER_PAGE);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const loadMore = async () => {
    if (!lastDoc || !hasMore) return;
    
    try {
      setLoading(true);
      // ✅ Load next batch
      const q = query(
        collection(db, 'listings'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGINATION.LISTINGS_PER_PAGE)
      );
      
      const querySnapshot = await getDocs(q);
      const newListings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setListings(prev => [...prev, ...newListings]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(newListings.length === PAGINATION.LISTINGS_PER_PAGE);
    } catch (err) {
      console.error('Error loading more listings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 bg-linear-to-r from-amber-50/50 to-orange-50/50 md:px-6">
      <div className="flex items-center gap-2 mb-4">
      
        <h2 className="text-lg md:text-xl font-bold text-dark-text">Latest Listings</h2>
        
      </div>
      
      {loading && listings.length === 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(8)].map((_, i) => (
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

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown size={18} />
                    Load More
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}