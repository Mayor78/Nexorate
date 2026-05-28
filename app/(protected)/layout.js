'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // No user -> go to auth
      if (!user) {
        router.push('/auth');
      } 
      // User exists but hasn't completed onboarding -> go to onboarding
      else if (userData && !userData.onboardingCompleted) {
        router.push('/onboarding');
      }
    }
  }, [user, userData, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user || (userData && !userData.onboardingCompleted)) {
    return null;
  }

  // User is authenticated and onboarded, render the page
  return <>{children}</>;
}