import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useDesign } from '../contexts/DesignContext';

export default function Layout() {
  const { currentTheme, themes } = useDesign();
  const theme = themes.find(t => t.id === currentTheme) || themes[0];

  const getBackgroundClass = () => {
    switch (currentTheme) {
      case 'cosmic':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
      case 'neon':
        return 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900';
      case 'minimal':
        return 'bg-gradient-to-br from-white via-gray-50 to-slate-100';
      case 'gradient':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900';
      default:
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
    }
  };

  const getBackgroundDecorations = () => {
    switch (currentTheme) {
      case 'cosmic':
        return (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-3/4 left-3/4 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/8 rounded-full blur-2xl animate-pulse delay-500" />
          </>
        );
      case 'neon':
        return (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-yellow-500/10 rounded-full blur-2xl animate-pulse delay-500" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </>
        );
      case 'minimal':
        return (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </>
        );
      case 'gradient':
        return (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-500" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-2000" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} relative overflow-hidden`}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 relative z-10">
        <Outlet />
      </main>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {getBackgroundDecorations()}
      </div>
    </div>
  );
}