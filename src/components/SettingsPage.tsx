import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
  Zap
} from 'lucide-react';

interface AppSettings {
  pointsToUSDCRate: number;
  minWithdrawal: number;
  theme: 'dark' | 'light';
  language: 'en' | 'ru';
  notifications: boolean;
  autoBackup: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app_settings', {
    pointsToUSDCRate: 100,
    minWithdrawal: 100,
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoBackup: true
  });

  const [tempSettings, setTempSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

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
      autoBackup: true
    };
    setTempSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-purple-500/25">
          <Settings className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Settings</h1>
        <p className="text-lg sm:text-xl text-slate-300">Configure your platform preferences</p>
      </div>

      {/* Settings Form */}
      <div className="space-y-6 sm:space-y-8">
        {/* Exchange Rate Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Exchange Rate</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Points to USDC Rate
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
                  points = 1 USDC
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Current rate: {tempSettings.pointsToUSDCRate} points = $1 USDC
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Minimum Withdrawal (Points)
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
                Minimum: ${(tempSettings.minWithdrawal / tempSettings.pointsToUSDCRate).toFixed(2)} USDC
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
              <Palette className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Appearance</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Theme
              </label>
              <select
                value={tempSettings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Language
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

        {/* System Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">System</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="text-white font-medium">Notifications</h3>
                  <p className="text-slate-400 text-sm">Receive notifications about airdrops and rewards</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempSettings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-white font-medium">Auto Backup</h3>
                  <p className="text-slate-400 text-sm">Automatically backup your data</p>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex-1 py-3 sm:py-4 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Current Settings Preview */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Current Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Exchange Rate:</p>
              <p className="text-white font-semibold">{settings.pointsToUSDCRate} points = 1 USDC</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Minimum Withdrawal:</p>
              <p className="text-white font-semibold">{settings.minWithdrawal} points</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Theme:</p>
              <p className="text-white font-semibold capitalize">{settings.theme}</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Language:</p>
              <p className="text-white font-semibold">{settings.language === 'en' ? 'English' : 'Русский'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}