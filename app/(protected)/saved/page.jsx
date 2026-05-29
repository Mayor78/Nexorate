'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export default function SavedPage() {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // Fetch saved listings from user document
  useEffect(() => {
    const fetchSavedListings = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const savedListingIds = userSnap.data().savedListings || [];
          
          if (savedListingIds.length === 0) {
            setSavedItems([]);
            setLoading(false);
            return;
          }

          // Fetch each saved listing details
          const savedPromises = savedListingIds.map(async (listingId) => {
            const listingRef = doc(db, 'listings', listingId);
            const listingSnap = await getDoc(listingRef);
            if (listingSnap.exists()) {
              return { id: listingSnap.id, ...listingSnap.data() };
            }
            return null;
          });

          const results = await Promise.all(savedPromises);
          const validListings = results.filter(item => item !== null);
          setSavedItems(validListings);
        }
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedListings();
  }, [user]);

  const handleRemoveSaved = async (listingId) => {
    if (!user) return;
    
    setRemovingId(listingId);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedListings: arrayRemove(listingId)
      });
      
      // Remove from local state
      setSavedItems(prev => prev.filter(item => item.id !== listingId));
    } catch (error) {
      console.error('Error removing saved listing:', error);
      alert('Failed to remove from saved. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get image URL helper
  const getImageUrl = (listing) => {
    if (listing.images && listing.images.length > 0) {
      const firstImage = listing.images[0];
      return typeof firstImage === 'object' ? firstImage?.url : firstImage;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Saved Items</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {savedItems.length} item{savedItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* Saved Items Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {savedItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">No saved items yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Heart listings you like and they'll appear here for easy access
            </p>
            <Link 
              href="/categories" 
              className="inline-block mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {savedItems.map((item) => {
              const imageUrl = getImageUrl(item);
              const isRemoving = removingId === item.id;
              
              return (
                <div key={item.id} className="group relative">
                  <Link href={`/listings/${item.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-200">
                      {/* Image */}
                      <div className="relative aspect-square bg-slate-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={32} className="text-slate-300" />
                          </div>
                        )}
                        
                        {/* Remove button overlay */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveSaved(item.id);
                          }}
                          disabled={isRemoving}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-red-50 transition group-hover:opacity-100 opacity-0 group-hover:opacity-100"
                        >
                          {isRemoving ? (
                            <Loader2 size={14} className="animate-spin text-red-500" />
                          ) : (
                            <Trash2 size={14} className="text-red-500" />
                          )}
                        </button>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3">
                        <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-primary font-bold text-sm mt-1">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                          <MapPin size={10} />
                          <span className="truncate">{item.location || 'Location not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}