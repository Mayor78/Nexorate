'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import CategoryCard from '../ui/CategoryCard';

const categoryNames = [
  { name: 'Phones', slug: 'phones' },
  { name: 'Cars', slug: 'cars' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Properties', slug: 'properties' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Personals', slug: 'personals' },
  { name: 'Jobs', slug: 'jobs' },
  { name: 'Services', slug: 'services' },
  { name: 'Repair & Construction', slug: 'repair-construction' },
  { name: 'Animal & Pet', slug: 'animal-pet' },
  { name: 'Food & Agric', slug: 'food-agric' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Trending', slug: 'trending' },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState(categoryNames.map(c => ({ ...c, count: '0' })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        
        const categoriesWithCounts = await Promise.all(
          categoryNames.map(async (category) => {
            const q = query(
              listingsRef,
              where('category', '==', category.name),
              where('status', '==', 'active')
            );
            const snapshot = await getDocs(q);
            return {
              ...category,
              count: snapshot.size.toLocaleString(),
            };
          })
        );
        
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-dark-text">Browse Categories</h2>
      
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}