'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Grid3x3, List, Loader2, X, MapPin } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
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
  
  // Get search params from URL
  const urlQuery = searchParams.get('q') || '';
  const urlLocation = searchParams.get('location') || '';
  
  const [selectedCategory, setSelectedCategory] = useState(slugToCategoryMap[slug] || 'All');
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [locationFilter, setLocationFilter] = useState(urlLocation);
  const [viewMode, setViewMode] = useState('grid');
  const [listings, setListings] = useState([]);
  const [allCategoryListings, setAllCategoryListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch listings for this category
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
        
        // Sort by newest first
        fetchedListings.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        });
        
        console.log(`Found ${fetchedListings.length} listings for category: ${selectedCategory}`);
        setAllCategoryListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory]);

  // Apply search and location filters
  useEffect(() => {
    let results = [...allCategoryListings];
    
    console.log('Applying filters - Search:', searchQuery, 'Location:', locationFilter);
    
    if (searchQuery) {
      results = smartSearch(results, searchQuery);
      console.log('After search filter:', results.length);
    }
    
    if (locationFilter) {
      results = smartLocationFilter(results, locationFilter);
      console.log('After location filter:', results.length);
    }
    
    setListings(results);
  }, [allCategoryListings, searchQuery, locationFilter]);

  const transformListing = (listing) => {
    let imagesArray = [];
    
    if (listing.images && Array.isArray(listing.images)) {
      imagesArray = listing.images.map(img => {
        if (typeof img === 'object' && img !== null) {
          return {
            url: img.url || img.thumbnail || '',
            thumbnail: img.thumbnail || img.url || '',
            publicId: img.publicId || '',
          };
        }
        if (typeof img === 'string' && img.length > 0) {
          return { url: img, thumbnail: img };
        }
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
      seller: {
        name: listing.sellerName || 'Anonymous',
        rating: listing.sellerRating || 0,
      },
    };
  };

  const transformedListings = listings.map(transformListing);
  const hasActiveFilters = searchQuery || locationFilter;

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('search') || '';
    const newLocation = formData.get('location') || '';
    
    setSearchQuery(newQuery);
    setLocationFilter(newLocation);
    
    // Update URL
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
    <div className="min-h-screen bg-light-bg pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 md:px-6">
        <h1 className="text-xl md:text-2xl font-bold text-dark-text mb-3">
          {selectedCategory === 'All' ? 'All Listings' : `${selectedCategory} Listings`}
          {hasActiveFilters && (
            <span className="text-sm font-normal text-dark-muted ml-2">
              ({transformedListings.length} results)
            </span>
          )}
        </h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
            <input
              name="search"
              type="text"
              placeholder="Search in this category..."
              defaultValue={searchQuery}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition"
            />
          </div>
          <div className="flex-[0.7] relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
            <input
              name="location"
              type="text"
              placeholder="Filter by location"
              defaultValue={locationFilter}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition"
            />
          </div>
          <button 
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition"
          >
            Search
          </button>
        </form>
        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-dark-muted">Active filters:</span>
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
            <button 
              onClick={clearFilters}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* View Toggle & Results Count */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <p className="text-sm text-dark-muted">
          {loading ? 'Loading...' : `${transformedListings.length} listing${transformedListings.length !== 1 ? 's' : ''} found`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-dark-muted'}`}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-dark-muted'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Listings Display */}
      <div className="px-4 md:px-6 pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : transformedListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-dark-muted">No listings found</p>
            {hasActiveFilters ? (
              <>
                <p className="text-sm text-dark-muted mt-1">
                  Try different search terms or clear filters
                </p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-primary text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <p className="text-sm text-dark-muted mt-1">
                No listings in {selectedCategory} yet
              </p>
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