'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Grid3x3, List, Loader2, PackageOpen } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { trackUserActivity } from '../../../lib/tracking/userActivity';
import ListingCard from '../../../components/ui/ListingCard';
import RecentListingCard from '../../../components/ui/RecentListingCard';

const categories = [
  'All', 'Phones', 'Cars', 'Fashion', 'Properties', 'Electronics', 
  'Personals', 'Jobs', 'Services', 'Repair & Construction', 
  'Animal & Pet', 'Food & Agric', 'Beauty', 'Trending'
];

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
  'repair-construction': 'Repair & Construction',
  'animal-pet': 'Animal & Pet',
  'food-agric': 'Food & Agric',
  'beauty': 'Beauty',
  'trending': 'Trending',
};

export default function CategoriesPage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params?.slug || 'all';
  
  const getCategoryFromSlug = (slug) => {
    return slugToCategoryMap[slug] || 'All';
  };

  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromSlug(slug));
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track category click when category changes
  useEffect(() => {
    if (user && selectedCategory && selectedCategory !== 'All') {
      trackUserActivity(user.uid, 'click_category', {
        category: selectedCategory,
        slug: slug,
        timestamp: new Date().toISOString(),
      });
    }
  }, [selectedCategory, user, slug]);

  // Track search queries (debounced)
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2 || !user) return;
    
    const timeoutId = setTimeout(() => {
      trackUserActivity(user.uid, 'search', {
        term: searchQuery,
        category: selectedCategory,
        timestamp: new Date().toISOString(),
      });
    }, 1500); // Wait 1.5 seconds after user stops typing
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, user, selectedCategory]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'listings'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        let fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`Fetched total listings: ${fetchedListings.length}`);
        
        if (selectedCategory !== 'All') {
          console.log('Filtering by category:', selectedCategory);
          fetchedListings = fetchedListings.filter(listing => listing.category === selectedCategory);
        }
        
        if (searchQuery) {
          fetchedListings = fetchedListings.filter(listing => 
            listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const newCategory = getCategoryFromSlug(slug);
    setSelectedCategory(newCategory);
  }, [slug]);

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
    
    if (imagesArray.length === 0 && listing.image) {
      imagesArray = [{ url: listing.image, thumbnail: listing.image }];
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


  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-12">
      
      {/* Sticky Premium Header Shield */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              {selectedCategory === 'All' ? 'Explore General Catalog' : `${selectedCategory}`}
            </h1>
          </div>
          
          {/* Marketplace Search Input Component */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search active catalog listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
            />
          </div>
        </div>
      </div>

      {/* Matte Category Filters Strip Selection Row */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex gap-2 py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const newSlug = cat === 'All' ? 'all' : cat.toLowerCase();
                setSelectedCategory(cat);
                window.history.pushState({}, '', `/categories/${newSlug}`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/10'
                  : 'bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Stream Controls Strip */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {loading ? 'Processing data stream...' : `${transformedListings.length} product entries active`}
        </p>
        <div className="flex gap-1.5 bg-white border border-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Grid3x3 size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Main Stream Catalog Grid Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="animate-spin text-sky-500" />
          </div>
        ) : transformedListings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl max-w-sm mx-auto shadow-sm p-6">
            <PackageOpen size={36} className="mx-auto text-slate-300 mb-3 stroke-[1.5]" />
            <p className="text-slate-800 font-bold text-sm">No Listings Found</p>
            <p className="text-xs text-slate-400 mt-1">
              There are currently no matching ads on file in the {selectedCategory} tab.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* FORCED 2-COLUMN GRID ON MOBILE GRAPHIC VIEWPORTS */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {transformedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {transformedListings.map((listing) => (
              <RecentListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}