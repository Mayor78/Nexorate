'use client';

import { User, Star, MapPin, Edit2 } from 'lucide-react';

export default function ProfileHeader({ userData, totalListings, activeListings, soldListings, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="bg-gradient-to-r from-sky-500 to-sky-700 text-white">
      <div className="px-4 py-8 md:px-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            {userData.avatar ? (
              <img src={userData.avatar} alt={userData.displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={40} className="text-white" />
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold">{userData.displayName}</h1>
              {userData.userType === 'business' && userData.businessName && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Business</span>
              )}
            </div>
            <p className="text-white/80 text-sm">{userData.email}</p>
            {userData.location && (
              <div className="flex items-center gap-1 text-white/70 text-xs mt-1">
                <MapPin size={12} />
                <span>{userData.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm">{userData.rating || 0}</span>
              <span className="text-white/50">•</span>
              <span className="text-sm">Member since {formatDate(userData.createdAt)}</span>
            </div>
          </div>
          
          {/* Edit Button */}
          <button onClick={onEdit} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <Edit2 size={18} />
          </button>
        </div>
        
        {/* Stats - Now using real data */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-white/20">
          <div>
            <p className="text-2xl font-bold">{totalListings}</p>
            <p className="text-xs text-white/80">Total Listings</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{activeListings}</p>
            <p className="text-xs text-white/80">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{soldListings}</p>
            <p className="text-xs text-white/80">Sold</p>
          </div>
        </div>
      </div>
    </div>
  );
}