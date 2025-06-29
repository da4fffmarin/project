import React from 'react';
import { useDesign } from '../contexts/DesignContext';
import { Palette, Check, Sparkles, Zap, Minimize, Rainbow } from 'lucide-react';

export default function DesignSelector() {
  const { currentTheme, setTheme, themes } = useDesign();

  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'cosmic': return <Sparkles className="w-6 h-6" />;
      case 'neon': return <Zap className="w-6 h-6" />;
      case 'minimal': return <Minimize className="w-6 h-6" />;
      case 'gradient': return <Rainbow className="w-6 h-6" />;
      default: return <Palette className="w-6 h-6" />;
    }
  };

  const getPreviewGradient = (theme: any) => {
    return `bg-gradient-to-r ${theme.colors.primary}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-purple-500/25">
          <Palette className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Design Themes</h1>
        <p className="text-lg sm:text-xl text-slate-300">Choose your preferred visual style</p>
      </div>

      {/* Current Theme Info */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`p-3 rounded-xl ${getPreviewGradient(themes.find(t => t.id === currentTheme))}`}>
            {getThemeIcon(currentTheme)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Current Theme: {themes.find(t => t.id === currentTheme)?.name}
            </h3>
            <p className="text-slate-400">
              {themes.find(t => t.id === currentTheme)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`group relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-500 cursor-pointer hover:scale-[1.02] ${
              currentTheme === theme.id
                ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20'
                : 'border-slate-700/50 hover:border-slate-600/50'
            }`}
            onClick={() => setTheme(theme.id)}
          >
            {/* Selection Indicator */}
            {currentTheme === theme.id && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Theme Preview */}
            <div className="mb-6">
              <div className={`w-full h-32 rounded-xl ${theme.colors.background} relative overflow-hidden mb-4`}>
                {/* Preview Elements */}
                <div className="absolute inset-4">
                  <div className={`w-full h-6 bg-gradient-to-r ${theme.colors.primary} rounded mb-2 opacity-90`} />
                  <div className="flex space-x-2 mb-2">
                    <div className={`w-16 h-4 bg-gradient-to-r ${theme.colors.secondary} rounded opacity-80`} />
                    <div className={`w-12 h-4 bg-gradient-to-r ${theme.colors.accent} rounded opacity-70`} />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className={`h-8 bg-gradient-to-r ${theme.colors.primary} rounded opacity-60`} />
                    <div className={`h-8 bg-gradient-to-r ${theme.colors.secondary} rounded opacity-60`} />
                    <div className={`h-8 bg-gradient-to-r ${theme.colors.accent} rounded opacity-60`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${getPreviewGradient(theme)} flex-shrink-0`}>
                <span className="text-2xl">{theme.preview}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{theme.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{theme.description}</p>
                
                {/* Color Palette */}
                <div className="flex space-x-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.colors.primary}`} title="Primary" />
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.colors.secondary}`} title="Secondary" />
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.colors.accent}`} title="Accent" />
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Theme Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Dynamic Themes</h3>
          <p className="text-slate-400 text-sm">Instantly switch between different visual styles</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Performance</h3>
          <p className="text-slate-400 text-sm">Optimized for smooth animations and transitions</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
          <Palette className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Customization</h3>
          <p className="text-slate-400 text-sm">Personalize your experience with unique designs</p>
        </div>
      </div>
    </div>
  );
}