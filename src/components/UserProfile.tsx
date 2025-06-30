import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Calendar, 
  Wallet, 
  Star,
  Award,
  TrendingUp,
  Target,
  Clock,
  Settings,
  LogOut,
  Camera,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Gift,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function UserProfile() {
  const { user, updateUser, airdrops } = useApp();
  const { walletState, disconnectWallet, formatAddress } = useWallet();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    telegram: user.telegram || '',
    twitter: user.twitter || '',
    discord: user.discord || '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });

  const handleSave = () => {
    updateUser({
      ...user,
      telegram: editData.telegram,
      twitter: editData.twitter,
      discord: editData.discord
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      telegram: user.telegram || '',
      twitter: user.twitter || '',
      discord: user.discord || '',
      email: '',
      bio: '',
      location: '',
      website: ''
    });
    setIsEditing(false);
  };

  const completedAirdrops = Object.keys(user.completedTasks).length;
  const totalTasks = Object.values(user.completedTasks).flat().length;
  const joinDate = new Date(user.joinedAt);
  const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  // Quick actions for easy navigation
  const quickActions = [
    {
      title: 'Find Airdrops',
      description: 'Browse available airdrops',
      icon: Gift,
      color: 'from-purple-500 to-blue-600',
      action: () => navigate('/')
    },
    {
      title: 'My Rewards',
      description: `${user.totalPoints} points earned`,
      icon: Trophy,
      color: 'from-emerald-500 to-teal-600',
      action: () => navigate('/rewards')
    },
    {
      title: 'Leaderboard',
      description: 'See your ranking',
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-600',
      action: () => navigate('/leaderboard')
    }
  ];

  const achievements = [
    { 
      id: 'first_airdrop', 
      title: 'First Airdrop', 
      description: 'Joined your first airdrop',
      icon: Star,
      unlocked: completedAirdrops > 0,
      color: 'text-yellow-400'
    },
    { 
      id: 'task_master', 
      title: 'Task Master', 
      description: 'Completed 10+ tasks',
      icon: Target,
      unlocked: totalTasks >= 10,
      color: 'text-purple-400'
    },
    { 
      id: 'point_collector', 
      title: 'Point Collector', 
      description: 'Earned 1000+ points',
      icon: Trophy,
      unlocked: user.totalPoints >= 1000,
      color: 'text-emerald-400'
    },
    { 
      id: 'veteran', 
      title: 'Veteran', 
      description: '30+ days on platform',
      icon: Award,
      unlocked: daysSinceJoin >= 30,
      color: 'text-blue-400'
    }
  ];

  const stats = [
    {
      label: 'Total Points',
      value: user.totalPoints.toLocaleString(),
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      label: 'Airdrops Joined',
      value: completedAirdrops.toString(),
      icon: Trophy,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      label: 'Tasks Completed',
      value: totalTasks.toString(),
      icon: Target,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    },
    {
      label: 'Days Active',
      value: daysSinceJoin.toString(),
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Message for New Users */}
      {!walletState.isConnected && (
        <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 border border-purple-500/20 rounded-3xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to AirdropHub!</h2>
          <p className="text-slate-300 mb-6">
            Connect your wallet to start earning free crypto tokens from airdrops
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/25">
              <span className="text-3xl font-bold text-white">
                {user.walletAddress ? 
                  user.walletAddress.slice(2, 4).toUpperCase() : 
                  user.id.slice(0, 2).toUpperCase()
                }
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-800 hover:bg-slate-600 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-white">
                {user.walletAddress ? 
                  formatAddress(user.walletAddress) : 
                  `User #${user.id.slice(0, 8)}`
                }
              </h1>
              {walletState.isConnected && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs font-medium">Connected</span>
                </div>
              )}
            </div>
            
            <p className="text-slate-400 mb-4">
              Member since {joinDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              {walletState.isConnected && (
                <button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Telegram Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editData.telegram}
                  onChange={(e) => setEditData({ ...editData, telegram: e.target.value })}
                  placeholder="@username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Twitter Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editData.twitter}
                  onChange={(e) => setEditData({ ...editData, twitter: e.target.value })}
                  placeholder="@username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discord Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editData.discord}
                  onChange={(e) => setEditData({ ...editData, discord: e.target.value })}
                  placeholder="username#1234"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                achievement.unlocked
                  ? 'border-emerald-400/20 bg-emerald-400/5'
                  : 'border-slate-600/50 bg-slate-700/20'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  achievement.unlocked ? 'bg-emerald-400/10' : 'bg-slate-600/30'
                }`}>
                  <achievement.icon className={`w-6 h-6 ${
                    achievement.unlocked ? achievement.color : 'text-slate-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.unlocked ? 'text-white' : 'text-slate-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          {Object.entries(user.completedTasks).slice(0, 5).map(([airdropId, tasks], index) => {
            const airdrop = airdrops.find(a => a.id === airdropId);
            return (
              <div key={airdropId} className="flex items-center space-x-4 p-4 bg-slate-700/20 rounded-xl">
                <div className="text-2xl">{airdrop?.logo || '🎁'}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    Completed {tasks.length} tasks in {airdrop?.title || 'Airdrop'}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}
                  </p>
                </div>
                <div className="text-emerald-400 font-semibold">
                  +{tasks.length * 50} points
                </div>
              </div>
            );
          })}
          
          {Object.keys(user.completedTasks).length === 0 && (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-400">No activity yet</p>
              <p className="text-slate-500 text-sm">Start participating in airdrops to see your activity here!</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
              >
                Browse Airdrops
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}