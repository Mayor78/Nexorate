import Link from 'next/link';

export default function CategoryCard({ category }) {
  const getIconEmoji = (slug) => {
    const icons = {
      phones: '📱',
      cars: '🚗',
      fashion: '👗',
      properties: '🏠',
      electronics: '💻',
      personals: '💕',
      jobs: '💼',
      services: '🔧',
      'repair-construction': '🔨',
      'animal-pet': '🐕',
      'food-agric': '🌽',
      beauty: '💄',
      trending: '🔥',
    };
    return icons[slug] || '📦';
  };

  const getColorClass = (slug) => {
    const colors = {
      phones: 'bg-blue-100',
      cars: 'bg-green-100',
      fashion: 'bg-pink-100',
      properties: 'bg-purple-100',
      electronics: 'bg-cyan-100',
      personals: 'bg-red-100',
      jobs: 'bg-orange-100',
      services: 'bg-gray-100',
      'repair-construction': 'bg-amber-100',
      'animal-pet': 'bg-emerald-100',
      'food-agric': 'bg-lime-100',
      beauty: 'bg-rose-100',
      trending: 'bg-orange-100',
    };
    return colors[slug] || 'bg-gray-100';
  };

  const displayName = (name) => {
    const displayNames = {
      'repair-construction': 'Repair & Construction',
      'animal-pet': 'Animal & Pet',
      'food-agric': 'Food & Agric',
      beauty: 'Beauty',
      trending: 'Trending',
      phones: 'Phones',
      cars: 'Cars',
      fashion: 'Fashion',
      properties: 'Properties',
      electronics: 'Electronics',
      personals: 'Personals',
      jobs: 'Jobs',
      services: 'Services',
    };
    return displayNames[category.slug] || category.name;
  };

  return (
    <Link href={`/categories/${category.name.toLowerCase()}`}>
      <div className="bg-gray-100 rounded-md p-4 text-center hover:shadow-md transition-all group">
        <div className={`${(category.name)} w-12 h-12 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 group-hover:scale-110 transition-transform`}>
          {getIconEmoji(category.slug)}
        </div>
      
        {/* <p className="text-xs text-dark-muted">{category.count} listings</p> */}
      </div>
        <h3 className="font-semibold flex justify-center text-dark-text text-sm">{displayName(category.name)}</h3>
    </Link>
  );
}