'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAuthHandler } from '../../hooks/useAuthHandler';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, UserPlus, 
  User, AlertCircle
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { error: showError } = useToast();
  const { isIOS, loading, handleSignup, handleLogin, handleGoogleSignin, handleGoogleRedirectResult } = useAuthHandler();
  
  // Form state
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleInfo, setShowGoogleInfo] = useState(false);
  const [iosDetected, setIosDetected] = useState(false);

  // If already logged in, redirect to onboarding
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/onboarding');
    }
  }, [user, authLoading, router]);

  // Check for iOS on mount
  useEffect(() => {
    setIosDetected(isIOS());
  }, [isIOS]);

  // Check for Google redirect result on mount
  useEffect(() => {
    handleGoogleRedirectResult();
  }, [handleGoogleRedirectResult]);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setDisplayName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleTabSwitch = (isLogin) => {
    setIsLoginForm(isLogin);
    resetForm();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginForm) {
      // Signup validation
      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
      }
      if (displayName.trim().length < 2) {
        showError('Please enter your full name');
        return;
      }

      const result = await handleSignup(email, password, displayName);
      if (result.success) {
        setTimeout(() => router.push('/onboarding'), 1500);
      }
    } else {
      // Login
      const result = await handleLogin(email, password);
      if (result.success) {
        setTimeout(() => router.push('/onboarding'), 500);
      }
    }
  };

  const handleGoogleClick = async () => {
    if (iosDetected) {
      // ✅ FIXED: Show info modal on iOS instead of redirect
      setShowGoogleInfo(true);
    } else {
      const result = await handleGoogleSignin();
      if (result.success) {
        setTimeout(() => router.push('/onboarding'), 500);
      }
    }
  };

  const handleGoogleInfoContinue = async () => {
    setShowGoogleInfo(false);
    const result = await handleGoogleSignin();
    if (result.success) {
      setTimeout(() => router.push('/onboarding'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl mb-3 text-xl font-black text-sky-400">
            N
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Nexorate
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
            Premium Marketplace
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => handleTabSwitch(true)}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-widest transition-all relative ${
                isLoginForm ? 'text-sky-600 bg-white' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Login
              {isLoginForm && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch(false)}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-widest transition-all relative ${
                !isLoginForm ? 'text-sky-600 bg-white' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign Up
              {!isLoginForm && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            
            {iosDetected && !isLoginForm && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-blue-700 text-xs font-semibold">iOS detected: Google sign-in will use Safari.</p>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              
              {/* Full Name (Signup only) */}
              {!isLoginForm && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required={!isLoginForm}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {!isLoginForm && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLoginForm}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isLoginForm ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLoginForm ? <LogIn size={16} /> : <UserPlus size={16} />}
                    {isLoginForm ? 'Login' : 'Sign Up'}
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleClick}
              disabled={loading}
              className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            {/* Sign Up Link (Login) or Login Link (Signup) */}
            <p className="text-center text-xs text-slate-500 mt-6">
              {isLoginForm ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => handleTabSwitch(!isLoginForm)}
                className="text-sky-600 font-bold hover:underline"
              >
                {isLoginForm ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>

        {/* iOS Google Info Modal */}
        {showGoogleInfo && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full sm:rounded-2xl">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Continue with Google</h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                You&apos;ll be redirected to Safari to complete your Google sign-in. This is normal on iOS. After signing in, you&apos;ll return to the app automatically.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleGoogleInfoContinue}
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Continue to Google'}
                </button>
                <button
                  onClick={() => setShowGoogleInfo(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-2.5 rounded-xl font-bold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}