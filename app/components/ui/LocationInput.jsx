'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { nigeriaStates } from '../../lib/constants/nigeriaStates';

export default function LocationInput({ value, onChange, placeholder = "Select location", required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredStates = nigeriaStates.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (stateName) => {
    onChange(stateName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearLocation = () => {
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
        />
        {value && (
          <button
            type="button"
            onClick={clearLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
        {!value && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredStates.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredStates.map((state) => (
            <button
              key={state.name}
              type="button"
              onClick={() => handleSelect(state.name)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center justify-between"
            >
              <div>
                <span className="text-slate-700 font-medium">{state.name}</span>
                <span className="text-xs text-slate-400 ml-2">({state.capital})</span>
              </div>
              <span className="text-xs text-slate-400">{state.region}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && searchTerm && filteredStates.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-slate-500">No location found</p>
          <p className="text-xs text-slate-400 mt-1">Try typing a state or city name</p>
        </div>
      )}
    </div>
  );
}