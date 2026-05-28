'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ContactInfoBar from '../../components/profile/ContactInfoBar';
import ProfileTabs from '../../components/profile/ProfileTabs';
import MyListingsTab from '../../components/profile/MyListingsTab';
import SavedListingsTab from '../../components/profile/SavedListingsTab';
import SettingsTab from '../../components/profile/SettingsTab';

export default function ProfilePage() {
  const router = useRouter();
  const { 
    user, 
    userData, 
    userListings, 
    savedListings, 
    listingsLoading, 
    loading, 
    logout, 
    refreshUserData,
    totalListings,    // Add this
    activeListings,   // Add this
    soldListings      // Add this
  } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  const handleEditProfile = () => {
    router.push('/onboarding');
  };

  const handleDeleteListing = async (listingId) => {
    await refreshUserData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    // Handle Firestore Timestamp
    let date;
    if (dateString?.toDate) {
      date = dateString.toDate();
    } else {
      date = new Date(dateString);
    }
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Show loading state
  if (loading || listingsLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">User data not found</p>
          <button onClick={() => router.push('/onboarding')} className="mt-4 text-sky-500">
            Complete onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Profile Header */}
      <ProfileHeader 
        userData={userData}
        totalListings={totalListings}
        activeListings={activeListings}
        soldListings={soldListings}
        onEdit={handleEditProfile}
      />
      
      {/* Contact Info Bar */}
      <ContactInfoBar userData={userData} />
      
      {/* Tabs */}
      <ProfileTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        listingsCount={userListings.length}
        savedCount={savedListings.length}
      />
      
      {/* Tab Content */}
      <div className="px-4 md:px-6 py-6">
        {activeTab === 'listings' && (
          <MyListingsTab 
            listings={userListings}
            formatPrice={formatPrice}
            formatDate={formatDate}
            onDeleteListing={handleDeleteListing}
          />
        )}
        
        {activeTab === 'saved' && (
          <SavedListingsTab 
            savedListings={savedListings}
            formatPrice={formatPrice}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab 
            userData={userData}
            onLogout={handleLogout}
            onEditProfile={handleEditProfile}
          />
        )}
      </div>
    </div>
  );
}