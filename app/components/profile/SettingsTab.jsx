'use client';

import { useState } from 'react';
import { LogOut, Lock, User, ArrowRight, Bell, Key, Building2, Phone, MapPin } from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';

export default function SettingsTab({ userData, onLogout, onEditProfile }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut]       = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">

      {/* Account Security */}
      <SettingsCard icon={Lock} title="Account Security" iconColor="#0EA5E9">
        <SettingsRow
          label="Email Notifications"
          description="Get updates about your listings and messages"
          action={<PillButton label="Enable" />}
        />
        <SettingsRow
          label="Change Password"
          description="Update your account password"
          action={<PillButton label="Update" />}
          border
        />
      </SettingsCard>

      {/* Profile Information */}
      <SettingsCard icon={User} title="Profile Information" iconColor="#0EA5E9">
        <InfoRow label="Full Name"     value={userData?.displayName} />
        <InfoRow label="Account Type"  value={<span className="capitalize">{userData?.userType || 'Individual'}</span>} border />
        {userData?.userType === 'business' && userData?.businessName && (
          <InfoRow label="Business Name" value={userData.businessName} border />
        )}
        <InfoRow label="Phone"    value={userData?.phone    || 'Not set'} border />
        <InfoRow label="Location" value={userData?.location || 'Not set'} border />
        <InfoRow label="Email"    value={userData?.email}                 border />

        <div className="pt-4">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: '#F0F9FF', color: '#0369A1' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E0F2FE')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F0F9FF')}
          >
            Edit Profile <ArrowRight size={14} />
          </button>
        </div>
      </SettingsCard>

      {/* Danger Zone */}
      <div
        className="rounded-2xl border p-5 flex items-center justify-between gap-4"
        style={{ backgroundColor: '#FFF5F5', borderColor: '#FECACA' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FEE2E2' }}
          >
            <LogOut size={16} style={{ color: '#DC2626' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#991B1B' }}>Logout</p>
            <p className="text-xs" style={{ color: '#EF4444' }}>Sign out from your account</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          disabled={isLoggingOut}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
          style={{ backgroundColor: '#DC2626' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B91C1C')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#DC2626')}
        >
          {isLoggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>

      {/* Logout Confirmation Modal — logic unchanged */}
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

// ─── local sub-components ────────────────────────────────────────────────────

function SettingsCard({ icon: Icon, title, iconColor, children }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-sm"
      style={{ backgroundColor: '#fff', borderColor: '#E8EDF2' }}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: '#F1F5F9' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#F0F9FF' }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </div>
        <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function SettingsRow({ label, description, action, border }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 ${border ? 'border-t' : ''}`}
      style={border ? { borderColor: '#F1F5F9' } : {}}
    >
      <div>
        <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function InfoRow({ label, value, border }) {
  return (
    <div
      className={`py-3 ${border ? 'border-t' : ''}`}
      style={border ? { borderColor: '#F1F5F9' } : {}}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#CBD5E1' }}>
        {label}
      </p>
      <p className="text-sm font-semibold" style={{ color: '#334155' }}>{value}</p>
    </div>
  );
}

function PillButton({ label }) {
  return (
    <button
      className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
      style={{ backgroundColor: '#F0F9FF', color: '#0369A1' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E0F2FE')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F0F9FF')}
    >
      {label}
    </button>
  );
}