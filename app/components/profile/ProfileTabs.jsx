'use client';

import { ShoppingBag, Heart, Settings } from 'lucide-react';

export default function ProfileTabs({ activeTab, onTabChange, listingsCount, savedCount }) {
  const tabs = [
    { id: 'listings', label: 'My Listings', count: listingsCount, icon: ShoppingBag },
    { id: 'saved',    label: 'Saved Items', count: savedCount,    icon: Heart },
    { id: 'settings', label: 'Settings',                           icon: Settings },
  ];

  return (
    <div
      className="sticky top-0 z-10 border-b"
      style={{ backgroundColor: '#fff', borderColor: '#E8EDF2' }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors whitespace-nowrap"
                style={{ color: isActive ? '#0EA5E9' : '#64748B' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#0F172A'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#64748B'; }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>

                {tab.count !== undefined && (
                  <span
                    className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? '#E0F2FE' : '#F1F5F9',
                      color: isActive ? '#0369A1' : '#64748B',
                    }}
                  >
                    {tab.count}
                  </span>
                )}

                {/* Active underline */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#0EA5E9' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}