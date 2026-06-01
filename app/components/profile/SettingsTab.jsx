'use client';

import { useState } from 'react';
import { LogOut, Lock, User, Building2, MapPin, Phone, ArrowRight } from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';

export default function SettingsTab({ userData, onLogout, onEditProfile }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Account Security Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={20} className="text-sky-600" />
          <h3 className="font-bold text-slate-900">Account Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 px-3 hover:bg-slate-50 rounded-lg transition">
            <div>
              <p className="text-sm font-medium text-slate-700">Email Notifications</p>
              <p className="text-xs text-slate-500">Get updates about your listings</p>
            </div>
            <button className="text-sky-600 font-semibold text-sm hover:text-sky-700 transition">Enable</button>
          </div>
          <div className="flex items-center justify-between py-3 px-3 hover:bg-slate-50 rounded-lg transition border-t border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-700">Change Password</p>
              <p className="text-xs text-slate-500">Update your account password</p>
            </div>
            <button className="text-sky-600 font-semibold text-sm hover:text-sky-700 transition">Update</button>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <User size={20} className="text-sky-600" />
          <h3 className="font-bold text-slate-900">Profile Information</h3>
        </div>
        <div className="space-y-3">
          <div className="py-3 px-3 hover:bg-slate-50 rounded-lg transition">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Full Name</p>
            <p className="text-slate-900 font-medium">{userData.displayName}</p>
          </div>
          <div className="py-3 px-3 hover:bg-slate-50 rounded-lg transition border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Account Type</p>
            <p className="text-slate-900 font-medium capitalize">{userData.userType}</p>
          </div>
          {userData.userType === 'business' && userData.businessName && (
            <div className="py-3 px-3 hover:bg-slate-50 rounded-lg transition border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Business Name</p>
              <p className="text-slate-900 font-medium">{userData.businessName}</p>
            </div>
          )}
          <div className="py-3 px-3 hover:bg-slate-50 rounded-lg transition border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Phone</p>
            <p className="text-slate-900 font-medium">{userData.phone || 'Not set'}</p>
          </div>
          <div className="py-3 px-3 hover:bg-slate-50 rounded-lg transition border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Location</p>
            <p className="text-slate-900 font-medium">{userData.location || 'Not set'}</p>
          </div>
          <button 
            onClick={onEditProfile}
            className="w-full mt-4 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            Edit Profile <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Danger Zone - Logout */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogOut size={20} className="text-red-600" />
            <div>
              <p className="font-bold text-red-900">Logout</p>
              <p className="text-xs text-red-700">Sign out from your account</p>
            </div>
          </div>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout? You'll need to login again to access your account."
        confirmText="Logout"
        loading={isLoggingOut}
      />
    </div>
  );
}