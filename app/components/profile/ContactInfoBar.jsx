'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactInfoBar({ userData }) {
  const items = [
    userData?.email    && { icon: Mail,   value: userData.email },
    userData?.phone    && { icon: Phone,  value: userData.phone },
    userData?.location && { icon: MapPin, value: userData.location },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div
      className="border-b px-4 md:px-6 py-2.5"
      style={{ backgroundColor: '#F8FBFE', borderColor: '#E8EDF2' }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
        {items.map(({ icon: Icon, value }) => (
          <div key={value} className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
            <Icon size={13} style={{ color: '#0EA5E9' }} />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}