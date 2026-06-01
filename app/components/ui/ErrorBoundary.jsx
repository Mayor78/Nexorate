'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            
            <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2.5 px-4 rounded-lg transition"
              >
                Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-3 bg-slate-50 rounded-lg text-left">
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error?.stack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Ensure React is imported for class component
import React from 'react';
