'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Grid3x3, List, Loader2 } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import ListingCard from '../../../components/ui/ListingCard';
import RecentListingCard from '../../../components/ui/RecentListingCard';

const categories = ['All', 'Phones', 'Cars', 'Fashion', 'Properties', 'Electronics', 'Personals', 'Jobs', 'Services'];

// Map slugs to exact category names as stored in Firestore
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

export default function CategoriesPage() {
  const params = useParams();
  const slug = params?.slug || 'all';
  
  // Get the display category name from slug
  const getCategoryFromSlug = (slug) => {
    return slugToCategoryMap[slug] || 'All';
  };

  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromSlug(slug));
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Fetch ALL listings first (no where clause)
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
        
        // Filter by category on the CLIENT SIDE (if not 'All')
        if (selectedCategory !== 'All') {
          console.log('Filtering by category:', selectedCategory);
          fetchedListings = fetchedListings.filter(listing => listing.category === selectedCategory);
        }
        
        console.log(`Found ${fetchedListings.length} listings for category: ${selectedCategory}`);
        
        // Apply search filter if needed
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

  // Update selected category when slug changes
  useEffect(() => {
    const newCategory = getCategoryFromSlug(slug);
    console.log('Slug changed:', slug, '-> Category:', newCategory);
    setSelectedCategory(newCategory);
  }, [slug]);

  // Transform listing for the card component
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
    <div className="min-h-screen bg-light-bg pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 md:px-6">
        <h1 className="text-xl md:text-2xl font-bold text-dark-text mb-3">
          {selectedCategory === 'All' ? 'Explore Listings' : `${selectedCategory} Listings`}
        </h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const newSlug = cat === 'All' ? 'all' : cat.toLowerCase();
                setSelectedCategory(cat);
                window.history.pushState({}, '', `/categories/${newSlug}`);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-dark-muted hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
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
            <div className="text-6xl mb-4">📭</div>
            <p className="text-dark-muted">No listings found in {selectedCategory}</p>
            {/* <Link href="/post" className="text-primary text-sm mt-2 inline-block hover:underline">
              Be the first to post a listing →
            </Link> */}
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