'use client';

import { User, Star, MapPin, Edit2, MessageSquare, Share2, Calendar, Phone, Mail, ShoppingBag, Tag, CheckCircle } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    const date = dateString?.toDate ? dateString.toDate() : new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'Unknown';
  }
};

const formatMonthYear = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    const date = dateString?.toDate ? dateString.toDate() : new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return 'Unknown';
  }
};

export default function ProfileHeader({ userData, totalListings, activeListings, soldListings, onEdit }) {
  const rating = userData?.rating || 0;

  return (
    <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── MAIN CARD (left 2/3) ─────────────────────────────────────── */}
        <div
          className="lg:col-span-2 rounded-2xl overflow-hidden shadow-sm border"
          style={{ backgroundColor: '#fff', borderColor: '#E8EDF2' }}
        >
          {/* Top strip */}
          <div
            className="h-24 md:h-28 relative"
            style={{ background: 'linear-gradient(120deg, #0EA5E9 0%, #38BDF8 60%, #7DD3FC 100%)' }}
          >
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute -top-4 -right-4 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-6 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-0 sm:gap-5 -mt-14 md:-mt-16 mb-5">
              {/* Avatar + joined badge */}
              <div className="relative shrink-0 self-start">
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' }}
                >
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt={userData.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-sky-400" />
                  )}
                </div>
                {/* Online dot */}
                <div
                  className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${userData?.status === 'online' ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: userData?.status === 'online' ? '#22C55E' : '#94A3B8' }}
                />
                {/* Joined badge */}
                <div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[10px] font-bold text-white text-center whitespace-nowrap shadow-md"
                  style={{ backgroundColor: '#0EA5E9' }}
                >
                  Joined {formatMonthYear(userData?.createdAt)}
                </div>
              </div>

              {/* Name + meta — pushed down on mobile to clear the badge */}
              <div className="flex-1 min-w-0 mt-8 sm:mt-0 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl md:text-2xl font-black" style={{ color: '#0F172A' }}>
                    {userData?.displayName || 'User'}
                  </h1>
                  {userData?.userType === 'business' && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{ backgroundColor: '#F0F9FF', color: '#0369A1', borderColor: '#BAE6FD' }}
                    >
                      🏢 Business
                    </span>
                  )}
                  {userData?.role === 'admin' && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#FFF7ED', color: '#C2410C' }}
                    >
                      ⚡ Admin
                    </span>
                  )}
                </div>

                {/* Contact line */}
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#64748B' }}>
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} style={{ color: '#0EA5E9' }} />
                    {userData?.email}
                  </span>
                  {userData?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} style={{ color: '#0EA5E9' }} />
                      {userData.phone}
                    </span>
                  )}
                  {userData?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} style={{ color: '#0EA5E9' }} />
                      {userData.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit button — top-right on desktop */}
              <div className="shrink-0 self-start mt-1 hidden sm:block">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#0EA5E9' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0284C7')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0EA5E9')}
                >
                  <Edit2 size={15} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 }} />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Listings', value: totalListings ?? 0, color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD', icon: ShoppingBag },
                { label: 'Active',          value: activeListings  ?? 0, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', icon: CheckCircle },
                { label: 'Sold',            value: soldListings    ?? 0, color: '#7C3AED', bg: '#FAF5FF', border: '#DDD6FE', icon: Tag },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-xl px-4 py-3 border"
                  style={{ backgroundColor: s.bg, borderColor: s.border }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon size={13} style={{ color: s.color }} />
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: s.color }}>
                      {s.label}
                    </p>
                  </div>
                  <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            {userData?.bio && (
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#64748B' }}>
                {userData.bio}
              </p>
            )}

            {/* Edit button mobile */}
            <button
              onClick={onEdit}
              className="sm:hidden w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#0EA5E9' }}
            >
              <Edit2 size={15} /> Edit Profile
            </button>
          </div>
        </div>

        {/* ── SIDEBAR CARD (right 1/3) ─────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Rating card */}
          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{ backgroundColor: '#fff', borderColor: '#E8EDF2' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
              Seller Rating
            </p>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-4xl font-black" style={{ color: '#0F172A' }}>
                {rating.toFixed(1)}
              </span>
              <div className="pb-1">
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      style={{
                        fill: i < Math.floor(rating) ? '#FBBF24' : 'none',
                        color: i < Math.floor(rating) ? '#FBBF24' : '#CBD5E1',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: '#94A3B8' }}>out of 5.0</p>
              </div>
            </div>

            {/* Rating bar breakdown (visual only) */}
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs w-2 text-right" style={{ color: '#94A3B8' }}>{star}</span>
                <Star size={10} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: star === Math.round(rating) ? '60%' : star > Math.round(rating) ? '20%' : '40%',
                      backgroundColor: '#FBBF24',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions card */}
          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{ backgroundColor: '#fff', borderColor: '#E8EDF2' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
              Quick Actions
            </p>
            <div className="space-y-2">
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={{ backgroundColor: '#F0F9FF', color: '#0369A1' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E0F2FE')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F0F9FF')}
              >
                <Edit2 size={15} /> Edit Profile
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={{ backgroundColor: '#F8FAFC', color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: userData?.displayName, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 size={15} /> Share Profile
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={{ backgroundColor: '#F8FAFC', color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              >
                <MessageSquare size={15} /> Messages
              </button>
            </div>
          </div>

          {/* Member info card */}
          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{ backgroundColor: '#fff', borderColor: '#E8EDF2' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>
              Account Info
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#CBD5E1' }}>
                  Account Type
                </p>
                <p className="font-semibold capitalize" style={{ color: '#334155' }}>
                  {userData?.userType || 'Individual'}
                </p>
              </div>
              {userData?.userType === 'business' && userData?.businessName && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#CBD5E1' }}>
                    Business Name
                  </p>
                  <p className="font-semibold" style={{ color: '#334155' }}>{userData.businessName}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#CBD5E1' }}>
                  Member Since
                </p>
                <p className="font-semibold" style={{ color: '#334155' }}>
                  {formatDate(userData?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}