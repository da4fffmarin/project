import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { useDesign } from '../contexts/DesignContext';
import AirdropCard from './AirdropCard';
import { Search, Filter, TrendingUp, Calendar, Trophy, Sparkles, Zap, Wallet, AlertCircle } from 'lucide-react';

export default function AirdropList() {
  const { airdrops } = useApp();
  const { walletState, connectWallet, isConnecting, connectionError, clearError } = useWallet();
  const { currentTheme, themes } = useDesign();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const theme = themes.find(t => t.id === currentTheme) || themes[0];

  const categories = ['all', ...Array.from(new Set(airdrops.map(a => a.category)))];
  const statuses = ['all', 'active', 'upcoming', 'completed'];

  const filteredAirdrops = airdrops.filter(airdrop => {
    const matchesSearch = airdrop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         airdrop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || airdrop.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || airdrop.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeAirdropsCount = airdrops.filter(a => a.status === 'active').length;
  const totalRewards = airdrops.reduce((sum, a) => sum + parseInt(a.totalReward.replace(/[^0-9]/g, '')), 0);

  const getTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-900' : 'text-white';
  };

  const getSecondaryTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-300';
  };

  const getCardBg = () => {
    return currentTheme === 'minimal' 
      ? 'bg-white/80 border-slate-200/50' 
      : 'bg-slate-800/30 border-slate-700/50';
  };

  const getConnectButtonClass = () => {
    switch (currentTheme) {
      case 'cosmic':
        return "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/25";
      case 'neon':
        return "bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 shadow-lg shadow-pink-500/25";
      case 'minimal':
        return "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25";
      case 'gradient':
        return "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 hover:from-red-600 hover:via-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25";
      default:
        return "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/25";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className={`absolute top-10 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r ${theme.colors.primary} opacity-10 rounded-full blur-2xl animate-pulse`} />
          <div className={`absolute top-20 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r ${theme.colors.secondary} opacity-10 rounded-full blur-xl animate-pulse delay-1000`} />
        </div>

        <div className={`inline-flex items-center space-x-2 mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-gradient-to-r ${theme.colors.primary} opacity-10 border border-purple-500/20 rounded-full`}>
          <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
          <span className={`${currentTheme === 'minimal' ? 'text-purple-700' : 'text-purple-300'} font-medium text-sm sm:text-base`}>
            New opportunities every day
          </span>
        </div>

        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ${getTextColor()} mb-4 sm:mb-6 leading-tight`}>
          Discover the World of <br />
          <span className={`bg-gradient-to-r ${theme.colors.primary} bg-clip-text text-transparent animate-pulse`}>
            Crypto Airdrops
          </span>
        </h1>
        <p className={`text-lg sm:text-xl ${getSecondaryTextColor()} mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4`}>
          Complete simple tasks and earn rewards from the most promising cryptocurrency projects. 
          Connect your wallet and start earning today!
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 px-4">
          <div className={`group ${getCardBg()} backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105`}>
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 sm:p-4 bg-gradient-to-br ${theme.colors.accent} opacity-20 rounded-xl sm:rounded-2xl`}>
                <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-400" />
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${getTextColor()} mb-2`}>{activeAirdropsCount}</p>
            <p className={`${getSecondaryTextColor()} font-medium text-sm sm:text-base`}>Active Airdrops</p>
          </div>
          
          <div className={`group ${getCardBg()} backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-yellow-500/30 transition-all duration-500 hover:scale-105`}>
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 sm:p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl`}>
                <Trophy className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${getTextColor()} mb-2`}>${(totalRewards / 1000000).toFixed(1)}M</p>
            <p className={`${getSecondaryTextColor()} font-medium text-sm sm:text-base`}>Total Rewards</p>
          </div>
          
          <div className={`group ${getCardBg()} backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-blue-500/30 transition-all duration-500 hover:scale-105`}>
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 sm:p-4 bg-gradient-to-br ${theme.colors.secondary} opacity-20 rounded-xl sm:rounded-2xl`}>
                <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${getTextColor()} mb-2`}>{airdrops.length}</p>
            <p className={`${getSecondaryTextColor()} font-medium text-sm sm:text-base`}>Total Projects</p>
          </div>
        </div>
      </div>

      {/* Compact Wallet Connection */}
      {!walletState.isConnected && (
        <div className="mb-8 sm:mb-12 px-4">
          <div className={`bg-gradient-to-r ${theme.colors.primary} opacity-10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm`}>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${theme.colors.primary} rounded-xl flex items-center justify-center`}>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className={`text-lg font-semibold ${getTextColor()}`}>Connect Wallet to Participate</h3>
                  <p className={`${getSecondaryTextColor()} text-sm`}>Connect your Web3 wallet to complete tasks and earn rewards</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                {connectionError && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{connectionError}</span>
                    <button onClick={clearError} className="text-red-300 hover:text-red-200">×</button>
                  </div>
                )}
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className={`px-6 py-3 ${getConnectButtonClass()} text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center space-x-2`}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`${getCardBg()} backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-8 sm:mb-12 shadow-2xl mx-4 sm:mx-0`}>
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className={`p-2 bg-gradient-to-br ${theme.colors.primary} opacity-20 rounded-xl`}>
            <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
          </div>
          <h3 className={`text-base sm:text-lg font-semibold ${getTextColor()}`}>Search Filters</h3>
        </div>

        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 ${getSecondaryTextColor()} w-4 sm:w-5 h-4 sm:h-5`} />
            <input
              type="text"
              placeholder="Search airdrops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 ${currentTheme === 'minimal' ? 'bg-slate-100/30 border-slate-300/50 text-slate-900 placeholder-slate-500' : 'bg-slate-700/30 border-slate-600/50 text-white placeholder-slate-400'} border rounded-xl sm:rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base`}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`pl-3 sm:pl-4 pr-8 sm:pr-10 py-3 sm:py-4 ${currentTheme === 'minimal' ? 'bg-slate-100/30 border-slate-300/50 text-slate-900' : 'bg-slate-700/30 border-slate-600/50 text-white'} border rounded-xl sm:rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer min-w-[140px] sm:min-w-[180px] backdrop-blur-sm text-sm sm:text-base`}
            >
              {categories.map(category => (
                <option key={category} value={category} className={currentTheme === 'minimal' ? 'bg-white' : 'bg-slate-800'}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`pl-3 sm:pl-4 pr-8 sm:pr-10 py-3 sm:py-4 ${currentTheme === 'minimal' ? 'bg-slate-100/30 border-slate-300/50 text-slate-900' : 'bg-slate-700/30 border-slate-600/50 text-white'} border rounded-xl sm:rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer min-w-[120px] sm:min-w-[150px] backdrop-blur-sm text-sm sm:text-base`}
            >
              {statuses.map(status => (
                <option key={status} value={status} className={currentTheme === 'minimal' ? 'bg-white' : 'bg-slate-800'}>
                  {status === 'all' ? 'All Status' : 
                   status === 'active' ? 'Active' :
                   status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Airdrops Grid */}
      {filteredAirdrops.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-4">
          <div className={`inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 ${getCardBg()} rounded-2xl sm:rounded-3xl mb-4 sm:mb-6`}>
            <Search className={`w-8 sm:w-10 h-8 sm:h-10 ${getSecondaryTextColor()}`} />
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold ${getTextColor()} mb-4`}>No Airdrops Found</h3>
          <p className={`${getSecondaryTextColor()} text-base sm:text-lg`}>Try adjusting your search parameters or filters</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 sm:mb-8 px-4 sm:px-0">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
              <h2 className={`text-xl sm:text-2xl font-bold ${getTextColor()}`}>
                Available Airdrops ({filteredAirdrops.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            {filteredAirdrops.map((airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}