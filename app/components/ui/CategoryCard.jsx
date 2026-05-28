import Link from 'next/link';

export default function CategoryCard({ category }) {
  const getIconEmoji = (name) => {
    const icons = {
      Phones: '📱',
      Cars: '🚗',
      Fashion: '👗',
      Properties: '🏠',
      Electronics: '💻',
      Personals: '💕',
      Jobs: '💼',
      Services: '🔧',
    };
    return icons[name] || '📦';
  };

  const getColorClass = (name) => {
    const colors = {
      Phones: 'bg-blue-100',
      Cars: 'bg-green-100',
      Fashion: 'bg-pink-100',
      Properties: 'bg-purple-100',
      Electronics: 'bg-cyan-100',
      Personals: 'bg-red-100',
      Jobs: 'bg-orange-100',
      Services: 'bg-gray-100',
    };
    return colors[name] || 'bg-gray-100';
  };

  return (
    <Link href={`/categories/${category.name.toLowerCase()}`}>
      <div className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-all group">
        <div className={`${getColorClass(category.name)} w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform`}>
          {getIconEmoji(category.name)}
        </div>
        <h3 className="font-semibold text-dark-text text-sm">{category.name}</h3>
        <p className="text-xs text-dark-muted">{category.count} listings</p>
      </div>
    </Link>
  );
}