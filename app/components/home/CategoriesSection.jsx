'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import CategoryCard from '../ui/CategoryCard';

const categoryNames = [
  { name: 'Post Ads', slug: 'post-ads', isSpecial: true },
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
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryClick = (category) => {
    // Special handling for Post Ads
    if (category.slug === 'post-ads') {
      if (user) {
        router.push('/post');
      } else {
        router.push('/auth');
      }
      return;
    }
    
    // Normal category navigation
    router.push(`/categories/${category.slug}`);
  };

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        
        const categoriesWithCounts = await Promise.all(
          categoryNames.map(async (category) => {
            // Skip count for special Post Ads category
            if (category.isSpecial) {
              return {
                name: category.name,
                slug: category.slug,
                isSpecial: true,
                count: '',
              };
            }
            
            const q = query(
              listingsRef,
              where('category', '==', category.name),
              where('status', '==', 'active')
            );
            const snapshot = await getDocs(q);
            return {
              name: category.name,
              slug: category.slug,
              isSpecial: false,
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

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6">
        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-2xl p-4 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-dark-text">Browse Categories</h2>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {categories.map((category) => (
          <div key={category.slug} onClick={() => handleCategoryClick(category)} className="cursor-pointer">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}