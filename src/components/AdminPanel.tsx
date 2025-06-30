import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DatabaseStatus from './DatabaseStatus';
import ServerDatabaseStatus from './ServerDatabaseStatus';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Calendar,
  Save,
  X,
  ExternalLink,
  Clock,
  User,
  Settings,
  Database,
  Bell,
  Shield,
  Download,
  RotateCcw,
  Lock,
  Palette,
  Globe,
  Smartphone,
  Zap,
  Server
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

export default function AdminPanel() {
  const { 
    airdrops, 
    adminStats, 
    addAirdrop, 
    updateAirdrop, 
    deleteAirdrop, 
    connectedUsers, 
    updateUserPoints, 
    getAllWithdrawals, 
    addWithdrawal, 
    updateWithdrawal, 
    deleteWithdrawal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'airdrops' | 'users' | 'withdrawals' | 'settings' | 'database'>('overview');
  
  // Airdrop management state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logo: '',
    reward: '',
    totalReward: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    category: '',
    blockchain: '',
    status: 'upcoming' as const,
    telegramUrl: '',
    twitterUrl: '',
    discordUrl: '',
    websiteUrl: '',
    telegramPoints: '50',
    twitterPoints: '30',
    discordPoints: '25',
    websitePoints: '40',
    walletPoints: '45'
  });

  // Withdrawal management state
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [editingWithdrawal, setEditingWithdrawal] = useState<string | null>(null);
  const [withdrawalFormData, setWithdrawalFormData] = useState({
    userId: '',
    amount: '',
    status: 'pending' as const,
    txHash: ''
  });

  // Settings state
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

  const allWithdrawals = getAllWithdrawals();

  // Airdrop management functions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('Start date must be before end date');
      return;
    }
    
    const airdropData = {
      ...formData,
      participants: 0,
      maxParticipants: parseInt(formData.maxParticipants),
      tasks: [
        {
          id: 'telegram',
          type: 'telegram' as const,
          title: 'Join Telegram',
          description: 'Join our Telegram channel',
          url: formData.telegramUrl,
          points: parseInt(formData.telegramPoints),
          required: true
        },
        {
          id: 'twitter',
          type: 'twitter' as const,
          title: 'Follow Twitter',
          description: 'Follow our Twitter account',
          url: formData.twitterUrl,
          points: parseInt(formData.twitterPoints),
          required: true
        },
        {
          id: 'discord',
          type: 'discord' as const,
          title: 'Join Discord',
          description: 'Join our Discord server',
          url: formData.discordUrl,
          points: parseInt(formData.discordPoints),
          required: false
        },
        {
          id: 'website',
          type: 'website' as const,
          title: 'Visit Website',
          description: 'Visit our official website',
          url: formData.websiteUrl,
          points: parseInt(formData.websitePoints),
          required: false
        },
        {
          id: 'wallet',
          type: 'wallet' as const,
          title: 'Connect Wallet',
          description: 'Connect your wallet to receive rewards',
          points: parseInt(formData.walletPoints),
          required: true
        }
      ].filter(task => task.url || task.type === 'wallet'),
      requirements: ['Complete social media tasks', 'Valid wallet address', 'Active social media accounts']
    };

    if (editingAirdrop) {
      updateAirdrop(editingAirdrop, airdropData);
      setEditingAirdrop(null);
    } else {
      addAirdrop(airdropData);
    }
    
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      logo: '',
      reward: '',
      totalReward: '',
      maxParticipants: '',
      startDate: '',
      endDate: '',
      category: '',
      blockchain: '',
      status: 'upcoming',
      telegramUrl: '',
      twitterUrl: '',
      discordUrl: '',
      websiteUrl: '',
      telegramPoints: '50',
      twitterPoints: '30',
      discordPoints: '25',
      websitePoints: '40',
      walletPoints: '45'
    });
  };

  const handleEdit = (airdrop: any) => {
    const telegramTask = airdrop.tasks.find((t: any) => t.type === 'telegram');
    const twitterTask = airdrop.tasks.find((t: any) => t.type === 'twitter');
    const discordTask = airdrop.tasks.find((t: any) => t.type === 'discord');
    const websiteTask = airdrop.tasks.find((t: any) => t.type === 'website');
    const walletTask = airdrop.tasks.find((t: any) => t.type === 'wallet');

    setFormData({
      title: airdrop.title,
      description: airdrop.description,
      logo: airdrop.logo,
      reward: airdrop.reward,
      totalReward: airdrop.totalReward,
      maxParticipants: airdrop.maxParticipants.toString(),
      startDate: airdrop.startDate ? airdrop.startDate.slice(0, 16) : '',
      endDate: airdrop.endDate ? airdrop.endDate.slice(0, 16) : '',
      category: airdrop.category,
      blockchain: airdrop.blockchain,
      status: airdrop.status,
      telegramUrl: telegramTask?.url || '',
      twitterUrl: twitterTask?.url || '',
      discordUrl: discordTask?.url || '',
      websiteUrl: websiteTask?.url || '',
      telegramPoints: telegramTask?.points?.toString() || '50',
      twitterPoints: twitterTask?.points?.toString() || '30',
      discordPoints: discordTask?.points?.toString() || '25',
      websitePoints: websiteTask?.points?.toString() || '40',
      walletPoints: walletTask?.points?.toString() || '45'
    });
    setEditingAirdrop(airdrop.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this airdrop?')) {
      deleteAirdrop(id);
    }
  };

  // Withdrawal management functions
  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedUser = connectedUsers.find(u => u.id === withdrawalFormData.userId);
    if (!selectedUser) return;

    const withdrawalData = {
      userId: withdrawalFormData.userId,
      username: selectedUser.walletAddress ? 
        `${selectedUser.walletAddress.slice(0, 6)}...${selectedUser.walletAddress.slice(-4)}` : 
        `User #${selectedUser.id.slice(0, 8)}`,
      amount: parseInt(withdrawalFormData.amount),
      usdcAmount: parseInt(withdrawalFormData.amount) / tempSettings.pointsToUSDCRate,
      timestamp: new Date().toISOString(),
      status: withdrawalFormData.status,
      txHash: withdrawalFormData.txHash || undefined
    };

    if (editingWithdrawal) {
      updateWithdrawal(editingWithdrawal, withdrawalData);
      setEditingWithdrawal(null);
    } else {
      addWithdrawal(withdrawalData);
    }
    
    setShowWithdrawalForm(false);
    resetWithdrawalForm();
  };

  const resetWithdrawalForm = () => {
    setWithdrawalFormData({
      userId: '',
      amount: '',
      status: 'pending',
      txHash: ''
    });
  };

  const handleEditWithdrawal = (withdrawal: any) => {
    setWithdrawalFormData({
      userId: withdrawal.userId,
      amount: withdrawal.amount.toString(),
      status: withdrawal.status,
      txHash: withdrawal.txHash || ''
    });
    setEditingWithdrawal(withdrawal.id);
    setShowWithdrawalForm(true);
  };

  const handleDeleteWithdrawal = (id: string) => {
    if (confirm('Are you sure you want to delete this withdrawal?')) {
      deleteWithdrawal(id);
    }
  };

  // Settings functions
  const handleSettingsChange = (key: keyof AppSettings, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
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
    link.download = 'admin-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <DollarSign className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'airdrops', label: 'Airdrops', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'withdrawals', label: 'Withdrawals', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'database', label: 'Database', icon: Database }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl mb-6 shadow-2xl shadow-red-500/25">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Admin Control Panel</h1>
        <p className="text-xl text-slate-300">Complete platform management and configuration</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Airdrops</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{adminStats.totalAirdrops}</p>
            </div>
            <Activity className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Airdrops</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{adminStats.activeAirdrops}</p>
            </div>
            <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Connected Users</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{adminStats.connectedWallets.toLocaleString()}</p>
            </div>
            <Users className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Rewards Distributed</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{adminStats.totalRewardsDistributed}</p>
            </div>
            <DollarSign className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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
      <div className="space-y-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Platform Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Points Earned:</span>
                    <span className="text-white font-semibold">{connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average per User:</span>
                    <span className="text-white font-semibold">{Math.round(connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0) / Math.max(connectedUsers.length, 1)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">USDC Value:</span>
                    <span className="text-emerald-400 font-semibold">${(connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0) / tempSettings.pointsToUSDCRate).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-semibold">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-white font-semibold">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version:</span>
                    <span className="text-white font-semibold">v2.1.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Exchange Rate</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Rate:</span>
                    <span className="text-white font-semibold">{tempSettings.pointsToUSDCRate} points = 1 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Withdrawal:</span>
                    <span className="text-white font-semibold">{tempSettings.minWithdrawal} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min USDC:</span>
                    <span className="text-emerald-400 font-semibold">${(tempSettings.minWithdrawal / tempSettings.pointsToUSDCRate).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Airdrops Tab */}
        {activeTab === 'airdrops' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-white">Airdrop Management</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Airdrop</span>
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {editingAirdrop ? 'Edit Airdrop' : 'Add New Airdrop'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingAirdrop(null);
                      resetForm();
                    }}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Logo (Emoji)</label>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        placeholder="🚀"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Start Date & Time</label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">End Date & Time</label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Reward</label>
                      <input
                        type="text"
                        value={formData.reward}
                        onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        placeholder="100 TOKENS"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Total Reward Pool</label>
                      <input
                        type="text"
                        value={formData.totalReward}
                        onChange={(e) => setFormData({ ...formData, totalReward: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        placeholder="1,000,000 TOKENS"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Max Participants</label>
                      <input
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="DeFi">DeFi</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="NFT">NFT</option>
                        <option value="Layer 2">Layer 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Blockchain</label>
                      <select
                        value={formData.blockchain}
                        onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        required
                      >
                        <option value="">Select Blockchain</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Polygon">Polygon</option>
                        <option value="Solana">Solana</option>
                        <option value="Arbitrum">Arbitrum</option>
                        <option value="Multi-chain">Multi-chain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        required
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="border-t border-slate-600 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Social Media Tasks & Points</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Telegram URL</label>
                        <input
                          type="url"
                          value={formData.telegramUrl}
                          onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          placeholder="https://t.me/yourproject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Telegram Points</label>
                        <input
                          type="number"
                          value={formData.telegramPoints}
                          onChange={(e) => setFormData({ ...formData, telegramPoints: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Twitter URL</label>
                        <input
                          type="url"
                          value={formData.twitterUrl}
                          onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          placeholder="https://twitter.com/yourproject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Twitter Points</label>
                        <input
                          type="number"
                          value={formData.twitterPoints}
                          onChange={(e) => setFormData({ ...formData, twitterPoints: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Discord URL</label>
                        <input
                          type="url"
                          value={formData.discordUrl}
                          onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          placeholder="https://discord.gg/yourproject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Discord Points</label>
                        <input
                          type="number"
                          value={formData.discordPoints}
                          onChange={(e) => setFormData({ ...formData, discordPoints: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                        <input
                          type="url"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          placeholder="https://yourproject.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Website Points</label>
                        <input
                          type="number"
                          value={formData.websitePoints}
                          onChange={(e) => setFormData({ ...formData, websitePoints: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          min="1"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Connection Points</label>
                        <input
                          type="number"
                          value={formData.walletPoints}
                          onChange={(e) => setFormData({ ...formData, walletPoints: e.target.value })}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingAirdrop ? 'Update' : 'Create'} Airdrop</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingAirdrop(null);
                        resetForm();
                      }}
                      className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Airdrops Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Airdrop
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {airdrops.map((airdrop) => (
                      <tr key={airdrop.id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{airdrop.logo}</div>
                            <div>
                              <div className="text-sm font-medium text-white">{airdrop.title}</div>
                              <div className="text-sm text-slate-400">{airdrop.category} • {airdrop.blockchain}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            airdrop.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : airdrop.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {airdrop.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {airdrop.participants.toLocaleString()} / {airdrop.maxParticipants.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Start: {new Date(airdrop.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>End: {new Date(airdrop.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(airdrop)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(airdrop.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">User Management</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {connectedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.id.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">User #{index + 1}</div>
                            <div className="text-sm text-slate-400">{user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300 font-mono">
                          {user.walletAddress ? 
                            `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                            'Not connected'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={user.totalPoints}
                          onChange={(e) => updateUserPoints(user.id, parseInt(e.target.value) || 0)}
                          className="w-20 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-emerald-400 font-semibold text-sm focus:outline-none focus:border-emerald-500"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">
                          {Object.values(user.completedTasks).flat().length} completed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isConnected 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isConnected ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {connectedUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Connected Users</h3>
                <p className="text-slate-400">Users will appear here when they connect their wallets</p>
              </div>
            )}
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Withdrawal Management</h2>
              <button
                onClick={() => setShowWithdrawalForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Withdrawal</span>
              </button>
            </div>

            {/* Add/Edit Withdrawal Form */}
            {showWithdrawalForm && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {editingWithdrawal ? 'Edit Withdrawal' : 'Add New Withdrawal'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowWithdrawalForm(false);
                      setEditingWithdrawal(null);
                      resetWithdrawalForm();
                    }}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">User</label>
                      <select
                        value={withdrawalFormData.userId}
                        onChange={(e) => setWithdrawalFormData({ ...withdrawalFormData, userId: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        required
                      >
                        <option value="">Select User</option>
                        {connectedUsers.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.walletAddress ? 
                              `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                              `User #${user.id.slice(0, 8)}`
                            } - {user.totalPoints} points
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Amount (Points)</label>
                      <input
                        type="number"
                        value={withdrawalFormData.amount}
                        onChange={(e) => setWithdrawalFormData({ ...withdrawalFormData, amount: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        placeholder="100"
                        min={tempSettings.minWithdrawal}
                        step="100"
                        required
                      />
                      {withdrawalFormData.amount && (
                        <p className="mt-1 text-emerald-400 text-sm">
                          ≈ ${(parseInt(withdrawalFormData.amount) / tempSettings.pointsToUSDCRate).toFixed(2)} USDC
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                      <select
                        value={withdrawalFormData.status}
                        onChange={(e) => setWithdrawalFormData({ ...withdrawalFormData, status: e.target.value as any })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Hash (Optional)</label>
                      <input
                        type="text"
                        value={withdrawalFormData.txHash}
                        onChange={(e) => setWithdrawalFormData({ ...withdrawalFormData, txHash: e.target.value })}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        placeholder="0x..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingWithdrawal ? 'Update' : 'Create'} Withdrawal</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setShowWithdrawalForm(false);
                        setEditingWithdrawal(null);
                        resetWithdrawalForm();
                      }}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Withdrawals Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {allWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{withdrawal.username}</div>
                              <div className="text-sm text-slate-400">{withdrawal.userId.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{withdrawal.amount} points</div>
                          <div className="text-sm text-emerald-400">${withdrawal.usdcAmount} USDC</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(withdrawal.status)}`}>
                            {getStatusIcon(withdrawal.status)}
                            <span>{withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {new Date(withdrawal.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditWithdrawal(withdrawal)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWithdrawal(withdrawal.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {withdrawal.txHash && (
                              <a
                                href={`https://etherscan.io/tx/${withdrawal.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {allWithdrawals.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Withdrawals</h3>
                  <p className="text-slate-400">No withdrawal transactions have been created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Exchange Rate Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Exchange Rate Settings</h2>
                <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                  <Lock className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 text-xs font-medium">Admin Only</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Points per 1 USDC
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tempSettings.pointsToUSDCRate}
                      onChange={(e) => handleSettingsChange('pointsToUSDCRate', parseInt(e.target.value))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      min="1"
                      step="1"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                      points = 1 USDC
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
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
                    onChange={(e) => handleSettingsChange('minWithdrawal', parseInt(e.target.value))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    min="1"
                    step="1"
                  />
                  <p className="text-sm text-slate-400 mt-2">
                    Minimum: ${(tempSettings.minWithdrawal / tempSettings.pointsToUSDCRate).toFixed(2)} USDC
                  </p>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Palette className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Platform Appearance</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Default Theme
                  </label>
                  <select
                    value={tempSettings.theme}
                    onChange={(e) => handleSettingsChange('theme', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Platform Language
                  </label>
                  <select
                    value={tempSettings.language}
                    onChange={(e) => handleSettingsChange('language', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Bell className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Notification Settings</h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    key: 'notifications',
                    icon: Bell,
                    title: 'General Notifications',
                    description: 'Enable platform-wide notifications'
                  },
                  {
                    key: 'pushNotifications',
                    icon: Smartphone,
                    title: 'Push Notifications',
                    description: 'Browser push notifications for users'
                  },
                  {
                    key: 'emailNotifications',
                    icon: Globe,
                    title: 'Email Notifications',
                    description: 'Send important updates via email'
                  },
                  {
                    key: 'telegramNotifications',
                    icon: Bell,
                    title: 'Telegram Bot Notifications',
                    description: 'Notifications through Telegram bot'
                  }
                ].map(({ key, icon: Icon, title, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
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
                        onChange={(e) => handleSettingsChange(key as keyof AppSettings, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
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
                      onChange={(e) => handleSettingsChange('autoBackup', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={exportSettings}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Settings</span>
                  </button>
                  
                  <button
                    onClick={handleResetSettings}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Default</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Settings */}
            <div className="flex space-x-4">
              <button
                onClick={handleSaveSettings}
                disabled={!hasChanges}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save All Settings</span>
              </button>
              
              <button
                onClick={handleResetSettings}
                className="px-8 py-4 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
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
                  <Server className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Database Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Local Database (SQL.js)</h4>
                  <div className="text-sm text-slate-400 space-y-1">
                    <p>• Browser-based storage</p>
                    <p>• Automatic persistence</p>
                    <p>• Real-time updates</p>
                    <p>• Export/Import support</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Server Database (MySQL)</h4>
                  <div className="text-sm text-slate-400 space-y-1">
                    <p>• Production-ready</p>
                    <p>• Scalable architecture</p>
                    <p>• Backup & recovery</p>
                    <p>• Multi-user support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}