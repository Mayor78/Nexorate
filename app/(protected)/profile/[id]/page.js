'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Star, MessageSquare, ChevronLeft, 
  ShieldCheck, Clock, Package, Heart, CheckCircle2, Eye, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';

export default function SellerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('listings');
  const [seller, setSeller] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);

        // Fetch seller data from users collection
        const userRef = doc(db, 'users', params.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const sellerData = {
            id: userSnap.id,
            name: userData.displayName || userData.fullName || 'Seller',
            fullName: userData.displayName || userData.fullName || 'Seller',
            displayName: userData.displayName || 'Seller',
            location: userData.location || 'Not specified',
            email: userData.email || '',
            phone: userData.phone || '',
            bio: userData.bio || 'Marketplace seller',
            avatar: userData.avatar || '',
            rating: userData.rating || 0,
            totalReviews: userData.totalReviews || 0,
            totalSales: userData.totalSales || 0,
            userType: userData.userType || 'individual',
            isVerified: userData.isVerified || false,
            ...userData, // Include all other fields
          };
          setSeller(sellerData);
        } else {
          // Fallback: create seller profile from listings
          const listingsQuery = query(
            collection(db, 'listings'),
            where('sellerId', '==', params.id)
          );
          const listingsSnap = await getDocs(listingsQuery);
          
          if (listingsSnap.empty) {
            setError('Seller not found');
            return;
          }

          // Create seller profile from first listing's seller data
          const firstListing = listingsSnap.docs[0].data();
          const sellerData = {
            id: params.id,
            name: firstListing.sellerName || 'Unknown Seller',
            fullName: firstListing.sellerName || 'Unknown Seller',
            rating: firstListing.sellerRating || 0,
            totalSales: 0,
            location: 'Not specified',
            email: '',
            phone: '',
            bio: 'Marketplace seller',
            isVerified: false,
          };
          setSeller(sellerData);
        }

        // Fetch seller's listings
        const listingsQuery = query(
          collection(db, 'listings'),
          where('sellerId', '==', params.id)
        );
        const listingsSnap = await getDocs(listingsQuery);
        const listings = listingsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        
        setSellerListings(listings);
      } catch (err) {
        console.error('Error fetching seller data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSellerData();
    }
  }, [params.id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    if (date.toDate) return date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-sky-500" />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl max-w-sm w-full shadow-sm">
          <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
          <p className="text-slate-800 font-bold mb-2">{error || 'Seller not found'}</p>
          <button onClick={() => router.back()} className="w-full bg-slate-900 text-white py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition hover:bg-slate-800">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-12">
      {/* Sticky Back Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3.5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider transition">
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 space-y-6">
        
        {/* Profile Details Block */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-8 md:px-8">
            <div className="flex flex-col items-center text-center">
              
              {/* Profile Avatar Container */}
              <div className="w-20 h-20 bg-slate-100 border border-slate-200/80 rounded-full flex items-center justify-center mb-4 text-2xl font-black text-slate-800 shrink-0 select-none">
                {seller.avatar ? (
                  <Image src={seller.avatar} alt={seller.name || seller.fullName || 'Seller'} width={80} height={80} className="rounded-full h-full w-full object-cover" />
                ) : (
                  (seller.name || seller.fullName || 'S').charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Seller Name and Flat Verification Badge */}
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">{seller.name || seller.fullName || 'Seller'}</h1>
                {seller.isVerified && (
                  <CheckCircle2 size={18} className="text-sky-500 fill-sky-500/10 shrink-0" title="Verified Seller" />
                )}
              </div>
              
              {/* Location Detail */}
              <p className="text-slate-500 text-xs font-semibold flex items-center gap-1 mb-3">
                <MapPin size={13} className="text-slate-400 shrink-0" /> {seller.location || 'Location not specified'}
              </p>
              
              {/* Micro Platform Social Proof Metrics */}
              <div className="flex items-center flex-wrap justify-center gap-2 mb-6 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">{seller.rating || 0}</span>
                </div>
                <span>•</span>
                <span>{seller.totalReviews || 0} Reviews</span>
                <span>•</span>
                <span className="text-sky-600 font-bold">{sellerListings.length} Active Ads</span>
              </div>
              
              {/* Action Callouts */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
                <button className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition duration-150 active:scale-[0.995]">
                  <MessageSquare size={15} /> Message Seller
                </button>
                <button 
                  onClick={() => setActiveTab('listings')}
                  className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-150"
                >
                  View Listings
                </button>
              </div>

            </div>
          </div>
          
          {/* Flat Grid Analytics Overview */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50 py-4">
            <div className="text-center">
              <p className="text-lg font-black text-slate-900">{sellerListings.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-slate-900">{seller.totalSales || 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Sold</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-slate-900">{seller.rating || 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Rating</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Segment */}
        <div className="border-b border-slate-200 px-2 sm:px-0">
          <div className="flex gap-6 max-w-4xl mx-auto">
            {['listings', 'reviews', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 relative -mb-[1px] ${
                  activeTab === tab 
                    ? 'text-sky-600 border-sky-500' 
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${seller.totalReviews || 0})` : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context Container Window */}
        <div className="min-h-[200px]">
          
          {/* TAB 1: PRODUCT LISTINGS AD CATALOG */}
          {activeTab === 'listings' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Ads ({sellerListings.length})</h2>
              </div>
              
              {sellerListings.length === 0 ? (
                <div className="text-center py-14 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <Package size={28} className="mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                  <p className="text-slate-400 text-xs font-medium">No live product offers registered under this user profile.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sellerListings.map((listing) => (
                    <Link href={`/listings/${listing.id}`} key={listing.id} className="block">
                      <div className="bg-white rounded-xl p-3.5 flex gap-4 border border-slate-100 hover:border-slate-200 shadow-sm transition duration-150 group">
                        
                        {/* Thumb Display Image or Graphic Placeholder */}
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors duration-150 overflow-hidden relative">
                          {listing.images && listing.images.length > 0 ? (
                            <Image
                              src={typeof listing.images[0] === 'object' ? listing.images[0].url : listing.images[0]}
                              alt={listing.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <Package size={20} className="stroke-[1.5]" />
                          )}
                        </div>
                        
                        {/* Text Metadata Feed Information Layout */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-sky-600 transition-colors duration-150">
                                {listing.title}
                              </h3>
                              <span className="text-sky-600 font-extrabold text-sm sm:text-base whitespace-nowrap">
                                {formatPrice(listing.price)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-400">
                              <span className="flex items-center gap-0.5"><MapPin size={11} className="shrink-0" /> {listing.location || 'Not specified'}</span>
                              <span className="flex items-center gap-0.5"><Eye size={11} className="shrink-0" /> {listing.views || 0} views</span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                              Posted {formatDate(listing.createdAt)}
                            </span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SYSTEM USER REVIEWS SCORES */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Aggregated Analytics Card */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                <div>
                  <p className="text-3xl font-black text-slate-900">{seller.rating || 0}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} className={`${star <= Math.floor(seller.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Ecosystem Evaluation rating profile logs ({seller.totalReviews || 0})</p>
                </div>
              </div>
              
              {/* Empty Feedback Notice Area */}
              <div className="text-center py-12 bg-white border border-slate-100 rounded-xl shadow-sm">
                <p className="text-slate-400 font-medium text-xs">No peer evaluation history records verified for this account terminal.</p>
              </div>
            </div>
          )}

          {/* TAB 3: USER MATURITY AND BIO SUMMARY DATA */}
          {activeTab === 'about' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Core Text Profiling */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Corporate Profile</h3>
                <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {seller.bio || seller.about || 'No descriptive bio history custom set by owner context.'}
                </p>
              </div>
              
              {/* Verified Grid Data Nodes Sheet */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Merchant Information</h3>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {seller.email && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-500 font-medium">Secured Email Address</span>
                      <span className="font-bold text-slate-800">{seller.email}</span>
                    </div>
                  )}
                  {seller.phone && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-500 font-medium">Verified Communications Line</span>
                      <span className="font-mono font-bold text-slate-800 tracking-wide">{seller.phone}</span>
                    </div>
                  )}
                  {seller.location && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-500 font-medium">Marketplace Hub Base</span>
                      <span className="font-bold text-slate-800">{seller.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <ShieldCheck size={15} className="text-slate-400 shrink-0" /> Security Screening Clearance
                    </span>
                    <span className={`font-bold text-xs uppercase tracking-wider ${seller.isVerified ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {seller.isVerified ? 'Verified Platform Ecosystem Merchant' : 'Pending Screening'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}