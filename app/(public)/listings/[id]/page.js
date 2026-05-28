'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  MapPin, Phone, ChevronLeft, Star, AlertCircle, Loader2, Share2, Flag
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuth } from '../../../context/AuthContext';
import LoginPrompt from '../../../components/ui/LoginPrompt';
import ImageGallery from '../../../components/listing/ImageGallery';
import SellerInfo from '../../../components/listing/SellerInfo';
import ListingDetails from '../../../components/listing/ListingDetails';
import MessageButton from '../../../components/listing/MessageButton';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch listing data from Firebase
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        const listingRef = doc(db, 'listings', params.id);
        const listingSnap = await getDoc(listingRef);
        
        if (!listingSnap.exists()) {
          setError('Listing not found');
          return;
        }

        const listingData = { id: listingSnap.id, ...listingSnap.data() };
        setListing(listingData);

        // Increment views
        try {
          await updateDoc(listingRef, {
            views: increment(1)
          });
        } catch (err) {
          console.warn('Could not increment views:', err);
        }

        // Fetch seller info
        if (listingData.sellerId) {
          const sellerRef = doc(db, 'users', listingData.sellerId);
          const sellerSnap = await getDoc(sellerRef);
          if (sellerSnap.exists()) {
            listingData.seller = {
              id: listingData.sellerId,
              name: sellerSnap.data().displayName || 'Anonymous',
              avatar: sellerSnap.data().avatar || '',
              rating: sellerSnap.data().rating || 0,
              totalListings: sellerSnap.data().totalListings || 0,
              phone: sellerSnap.data().phone || '',
              memberSince: new Date(sellerSnap.data().createdAt).getFullYear() || 'Unknown',
            };
            setListing({ ...listingData });
          }
        }

        // Fetch related listings
        const relatedQuery = query(
          collection(db, 'listings'),
          where('category', '==', listingData.category),
          limit(6)
        );
        const relatedSnap = await getDocs(relatedQuery);
        const related = relatedSnap.docs
          .filter(doc => doc.id !== params.id && doc.data().sellerId !== listingData.sellerId)
          .slice(0, 2)
          .map(doc => {
            const firstImage = doc.data().images?.[0];
            return {
              id: doc.id,
              title: doc.data().title,
              price: doc.data().price,
              location: doc.data().location,
              image: (typeof firstImage === 'object' ? firstImage?.url : firstImage) || '',
              category: doc.data().category,
            };
          });
        
        setRelatedListings(related);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-dark-muted">Loading listing...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <p className="text-dark-text font-semibold mb-2">Error</p>
          <p className="text-dark-muted">{error || 'Listing not found'}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-primary font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const seller = listing.seller || {
    id: listing.sellerId,
    name: listing.sellerName || 'Anonymous',
    avatar: '',
    rating: listing.sellerRating || 0,
    totalListings: 0,
    phone: '',
    memberSince: 'Unknown',
  };

  return (
    <div className="min-h-screen bg-light-bg pb-20 md:pb-0">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-dark-text">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="md:max-w-4xl md:mx-auto md:px-6">
        {/* Image Gallery */}
        <ImageGallery 
          images={listing.images}
          title={listing.title}
          isBoosted={listing.isBoosted}
          isLiked={isLiked}
          onLike={() => setIsLiked(!isLiked)}
        />

        {/* Main Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Title & Price */}
          <div className="bg-white rounded-xl p-4">
            <h1 className="text-xl md:text-2xl font-bold text-dark-text">{listing.title}</h1>
            <p className="text-2xl md:text-3xl font-bold text-primary mt-2">{formatPrice(listing.price)}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-dark-muted">
              <span className="flex items-center gap-1"><MapPin size={14} /> {listing.location}</span>
              <span>•</span>
              <span>{listing.views} views</span>
            </div>
          </div>

          {/* Seller Info */}
          <SellerInfo seller={seller} />

          {/* Details Section */}
          <ListingDetails customFields={listing.customFields} />

          {/* Description */}
          <div className="bg-white rounded-xl p-4">
            <h2 className="font-semibold text-dark-text mb-3">Description</h2>
            <p className="text-dark-muted whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <MessageButton 
              listing={{ ...listing, id: params.id }}
              seller={seller}
              user={user}
              onNeedLogin={() => setShowLoginPrompt(true)}
            />
            
            {!showPhone ? (
              <button 
                onClick={() => setShowPhone(true)}
                className="w-full border border-primary text-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 transition"
              >
                <Phone size={20} /> Show Phone Number
              </button>
            ) : (
              <div className="w-full bg-gray-50 p-3 rounded-xl text-center">
                <p className="font-medium text-dark-text">{seller.phone || 'Not provided'}</p>
                <p className="text-xs text-dark-muted mt-1">Tap to call</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button className="flex-1 py-2 rounded-xl border border-gray-200 text-dark-muted flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <Share2 size={18} /> Share
              </button>
              <button className="flex-1 py-2 rounded-xl border border-gray-200 text-dark-muted flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <Flag size={18} /> Report
              </button>
            </div>
          </div>

          {/* Related Listings */}
          {relatedListings.length > 0 && (
            <div className="py-4">
              <h2 className="font-semibold text-dark-text mb-3">Related Listings</h2>
              <div className="grid grid-cols-2 gap-3">
                {relatedListings.map((item) => (
                  <Link href={`/listings/${item.id}`} key={item.id}>
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        {item.image && item.image !== '' ? (
                          <Image src={item.image} alt={item.title} width={200} height={128} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                        <p className="text-primary font-bold text-sm">{formatPrice(item.price)}</p>
                        <p className="text-xs text-dark-muted">{item.location}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        action="message the seller"
        productName={listing?.title}
      />
    </div>
  );
}