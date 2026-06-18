'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  MapPin, Phone, ChevronLeft, AlertCircle, Loader2, Share2, Flag, Zap, Star, BarChart3,
  CheckCircle,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { formatPrice } from '../../../lib/formatters';
import LoginPrompt from '../../../components/ui/LoginPrompt';
import ImageGallery from '../../../components/listing/ImageGallery';
import SellerInfo from '../../../components/listing/SellerInfo';
import ListingDetails from '../../../components/listing/ListingDetails';
import MessageButton from '../../../components/listing/MessageButton';
import BoostModal from '../../../components/listing/BoostModal';
import RateSellerModal from '../../../components/listing/RateSellerModal';
import BoostAnalytics from '../../../components/listing/BoostAnalytics';
import { trackListingEvent } from '../../../lib/analytics';
import { motion } from 'framer-motion';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        try {
          await updateDoc(listingRef, { views: increment(1) });
        } catch (err) {
          console.warn('Could not increment views:', err);
        }

        trackListingEvent(params.id, 'view', { title: listingData.title }).catch(() => {});

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

    if (params.id) fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-slate-900 font-semibold text-lg mb-1">An error occurred</h3>
          <p className="text-slate-500 text-sm mb-5">{error || 'Listing not found'}</p>
          <button 
            onClick={() => router.back()}
            className="w-full bg-slate-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-slate-800 transition"
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
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition"
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>
          
          <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition">
              <Share2 size={18} />
            </button>
            <button className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
              <Flag size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* LEFT & CENTER COLUMN: Media & Details */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <ImageGallery 
                images={listing.images}
                title={listing.title}
                isBoosted={listing.isBoosted}
                isLiked={isLiked}
                onLike={() => setIsLiked(!isLiked)}
              />
            </div>

            {/* Core Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{listing.title}</h1>
                <div className="flex items-baseline gap-4">
                  <p className="text-2xl md:text-3xl font-extrabold text-blue-600">{formatPrice(listing.price)}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-slate-100 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={15} className="text-slate-400" /> {listing.location}</span>
                <span className="text-slate-300">•</span>
                <span>{listing.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Meta Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <ListingDetails customFields={listing.customFields} />
            </div>

            {/* Markdown/Text Description Component */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-3 text-base">Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact, Actions & Premium Modifiers */}
          <div className="space-y-5 md:sticky md:top-20">
            
            {/* Vendor Panel */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <SellerInfo seller={seller} />
            </div>

            {/* Interactive Actions Panel */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
              <MessageButton 
                listing={{ ...listing, id: params.id }}
                seller={seller}
                user={user}
                onNeedLogin={() => setShowLoginPrompt(true)}
              />

              {/* Dynamic Native Call Drawer Actions */}
              {!showPhone ? (
                <button 
                  onClick={() => setShowPhone(true)}
                  className="w-full border border-slate-200 text-slate-800 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                >
                  <Phone size={16} /> Show Phone Number
                </button>
              ) : (
                <a 
                  href={`tel:${seller.phone}`}
                  className="block w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-center hover:bg-slate-100/70 transition"
                >
                  <p className="font-semibold text-slate-900 text-sm">{seller.phone || 'Not provided'}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Click to call dialer</p>
                </a>
              )}

              {/* Administrative Boost Functions for Creators */}
              {user?.uid === listing.sellerId && !listing.isBoosted && (
                <button
                  onClick={() => setShowBoostModal(true)}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition shadow-sm"
                >
                  <Zap size={16} /> Boost This Listing
                </button>
              )}

              {listing.isBoosted && (
                <div className="w-full bg-amber-50/60 border border-amber-200/80 p-3 rounded-xl text-center">
                  <p className="font-semibold text-amber-800 flex items-center justify-center gap-1.5 text-sm">
                    <Zap size={15} className="fill-amber-500 text-amber-500" /> Premium Boost Active
                  </p>
                  <p className="text-[11px] text-amber-600 mt-0.5">Expires {new Date(listing.boostEndsAt).toLocaleDateString()}</p>
                </div>
              )}

              {/* Utility Sub-actions */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100">
                {user?.uid === listing.sellerId && (
                  <button
                    onClick={() => setShowAnalytics(true)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-medium text-xs transition flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={14} /> View Analytics Control
                  </button>
                )}

                {user && user.uid !== listing.sellerId && (
                  <button
                    onClick={() => setShowRateModal(true)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-medium text-xs transition flex items-center justify-center gap-2"
                  >
                    <Star size={14} /> Leave Seller Review
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
          {/* Safety Tips Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Safety Tips</h4>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle size={10} className="text-emerald-500" />
                      Meet in public places
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle size={10} className="text-emerald-500" />
                      Inspect items before paying
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle size={10} className="text-emerald-500" />
                      Use secure payment methods
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

        {/* RELATED SYSTEM PRODUCTS SECTIONS */}
        {relatedListings.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="font-bold text-slate-900 mb-5 text-lg">Suggested Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedListings.map((item) => (
                <Link href={`/listings/${item.id}`} key={item.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition duration-200">
                    <div className="h-36 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                      {item.image && item.image !== '' ? (
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill
                          sizes="(max-w-768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-102 transition duration-300" 
                        />
                      ) : (
                        <span className="text-xl">📦</span>
                      )}
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-blue-600 transition">{item.title}</h3>
                      <p className="text-blue-600 font-bold text-sm">{formatPrice(item.price)}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-0.5"><MapPin size={10} /> {item.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL CONFIGURATIONS SYSTEM */}
      <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} action="message the seller" productName={listing?.title} />
      <BoostModal isOpen={showBoostModal} onClose={() => setShowBoostModal(false)} listing={{ id: params.id, ...listing }} user={user} onBoostSuccess={() => setListing(prev => ({ ...prev, isBoosted: true }))} />
      <RateSellerModal isOpen={showRateModal} onClose={() => setShowRateModal(false)} seller={seller} listingId={params.id} user={user} />
      <BoostAnalytics isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} listing={{ id: params.id, ...listing }} onBoost={() => setShowBoostModal(true)} />
    </div>
  );
}