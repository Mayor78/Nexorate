'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Search, Grid3x3, List, Loader2, MapPin, Zap, TrendingUp, Flame } from 'lucide-react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import ListingCard from '../../components/ui/ListingCard';
import RecentListingCard from '../../components/ui/RecentListingCard';
import { smartSearch, smartLocationFilter } from '../../lib/utils/searchUtils';

const slugToCategoryMap = {
  'all': 'All',
  'phones': 'Phones',
  'cars': 'Cars',
  'fashion': 'Fashion',
  'properties': 'Properties',
  'electronics': 'Electronics',
  'personals': 'Personals',
  'jobs': 'Jobs',
  'services': 'Services',
};

export default function CategorySlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug || 'all';

  const urlQuery = searchParams.get('q') || '';
  const urlLocation = searchParams.get('location') || '';

  const [selectedCategory, setSelectedCategory] = useState(slugToCategoryMap[slug] || 'All');
  const [showTrending, setShowTrending] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [locationFilter, setLocationFilter] = useState(urlLocation);
  const [viewMode, setViewMode] = useState('grid');
  const [listings, setListings] = useState([]);
  const [allCategoryListings, setAllCategoryListings] = useState([]);
  const [trendingListings, setTrendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let constraints = [];
        if (selectedCategory !== 'All') {
          constraints.push(where('category', '==', selectedCategory));
        }
        constraints.push(where('status', '==', 'active'));

        const q = query(collection(db, 'listings'), ...constraints);
        const querySnapshot = await getDocs(q);

        let fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        fetchedListings.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        });

        setAllCategoryListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory]);

  const fetchTrending = async () => {
    setTrendingLoading(true);
    setShowTrending(true);
    try {
      const q = query(
        collection(db, 'listings'),
        where('status', '==', 'active'),
        limit(50)
      );
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      const boosted = all.filter(l => l.isBoosted).sort((a, b) => (b.boostLevel || 0) - (a.boostLevel || 0));
      const boostedIds = new Set(boosted.map(l => l.id));
      const popular = all.filter(l => !boostedIds.has(l.id)).sort((a, b) => (b.views || 0) - (a.views || 0));

      const combined = [...boosted, ...popular].slice(0, 20);
      setTrendingListings(combined);
    } catch (error) {
      console.error('Error fetching trending:', error);
    } finally {
      setTrendingLoading(false);
    }
  };

  useEffect(() => {
    if (showTrending) {
      fetchTrending();
    }
  }, [showTrending]);

  useEffect(() => {
    let results = [...allCategoryListings];

    if (searchQuery) results = smartSearch(results, searchQuery);
    if (locationFilter) results = smartLocationFilter(results, locationFilter);

    results.sort((a, b) => {
      if ((a.isBoosted && !b.isBoosted)) return -1;
      if ((!a.isBoosted && b.isBoosted)) return 1;
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return dateB - dateA;
    });

    setListings(results);
  }, [allCategoryListings, searchQuery, locationFilter]);

  const transformListing = (listing) => {
    let imagesArray = [];
    if (listing.images && Array.isArray(listing.images)) {
      imagesArray = listing.images.map(img => {
        if (typeof img === 'object' && img !== null) {
          return { url: img.url || img.thumbnail || '', thumbnail: img.thumbnail || img.url || '', publicId: img.publicId || '' };
        }
        if (typeof img === 'string' && img.length > 0) return { url: img, thumbnail: img };
        return null;
      }).filter(img => img !== null);
    }
    return {
      id: listing.id,
      title: listing.title || 'Untitled',
      price: listing.price || 0,
      location: listing.location || 'Location not specified',
      images: imagesArray,
      category: listing.category || 'General',
      isBoosted: listing.isBoosted || false,
      views: listing.views || 0,
      seller: { name: listing.sellerName || 'Anonymous', rating: listing.sellerRating || 0 },
    };
  };

  const transformedListings = showTrending ? trendingListings.map(transformListing) : listings.map(transformListing);
  const hasActiveFilters = searchQuery || locationFilter;
  const isLoading = showTrending ? trendingLoading : loading;

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('search') || '';
    const newLocation = formData.get('location') || '';
    setSearchQuery(newQuery);
    setLocationFilter(newLocation);
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newLocation) params.set('location', newLocation);
    window.history.pushState({}, '', `/categories/${slug}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    window.history.pushState({}, '', `/categories/${slug}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            {showTrending ? 'Trending Now' : selectedCategory === 'All' ? 'All Listings' : `${selectedCategory} Listings`}
            {hasActiveFilters && !showTrending && (
              <span className="text-sm font-normal text-slate-500 ml-2">({transformedListings.length} results)</span>
            )}
          </h1>
          <button
            onClick={() => {
              if (showTrending) {
                setShowTrending(false);
              } else {
                fetchTrending();
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              showTrending
                ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showTrending ? (
              <>
                <Zap size={14} /> Trending
              </>
            ) : (
              <>
                <Flame size={14} /> Trending
              </>
            )}
          </button>
        </div>

        {showTrending && (
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
            <TrendingUp size={13} className="text-orange-500" />
            Hot picks combining boosted ads and popular listings across all categories
          </p>
        )}

        {!showTrending && (
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="search"
                type="text"
                placeholder="Search in this category..."
                defaultValue={searchQuery}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 transition"
              />
            </div>
            <div className="flex-[0.7] relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="location"
                type="text"
                placeholder="Filter by location"
                defaultValue={locationFilter}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 transition"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-sky-500 transition"
            >
              Search
            </button>
          </form>
        )}

        {hasActiveFilters && !showTrending && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-slate-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-600 text-xs rounded-full">
                Search: {searchQuery}
              </span>
            )}
            {locationFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-600 text-xs rounded-full">
                Location: {locationFilter}
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600">Clear all</button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <p className="text-sm text-slate-500">
          {isLoading ? 'Loading...' : `${transformedListings.length} listing${transformedListings.length !== 1 ? 's' : ''} found`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-6 pb-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="animate-spin text-sky-500" />
          </div>
        ) : transformedListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <div className="text-6xl mb-4">{showTrending ? '🔥' : '🔍'}</div>
            <p className="text-slate-500 font-medium">
              {showTrending ? 'No trending listings yet. Boost your ad to appear here!' : 'No listings found'}
            </p>
            {hasActiveFilters && !showTrending && (
              <button onClick={clearFilters} className="mt-4 text-sky-600 text-sm font-bold hover:underline">Clear all filters</button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {transformedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {transformedListings.map((listing) => (
              <RecentListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
