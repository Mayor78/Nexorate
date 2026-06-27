'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ListingDataContext = createContext(null);

export function useServerListing() {
  return useContext(ListingDataContext);
}

export function ListingDataProvider({ children }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const el = document.getElementById('__LISTING_DATA__');
    if (el && el.textContent) {
      try {
        setData(JSON.parse(el.textContent));
      } catch {}
    }
  }, []);

  return (
    <ListingDataContext.Provider value={data}>
      {children}
    </ListingDataContext.Provider>
  );
}
