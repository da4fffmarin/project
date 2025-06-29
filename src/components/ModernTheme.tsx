import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Sparkles, Zap, Star } from 'lucide-react';

interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  animations: boolean;
  particles: boolean;
  glassmorphism: boolean;
}

export default function ModernTheme() {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    primaryColor: 'purple',
    accentColor: 'blue',
    animations: true,
    particles: true,
    glassmorphism: true
  });

  const [previewMode, setPreviewMode] = useState(false);

  const colorOptions = [
    { name: 'Purple', value: 'purple', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Blue', value: 'blue', gradient: 'from-blue-500 to-blue-600' },
    { name: 'Emerald', value: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
    { name: 'Pink', value: 'pink', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Orange', value: 'orange', gradient: 'from-orange-500 to-orange-600' },
    { name: 'Cyan', value: 'cyan', gradient: 'from-cyan-500 to-cyan-600' }
  ];

  const applyTheme = () => {
    const root = document.documentElement;
    
    // Применяем цветовую схему
    if (theme.mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    // Применяем основной цвет
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    
    // Сохраняем в localStorage
    localStorage.setItem('theme-config', JSON.stringify(theme));
  };

  useEffect(() => {
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('theme-config');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    if (!previewMode) {
      applyTheme();
    }
  }, [theme, previewMode]);

  const handlePreview = () => {
    setPreviewMode(true);
    applyTheme();
    setTimeout(() => setPreviewMode(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-6 shadow-2xl shadow-purple-500/25">
          <Palette className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Настройка темы</h1>
        <p className="text-xl text-slate-300">
          Персонализируйте интерфейс под свой стиль
        </p>
      </div>

      {/* Theme Mode */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Режим темы</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { mode: 'light', icon: Sun, label: 'Светлая', desc: 'Светлый интерфейс' },
            { mode: 'dark', icon: Moon, label: 'Темная', desc: 'Темный интерфейс' },
            { mode: 'auto', icon: Monitor, label: 'Авто', desc: 'Следует системе' }
          ].map(({ mode, icon: Icon, label, desc }) => (
            <button
              key={mode}
              onClick={() => setTheme({ ...theme, mode: mode as any })}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                theme.mode === mode
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                theme.mode === mode ? 'text-purple-400' : 'text-slate-400'
              }`} />
              <h3 className="text-white font-semibold">{label}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Цветовая схема</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Основной цвет</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setTheme({ ...theme, primaryColor: color.value })}
                  className={`relative p-4 rounded-xl transition-all duration-200 ${
                    theme.primaryColor === color.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-full h-12 bg-gradient-to-r ${color.gradient} rounded-lg mb-2`} />
                  <p className="text-white text-sm font-medium">{color.name}</p>
                  {theme.primaryColor === color.value && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-slate-800" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">Акцентный цвет</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setTheme({ ...theme, accentColor: color.value })}
                  className={`relative p-4 rounded-xl transition-all duration-200 ${
                    theme.accentColor === color.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-full h-12 bg-gradient-to-r ${color.gradient} rounded-lg mb-2`} />
                  <p className="text-white text-sm font-medium">{color.name}</p>
                  {theme.accentColor === color.value && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-slate-800" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Визуальные эффекты</h2>
        
        <div className="space-y-4">
          {[
            {
              key: 'animations',
              icon: Zap,
              title: 'Анимации',
              description: 'Плавные переходы и анимации интерфейса'
            },
            {
              key: 'particles',
              icon: Sparkles,
              title: 'Частицы',
              description: 'Анимированные частицы на фоне'
            },
            {
              key: 'glassmorphism',
              icon: Star,
              title: 'Стеклянный эффект',
              description: 'Полупрозрачные элементы с размытием'
            }
          ].map(({ key, icon: Icon, title, description }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-600/50 rounded-lg">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{title}</h3>
                  <p className="text-slate-400 text-sm">{description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme[key as keyof ThemeConfig] as boolean}
                  onChange={(e) => setTheme({ ...theme, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Предварительный просмотр</h2>
        
        <div className="space-y-4">
          <div className="p-6 bg-slate-700/30 rounded-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br from-${theme.primaryColor}-500 to-${theme.accentColor}-600 rounded-xl`} />
              <div>
                <h3 className="text-white font-semibold">Пример карточки</h3>
                <p className="text-slate-400">Так будут выглядеть элементы интерфейса</p>
              </div>
            </div>
            <button className={`px-6 py-3 bg-gradient-to-r from-${theme.primaryColor}-500 to-${theme.accentColor}-600 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105`}>
              Пример кнопки
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handlePreview}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
            >
              Предпросмотр (3 сек)
            </button>
            <button
              onClick={applyTheme}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Применить тему
            </button>
          </div>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Готовые темы</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Космос', primary: 'purple', accent: 'blue', mode: 'dark' },
            { name: 'Океан', primary: 'blue', accent: 'cyan', mode: 'dark' },
            { name: 'Лес', primary: 'emerald', accent: 'green', mode: 'dark' },
            { name: 'Закат', primary: 'orange', accent: 'pink', mode: 'dark' },
            { name: 'Минимализм', primary: 'slate', accent: 'gray', mode: 'light' },
            { name: 'Неон', primary: 'pink', accent: 'purple', mode: 'dark' }
          ].map((preset, index) => (
            <button
              key={index}
              onClick={() => setTheme({
                ...theme,
                primaryColor: preset.primary,
                accentColor: preset.accent,
                mode: preset.mode as any
              })}
              className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors text-left"
            >
              <div className={`w-full h-8 bg-gradient-to-r from-${preset.primary}-500 to-${preset.accent}-600 rounded-lg mb-3`} />
              <h3 className="text-white font-medium">{preset.name}</h3>
              <p className="text-slate-400 text-sm">{preset.mode === 'dark' ? 'Темная' : 'Светлая'} тема</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}