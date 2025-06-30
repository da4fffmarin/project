import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
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
  User
} from 'lucide-react';

export default function AdminPanel() {
  const { airdrops, adminStats, addAirdrop, updateAirdrop, deleteAirdrop, connectedUsers, updateUserPoints, getAllWithdrawals, addWithdrawal, updateWithdrawal, deleteWithdrawal } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'airdrops' | 'users' | 'withdrawals' | 'settings'>('airdrops');
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
  const [settings, setSettings] = useState({
    pointsToUSDCRate: 100,
    minWithdrawal: 100,
    platformFee: 0,
    maxAirdropsPerUser: 10
  });

  const allWithdrawals = getAllWithdrawals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
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

  const handleUserPointsChange = (userId: string, newPoints: number) => {
    updateUserPoints(userId, newPoints);
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
      usdcAmount: parseInt(withdrawalFormData.amount) / settings.pointsToUSDCRate,
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

  const handleSettingsSave = () => {
    // Save settings to localStorage or database
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
              <p className="text-slate-400 text-sm">Connected Wallets</p>
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

      {/* Tabs */}
      <div className="flex flex-wrap space-x-2 mb-6 sm:mb-8">
        <button
          onClick={() => setActiveTab('airdrops')}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'airdrops'
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25'
              : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Airdrop Management
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'withdrawals'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/25'
              : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Withdrawals
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Airdrop Management Tab */}
      {activeTab === 'airdrops' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Airdrop Management</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 self-start sm:self-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Airdrop</span>
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  {editingAirdrop ? 'Edit Airdrop' : 'Add New Airdrop'}
                </h2>
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

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

                {/* Social Media Links & Points */}
                <div className="border-t border-slate-600 pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Social Media Tasks & Points</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
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
                    className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Airdrops Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Airdrop
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {airdrops.map((airdrop) => (
                    <tr key={airdrop.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl sm:text-2xl">{airdrop.logo}</div>
                          <div>
                            <div className="text-sm font-medium text-white">{airdrop.title}</div>
                            <div className="text-sm text-slate-400">{airdrop.category} • {airdrop.blockchain}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {airdrop.participants.toLocaleString()} / {airdrop.maxParticipants.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-300">
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
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
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
        </>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Connected Users</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {connectedUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 font-mono">
                        {user.walletAddress ? 
                          `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                          'Not connected'
                        }
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={user.totalPoints}
                        onChange={(e) => handleUserPointsChange(user.id, parseInt(e.target.value) || 0)}
                        className="w-20 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-emerald-400 font-semibold text-sm focus:outline-none focus:border-emerald-500"
                        min="0"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {Object.values(user.completedTasks).flat().length} completed
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
            <div className="text-center py-8 sm:py-12">
              <Users className="w-12 sm:w-16 h-12 sm:h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Connected Users</h3>
              <p className="text-slate-400">Users will appear here when they connect their wallets</p>
            </div>
          )}
        </div>
      )}

      {/* Withdrawals Tab */}
      {activeTab === 'withdrawals' && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Withdrawal Management</h1>
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
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingWithdrawal ? 'Edit Withdrawal' : 'Add New Withdrawal'}
                </h2>
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
                      min="100"
                      step="100"
                      required
                    />
                    {withdrawalFormData.amount && (
                      <p className="mt-1 text-emerald-400 text-sm">
                        ≈ ${(parseInt(withdrawalFormData.amount) / settings.pointsToUSDCRate).toFixed(2)} USDC
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
        </>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Platform Settings</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Points to USDC Rate
                </label>
                <input
                  type="number"
                  value={settings.pointsToUSDCRate}
                  onChange={(e) => setSettings({ ...settings, pointsToUSDCRate: parseInt(e.target.value) })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  min="1"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {settings.pointsToUSDCRate} points = $1 USDC
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Minimum Withdrawal (Points)
                </label>
                <input
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: parseInt(e.target.value) })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform Fee (%)
                </label>
                <input
                  type="number"
                  value={settings.platformFee}
                  onChange={(e) => setSettings({ ...settings, platformFee: parseInt(e.target.value) })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Airdrops per User
                </label>
                <input
                  type="number"
                  value={settings.maxAirdropsPerUser}
                  onChange={(e) => setSettings({ ...settings, maxAirdropsPerUser: parseInt(e.target.value) })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  min="1"
                />
              </div>
            </div>

            <button
              onClick={handleSettingsSave}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}