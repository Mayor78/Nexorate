'use client';

import { X, MessageCircle, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPrompt({ isOpen, onClose, action = "send a message", productName = "" }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    router.push('/auth');
    onClose();
  };

  const handleSignup = () => {
    router.push('/auth');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-slideUp">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-5">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <MessageCircle size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Login Required</h2>
            <p className="text-white/80 text-sm mt-1">
              To {action}{productName ? ` about "${productName}"` : ''}
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-600 text-sm">
              You need to be logged in to {action}. 
              It only takes a minute and helps us keep the community safe and authentic.
            </p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Message sellers directly</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Save your favorite listings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Post your own items for sale</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <LogIn size={18} />
              Log In to Continue
              <ArrowRight size={16} />
            </button>
            
            <button
              onClick={handleSignup}
              className="w-full border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Create New Account
            </button>
          </div>
          
          {/* Guest note */}
          <p className="text-center text-xs text-slate-400 mt-4">
            You can still browse listings without logging in
          </p>
        </div>
      </div>
    </div>
  );
}