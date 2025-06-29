import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type DesignTheme = 'cosmic' | 'neon' | 'minimal' | 'gradient';

interface DesignContextType {
  currentTheme: DesignTheme;
  setTheme: (theme: DesignTheme) => void;
  themes: {
    id: DesignTheme;
    name: string;
    description: string;
    preview: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
  }[];
}

const themes = [
  {
    id: 'cosmic' as DesignTheme,
    name: 'Cosmic Dark',
    description: 'Deep space theme with purple and blue gradients',
    preview: '🌌',
    colors: {
      primary: 'from-purple-500 to-blue-600',
      secondary: 'from-blue-500 to-cyan-600',
      accent: 'from-emerald-500 to-teal-600',
      background: 'from-slate-900 via-slate-800 to-slate-900'
    }
  },
  {
    id: 'neon' as DesignTheme,
    name: 'Neon Cyber',
    description: 'Cyberpunk-inspired with electric colors',
    preview: '⚡',
    colors: {
      primary: 'from-pink-500 to-violet-600',
      secondary: 'from-cyan-400 to-blue-500',
      accent: 'from-yellow-400 to-orange-500',
      background: 'from-gray-900 via-purple-900 to-violet-900'
    }
  },
  {
    id: 'minimal' as DesignTheme,
    name: 'Minimal Clean',
    description: 'Clean and professional with subtle accents',
    preview: '✨',
    colors: {
      primary: 'from-slate-600 to-slate-700',
      secondary: 'from-blue-600 to-indigo-700',
      accent: 'from-emerald-600 to-green-700',
      background: 'from-white via-gray-50 to-slate-100'
    }
  },
  {
    id: 'gradient' as DesignTheme,
    name: 'Rainbow Gradient',
    description: 'Vibrant multi-color gradients',
    preview: '🌈',
    colors: {
      primary: 'from-red-500 via-purple-500 to-blue-500',
      secondary: 'from-green-400 via-blue-500 to-purple-600',
      accent: 'from-yellow-400 via-red-500 to-pink-500',
      background: 'from-indigo-900 via-purple-900 to-pink-900'
    }
  }
];

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export function DesignProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useLocalStorage<DesignTheme>('design_theme', 'cosmic');

  const setTheme = (theme: DesignTheme) => {
    setCurrentTheme(theme);
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Apply theme on mount
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <DesignContext.Provider value={{
      currentTheme,
      setTheme,
      themes
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}