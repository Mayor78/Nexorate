'use client';

export default function ProfileTabs({ activeTab, onTabChange, listingsCount, savedCount }) {
  const tabs = [
    { id: 'listings', label: 'My Listings', count: listingsCount },
    { id: 'saved', label: 'Saved', count: savedCount },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="bg-white border-b border-slate-100 px-4 md:px-6">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 font-medium transition relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 text-xs">({tab.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}