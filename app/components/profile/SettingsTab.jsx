'use client';

import { LogOut } from 'lucide-react';

export default function SettingsTab({ userData, onLogout, onEditProfile }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold text-slate-800 mb-3">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Email Notifications</span>
            <button className="text-sky-600 text-sm">Enable</button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Change Password</span>
            <button className="text-sky-600 text-sm">Update</button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-red-500">Logout</span>
            <button onClick={onLogout}>
              <LogOut size={18} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Profile Info Card */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold text-slate-800 mb-3">Profile Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Name:</span>
            <span className="text-slate-800">{userData.displayName}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Account Type:</span>
            <span className="text-slate-800 capitalize">{userData.userType}</span>
          </div>
          {userData.userType === 'business' && userData.businessName && (
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Business Name:</span>
              <span className="text-slate-800">{userData.businessName}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Phone:</span>
            <span className="text-slate-800">{userData.phone || 'Not set'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Location:</span>
            <span className="text-slate-800">{userData.location || 'Not set'}</span>
          </div>
        </div>
        <button 
          onClick={onEditProfile}
          className="mt-4 text-sky-600 text-sm hover:underline"
        >
          Edit Profile →
        </button>
      </div>
    </div>
  );
}