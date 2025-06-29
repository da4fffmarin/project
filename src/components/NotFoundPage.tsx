import React from 'react';
import { Link } from 'react-router-dom';
import { useDesign } from '../contexts/DesignContext';
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const { currentTheme, themes } = useDesign();
  const theme = themes.find(t => t.id === currentTheme) || themes[0];

  const getTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-900' : 'text-white';
  };

  const getSecondaryTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-400';
  };

  const getButtonClass = () => {
    switch (currentTheme) {
      case 'cosmic':
        return "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/25";
      case 'neon':
        return "bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 shadow-lg shadow-pink-500/25";
      case 'minimal':
        return "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25";
      case 'gradient':
        return "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 hover:from-red-600 hover:via-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25";
      default:
        return "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/25";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className={`text-8xl sm:text-9xl font-bold bg-gradient-to-r ${theme.colors.primary} bg-clip-text text-transparent animate-pulse`}>
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className={`w-16 h-16 ${currentTheme === 'minimal' ? 'text-blue-500' : 'text-purple-400'} animate-spin`} />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold ${getTextColor()} mb-4`}>
            Page Not Found
          </h1>
          <p className={`text-lg sm:text-xl ${getSecondaryTextColor()} mb-6`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className={`${getSecondaryTextColor()}`}>
            Don't worry, you can find your way back to discovering amazing crypto airdrops!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/airdrops"
            className={`px-8 py-4 ${getButtonClass()} text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:scale-105`}
          >
            <Home className="w-5 h-5" />
            <span>Back to Airdrops</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className={`px-8 py-4 ${currentTheme === 'minimal' ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-700 hover:bg-slate-600 text-white'} rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <h3 className={`text-lg font-semibold ${getTextColor()} mb-4`}>Popular Pages</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { path: '/airdrops', label: 'Airdrops' },
              { path: '/rewards', label: 'Rewards' },
              { path: '/leaderboard', label: 'Leaderboard' },
              { path: '/faq', label: 'FAQ' }
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 ${currentTheme === 'minimal' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white'} rounded-lg transition-colors text-sm`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r ${theme.colors.primary} opacity-10 rounded-full blur-3xl animate-pulse`} />
          <div className={`absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r ${theme.colors.secondary} opacity-10 rounded-full blur-2xl animate-pulse delay-1000`} />
        </div>
      </div>
    </div>
  );
}