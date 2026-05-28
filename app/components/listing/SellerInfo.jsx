'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function SellerInfo({ seller }) {
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            {seller.avatar && seller.avatar !== '' ? (
              <Image src={seller.avatar} alt={seller.name} width={48} height={48} className="rounded-full" />
            ) : (
              <span className="text-lg font-bold">{seller.name?.charAt(0) || '?'}</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-dark-text">{seller.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400" /> {seller.rating?.toFixed(1) || '0'}</span>
              <span className="text-dark-muted">• {seller.totalListings || 0} listings</span>
            </div>
          </div>
        </div>
        <Link href={`/profile/${seller.id}`}>
          <button className="text-primary text-sm font-medium">View Profile</button>
        </Link>
      </div>
    </div>
  );
}