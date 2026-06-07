'use client';
import HeroSection from './components/home/HeroSection';
import Recommendation from './components/home/Recommendations';
import CategoriesSection from './components/home/CategoriesSection';
import BoostedListings from './components/home/BoostedListings';
import FeaturedListings from './components/home/FeaturedListings';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function HomePage() {
    const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && userData && !userData.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, userData, loading, router]);
  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <HeroSection />
       <Recommendation />
      <CategoriesSection />
      <BoostedListings />
      
      
      <FeaturedListings />
    </div>
  );
}