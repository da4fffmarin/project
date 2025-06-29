import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DatabaseStatus from './DatabaseStatus';
import ServerDatabaseStatus from './ServerDatabaseStatus';
import { 
  Settings, 
  DollarSign, 
  Save, 
  RotateCcw,
  Palette,
  Globe,
  Bell,
  Shield,
  Database,
  Zap,
  Server,
  Smartphone,
  Download
} from 'lucide-react';

interface AppSettings {
  pointsToUSDCRate: number;
  minWithdrawal: number;
  theme: 'dark' | 'light';
  language: 'en' | 'ru';
  notifications: boolean;
  autoBackup: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  telegramNotifications: boolean;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useLocalStorage<AppSettings>('app_settings', {
    pointsToUSDCRate: 100,
    minWithdrawal: 100,
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoBackup: true,
    pushNotifications: true,
    emailNotifications: false,
    telegramNotifications: false
  });

  const [tempSettings, setTempSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'database' | 'advanced'>('general');

  const handleChange = (key: keyof AppSettings, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setSettings(tempSettings);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    const defaultSettings: AppSettings = {
      pointsToUSDCRate: 100,
      minWithdrawal: 100,
      theme: 'dark',
      language: 'en',
      notifications: true,
      autoBackup: true,
      pushNotifications: true,
      emailNotifications: false,
      telegramNotifications: false
    };
    setTempSettings(defaultSettings);
    setHasChanges(true);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(tempSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'airdrop-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'general', label: 'Общие', icon: Settings },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'database', label: 'База данных', icon: Database },
    { id: 'advanced', label: 'Дополнительно', icon: Zap }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-purple-500/25">
          <Settings className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Настройки</h1>
        <p className="text-lg sm:text-xl text-slate-300">Настройте платформу под свои потребности</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6 sm:space-y-8">
        {/* General Settings */}
        {activeTab === 'general' && (
          <>
            {/* Exchange Rate Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                  <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Курс обмена</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Поинты за 1 USDC
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tempSettings.pointsToUSDCRate}
                      onChange={(e) => handleChange('pointsToUSDCRate', parseInt(e.target.value))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      min="1"
                      step="1"
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                      поинтов = 1 USDC
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Текущий курс: {tempSettings.pointsToUSDCRate} поинтов = $1 USDC
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Минимальный вывод (поинты)
                  </label>
                  <input
                    type="number"
                    value={tempSettings.minWithdrawal}
                    onChange={(e) => handleChange('minWithdrawal', parseInt(e.target.value))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    min="1"
                    step="1"
                  />
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Минимум: ${(tempSettings.minWithdrawal / tempSettings.pointsToUSDCRate).toFixed(2)} USDC
                  </p>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <Palette className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Внешний вид</h2>
                </div>
                <button
                  onClick={() => navigate('/theme')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-sm"
                >
                  Настроить тему
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Тема
                  </label>
                  <select
                    value={tempSettings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="dark">Темная тема</option>
                    <option value="light">Светлая тема</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Язык
                  </label>
                  <select
                    value={tempSettings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Уведомления</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  key: 'notifications',
                  icon: Bell,
                  title: 'Основные уведомления',
                  description: 'Получать уведомления о новых аирдропах и обновлениях'
                },
                {
                  key: 'pushNotifications',
                  icon: Smartphone,
                  title: 'Push-уведомления',
                  description: 'Мгновенные уведомления в браузере'
                },
                {
                  key: 'emailNotifications',
                  icon: Globe,
                  title: 'Email уведомления',
                  description: 'Получать важные обновления на email'
                },
                {
                  key: 'telegramNotifications',
                  icon: Bell,
                  title: 'Telegram уведомления',
                  description: 'Уведомления через Telegram бота'
                }
              ].map(({ key, icon: Icon, title, description }) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium">{title}</h3>
                      <p className="text-slate-400 text-sm">{description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempSettings[key as keyof AppSettings] as boolean}
                      onChange={(e) => handleChange(key as keyof AppSettings, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database Settings */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DatabaseStatus />
              <ServerDatabaseStatus />
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Безопасность данных</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="text-white font-medium">Автоматическое резервное копирование</h3>
                      <p className="text-slate-400 text-sm">Автоматически создавать резервные копии данных</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempSettings.autoBackup}
                      onChange={(e) => handleChange('autoBackup', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl">
                  <Zap className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Дополнительные настройки</h3>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={exportSettings}
                  className="w-full p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors text-left flex items-center space-x-3"
                >
                  <Download className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-white font-medium">Экспорт настроек</h3>
                    <p className="text-slate-400 text-sm">Сохранить настройки в файл</p>
                  </div>
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors text-left flex items-center space-x-3"
                >
                  <RotateCcw className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h3 className="text-white font-medium">Сброс настроек</h3>
                    <p className="text-slate-400 text-sm">Вернуть все настройки к значениям по умолчанию</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Current Settings Preview */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Текущие настройки</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Курс обмена:</p>
                  <p className="text-white font-semibold">{settings.pointsToUSDCRate} поинтов = 1 USDC</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Минимальный вывод:</p>
                  <p className="text-white font-semibold">{settings.minWithdrawal} поинтов</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Тема:</p>
                  <p className="text-white font-semibold capitalize">{settings.theme === 'dark' ? 'Темная' : 'Светлая'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Язык:</p>
                  <p className="text-white font-semibold">{settings.language === 'en' ? 'English' : 'Русский'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Сохранить изменения</span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex-1 py-3 sm:py-4 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Сбросить</span>
          </button>
        </div>
      </div>
    </div>
  );
}