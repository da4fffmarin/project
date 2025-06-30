import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../contexts/AppContext';
import PermissionGuard from './PermissionGuard';
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
  Download,
  Lock
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
  const { isAdmin } = useApp();
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
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(isAdmin ? [
      { id: 'database', label: 'Database', icon: Database },
      { id: 'advanced', label: 'Advanced', icon: Zap }
    ] : [])
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-purple-500/25">
          <Settings className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Settings</h1>
        <p className="text-lg sm:text-xl text-slate-300">Configure your platform preferences</p>
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
            {/* Admin-only Exchange Rate Settings */}
            {isAdmin && (
              <PermissionGuard requiredRole="admin">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                      <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Exchange Rate Settings</h2>
                    <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                      <Lock className="w-3 h-3 text-red-400" />
                      <span className="text-red-400 text-xs font-medium">Admin Only</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Points per 1 USDC
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
              </PermissionGuard>
            )}

            {/* Appearance Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <Palette className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Appearance</h2>
                </div>
                <button
                  onClick={() => navigate('/theme')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-sm"
                >
                  Customize Theme
                </button>
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
          </>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Notifications</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  key: 'notifications',
                  icon: Bell,
                  title: 'General Notifications',
                  description: 'Receive notifications about new airdrops and updates'
                },
                {
                  key: 'pushNotifications',
                  icon: Smartphone,
                  title: 'Push Notifications',
                  description: 'Instant notifications in your browser'
                },
                {
                  key: 'emailNotifications',
                  icon: Globe,
                  title: 'Email Notifications',
                  description: 'Receive important updates via email'
                },
                {
                  key: 'telegramNotifications',
                  icon: Bell,
                  title: 'Telegram Notifications',
                  description: 'Notifications through Telegram bot'
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

        {/* Database Settings - Admin Only */}
        {activeTab === 'database' && isAdmin && (
          <PermissionGuard requiredRole="admin">
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-semibold text-sm">Administrator Access Required</span>
                </div>
                <p className="text-red-300 text-sm">
                  Database management features are only available to administrators for security reasons.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DatabaseStatus />
                <ServerDatabaseStatus />
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                    <Shield className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Data Security</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="text-white font-medium">Automatic Backup</h3>
                        <p className="text-slate-400 text-sm">Automatically create data backups</p>
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
          </PermissionGuard>
        )}

        {/* Advanced Settings - Admin Only */}
        {activeTab === 'advanced' && isAdmin && (
          <PermissionGuard requiredRole="admin">
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl">
                    <Zap className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Advanced Settings</h3>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                    <Lock className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs font-medium">Admin Only</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={exportSettings}
                    className="w-full p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors text-left flex items-center space-x-3"
                  >
                    <Download className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium">Export Settings</h3>
                      <p className="text-slate-400 text-sm">Save settings to file</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="w-full p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors text-left flex items-center space-x-3"
                  >
                    <RotateCcw className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-medium">Reset Settings</h3>
                      <p className="text-slate-400 text-sm">Restore all settings to default values</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Current Settings Preview */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Current Settings</h3>
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
          </PermissionGuard>
        )}

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
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}