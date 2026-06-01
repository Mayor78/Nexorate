'use client';

import { ShoppingBag, Heart, Settings } from 'lucide-react';

export default function ProfileTabs({ activeTab, onTabChange, listingsCount, savedCount }) {
  const tabs = [
    { id: 'listings', label: 'My Listings', count: listingsCount, icon: ShoppingBag },
    { id: 'saved', label: 'Saved Items', count: savedCount, icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 font-bold transition relative whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'text-sky-600 border-sky-600 bg-sky-50/50'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50/50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-sky-200 text-sky-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}