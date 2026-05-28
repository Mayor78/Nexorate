'use client';

import { Phone, Mail } from 'lucide-react';

export default function ContactInfoBar({ userData }) {
  return (
    <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
      {userData.phone && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone size={14} />
          <span>{userData.phone}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Mail size={14} />
        <span>{userData.email}</span>
      </div>
    </div>
  );
}