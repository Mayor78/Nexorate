'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ContactInfoBar from '../../components/profile/ContactInfoBar';
import ProfileTabs from '../../components/profile/ProfileTabs';
import MyListingsTab from '../../components/profile/MyListingsTab';
import SavedListingsTab from '../../components/profile/SavedListingsTab';
import SettingsTab from '../../components/profile/SettingsTab';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EditProfileModal from '../../components/profile/EditProfileModal';
import { formatPrice, formatDate } from '../../lib/formatters';

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
    totalListings,
    activeListings,
    soldListings,
  } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [activeTab, setActiveTab]       = useState('listings');
  const [showEditModal, setShowEditModal] = useState(false);

  // ── handlers (unchanged) ────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully!');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Failed to logout. Please try again.');
    }
  };

  const handleEditProfile  = () => setShowEditModal(true);
  const handleDeleteListing = async () => await refreshUserData();

  // ── loading / guard ──────────────────────────────────────────────────────
  if (loading || listingsLoading) return <LoadingSpinner message="Loading profile..." />;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F1F6FB' }}>
        <p className="text-sm" style={{ color: '#64748B' }}>User data not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#F1F6FB' }}>

      {/* Profile Header (2-col card + sidebar) */}
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
        <div className="max-w-6xl mx-auto">
          {activeTab === 'listings' && (
            <MyListingsTab
              listings={userListings}
              formatPrice={formatPrice}
              formatDate={formatDate}
              onDeleteListing={handleDeleteListing}
              onRefresh={refreshUserData}
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        userData={userData}
      />
    </div>
  );
}