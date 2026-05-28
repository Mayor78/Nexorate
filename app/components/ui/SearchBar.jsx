'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { nigeriaStates } from '../../lib/constants/nigeriaStates';

export default function SearchBar({ 
  onSearch, 
  initialQuery = '', 
  initialLocation = '',
  className = '',
  placeholder = 'What are you looking for?'
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const locationInputRef = useRef(null);

  // Filter location suggestions
  useEffect(() => {
    if (location.length > 0) {
      const filtered = nigeriaStates.filter(state =>
        state.name.toLowerCase().includes(location.toLowerCase()) ||
        state.capital.toLowerCase().includes(location.toLowerCase())
      );
      setLocationSuggestions(filtered.slice(0, 5));
    } else {
      setLocationSuggestions([]);
    }
  }, [location]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ searchQuery, location });
    }
  };

  const handleLocationSelect = (stateName) => {
    setLocation(stateName);
    setShowLocationSuggestions(false);
  };

  const clearLocation = () => {
    setLocation('');
    setLocationSuggestions([]);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`w-full bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm flex flex-col sm:flex-row items-stretch gap-1 ${className}`}
    >
      {/* Main Query Field */}
      <div className="flex-1 flex items-center gap-2.5 px-3 min-w-0 border-b sm:border-b-0 sm:border-r border-slate-200 pb-1.5 sm:pb-0">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        {searchQuery && (
          <button type="button" onClick={clearSearch} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Location Field with Suggestions */}
      <div className="flex-[0.8] relative" ref={locationInputRef}>
        <div className="flex items-center gap-2.5 px-3 min-w-0 pb-1.5 sm:pb-0">
          <MapPin className="text-slate-400 shrink-0" size={18} />
          <input
            type="text"
            placeholder="Location (State or City)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowLocationSuggestions(true)}
            className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          {location && (
            <button type="button" onClick={clearLocation} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Location Suggestions Dropdown */}
        {showLocationSuggestions && locationSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {locationSuggestions.map((state) => (
              <button
                key={state.name}
                type="button"
                onClick={() => handleLocationSelect(state.name)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center justify-between group"
              >
                <span className="text-slate-700">{state.name}</span>
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition">
                  {state.region}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button 
        type="submit"
        className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition duration-150 shrink-0"
      >
        Search
      </button>
    </form>
  );
}