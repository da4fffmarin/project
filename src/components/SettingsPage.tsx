import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../contexts/AppContext';
import { 
  Settings, 
  Save, 
  RotateCcw,
  Palette,
  Globe,
  Bell,
  Smartphone,
  Download,
  User,
  Shield
} from 'lucide-react';

interface UserSettings {
  theme: 'dark' | 'light';
  language: 'en' | 'ru';
  notifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  telegramNotifications: boolean;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useApp();
  
  // Redirect admins to admin panel
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const [settings, setSettings] = useLocalStorage<UserSettings>('user_settings', {
    theme: 'dark',
    language: 'en',
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    telegramNotifications: false
  });

  const [tempSettings, setTempSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof UserSettings, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setSettings(tempSettings);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    const defaultSettings: UserSettings = {
      theme: 'dark',
      language: 'en',
      notifications: true,
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
    link.download = 'user-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Show admin redirect message
  if (isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Settings</h2>
          <p className="text-slate-400 mb-6">
            Admin settings are available in the Admin Panel
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
          >
            Go to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-blue-500/25">
          <User className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">User Settings</h1>
        <p className="text-lg sm:text-xl text-slate-300">Configure your personal preferences</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
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

        {/* Notifications Settings */}
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
                    checked={tempSettings[key as keyof UserSettings] as boolean}
                    onChange={(e) => handleChange(key as keyof UserSettings, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={exportSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Settings</span>
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>

        {/* Save Settings */}
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

        {/* Current Settings Preview */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Theme:</p>
              <p className="text-white font-semibold capitalize">{settings.theme}</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Language:</p>
              <p className="text-white font-semibold">{settings.language === 'en' ? 'English' : 'Русский'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Notifications:</p>
              <p className="text-white font-semibold">{settings.notifications ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Push Notifications:</p>
              <p className="text-white font-semibold">{settings.pushNotifications ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}