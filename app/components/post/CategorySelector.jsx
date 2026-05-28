import { ChevronDown } from 'lucide-react';

const categories = ['Phones', 'Cars', 'Fashion', 'Properties', 'Electronics', 'Personals', 'Jobs', 'Services'];

export default function CategorySelector({ selectedCategory, onChange }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
        Category *
      </label>
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
          required
        >
          <option value="" className="text-slate-400">Select structural marketplace node</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}