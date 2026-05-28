import { ChevronDown } from 'lucide-react';

const categoryFields = {
  Phones: [
    { name: 'brand', label: 'Brand', type: 'select', options: ['Apple', 'Samsung', 'Google', 'Tecno', 'Infinix', 'Other'] },
    { name: 'storage', label: 'Storage', type: 'select', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
    { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Used', 'For Parts'] },
  ],
  Cars: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., Toyota, Honda' },
    { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g., Camry, Civic' },
    { name: 'year', label: 'Year', type: 'number', placeholder: 'e.g., 2020' },
    { name: 'mileage', label: 'Mileage (km)', type: 'number', placeholder: 'e.g., 50000' },
    { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  ],
  Properties: [
    { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Apartment', 'House', 'Land', 'Commercial', 'Office'] },
    { name: 'bedrooms', label: 'Bedrooms', type: 'number', placeholder: 'e.g., 3' },
    { name: 'bathrooms', label: 'Bathrooms', type: 'number', placeholder: 'e.g., 2' },
    { name: 'size', label: 'Size (sqm)', type: 'number', placeholder: 'e.g., 150' },
  ],
  Personals: [
    { name: 'gender', label: 'Your Gender', type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
    { name: 'lookingFor', label: 'Looking for', type: 'select', options: ['Male', 'Female', 'Friendship', 'Relationship', 'Marriage'] },
    { name: 'age', label: 'Age', type: 'number', placeholder: 'e.g., 25' },
  ],
};

export default function DynamicFieldsForm({ selectedCategory, customFields, onFieldChange }) {
  if (!selectedCategory || !categoryFields[selectedCategory]) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 animate-fadeIn">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">
        {selectedCategory} Specifications
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categoryFields[selectedCategory].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <div className="relative">
                <select
                  value={customFields[field.name] || ''}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150 appearance-none"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={customFields[field.name] || ''}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}