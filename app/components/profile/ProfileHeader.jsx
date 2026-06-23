'use client';

import { User, Star, MapPin, Edit2, MessageSquare, Share2 } from 'lucide-react';

export default function ProfileHeader({ userData, totalListings, activeListings, soldListings, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Calculate rating stars
  const rating = userData.rating || 0;

  return (
    <>
      {/* Hero Background */}
      <div className="relative h-32 md:h-40 bg-linear-to-r from-sky-500 via-sky-400 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-2 left-5 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative px-4 md:px-6 -mt-16 md:-mt-20 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <div className="w-full h-full relative">
                      <image 
                        src={userData.avatar} 
                        alt={userData.displayName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <User size={56} className="text-sky-400" />
                  )}
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white ${userData.status === 'online' ? 'animate-pulse' : ''}`}></div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900">{userData.displayName}</h1>
                  {userData.userType === 'business' && userData.businessName && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full border border-sky-200">
                      🏢 Business
                    </span>
                  )}
                </div>

                {/* Email */}
                <p className="text-slate-600 text-sm font-medium mb-3">{userData.email}</p>

                {/* Location and Member Since */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600">
                  {userData.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-sky-500 shrink-0" />
                      <span className="font-medium">{userData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">📅 Member since {formatDate(userData.createdAt)}</span>
                  </div>
                </div>

                {/* Rating and Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(rating) ? `fill-amber-400 text-amber-400` : 'text-slate-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">(Reviews)</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-sky-50 rounded-lg p-3 border border-sky-100">
                    <p className="text-xs font-bold text-sky-600 uppercase tracking-wide">Total Listings</p>
                    <p className="text-xl font-black text-sky-700 mt-1">{totalListings || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Active</p>
                    <p className="text-xl font-black text-green-700 mt-1">{activeListings || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">Sold</p>
                    <p className="text-xl font-black text-purple-700 mt-1">{soldListings || 0}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button 
                  onClick={onEdit}
                  className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
                <button 
                  className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  <span>Message</span>
                </button>
                <button 
                  className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  title="Share Profile"
                >
                  <Share2 size={18} />
                   <span>Share Profile</span>
                </button>
              </div>
            </div>

            {/* Bio Section */}
            {userData.bio && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">{userData.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}