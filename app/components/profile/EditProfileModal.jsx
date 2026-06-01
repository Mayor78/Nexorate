'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export default function EditProfileModal({ isOpen, onClose, user, userData }) {
  const { refreshUserData } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Populate form when userData changes or modal opens
  useEffect(() => {
    if (isOpen && userData) {
      setDisplayName(userData.displayName || '');
      setPhone(userData.phone || '');
      setLocation(userData.location || '');
      setBusinessName(userData.businessName || '');
      setBio(userData.bio || '');
      setError('');
    }
  }, [isOpen, userData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    // Use user.uid from Firebase Auth (not userData.uid)
    if (!user) {
      setError('You must be logged in to update your profile');
      return;
    }

    if (!user.uid) {
      setError('User ID not found. Please log out and log back in.');
      return;
    }

    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        phone: phone.trim(),
        location: location.trim(),
        businessName: businessName.trim(),
        bio: bio.trim(),
        updatedAt: new Date().toISOString(),
      });

      await refreshUserData();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your city, state"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition"
            />
          </div>

          {/* Business Name (if applicable) */}
          {userData?.userType === 'business' && (
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition"
              />
            </div>
          )}

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}