'use client';

import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginPrompt from './LoginPrompt';
import { formatPrice } from '../../lib/formatters';

function ListingCard({ listing }) {
  const { user, toggleSaveListing, isListingSaved } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isSaved = isListingSaved?.(listing.id) || false;

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setIsSaving(true);
    await toggleSaveListing(listing.id, listing);
    setIsSaving(false);
  };

  const getImageUrl = () => {
    if (listing.images && listing.images.length > 0) {
      const img = listing.images[0];
      return typeof img === 'object' ? img?.url : img;
    }
    return listing.image || '';
  };

  return (
    <>
      <Link href={`/listings/${listing.id}`} className="group mx-1 cursor-pointer block">
        <div className="relative overflow-hidden bg-gray-100 mb-3" style={{ aspectRatio: '3/3' }}>
          {getImageUrl() ? (
            <Image
              src={getImageUrl()}
              alt={listing.title || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-4xl">&#128230;</span>
            </div>
          )}

          {/* Boosted badge */}
          {listing.isBoosted && (
            <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold tracking-widest px-2 py-0.5 z-10 flex items-center gap-1">
              <Zap size={9} />
              BOOSTED
            </span>
          )}

          {/* Save heart */}
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="absolute top-2 right-2 z-10 p-1.5"
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
          >
            <Heart
              size={16}
              className={`drop-shadow-sm ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>

          {/* Slide-up CTA on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="w-full block text-center bg-black text-white text-[10px] font-bold tracking-widest py-3 hover:bg-gray-900 transition-colors">
              VIEW LISTING
            </span>
          </div>
        </div>

        <p className="text-black text-xs font-semibold mb-1 truncate">
          {listing.title}
        </p>
        <p className="text-black text-sm font-bold">
          {formatPrice(listing.price)}
        </p>
      </Link>

      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        action="save this listing"
        productName={listing.title}
      />
    </>
  );
}

export default React.memo(ListingCard, (prevProps, nextProps) => {
  return prevProps.listing.id === nextProps.listing.id;
});
