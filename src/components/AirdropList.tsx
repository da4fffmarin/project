import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Airdrop } from '../types';
import AirdropCard from './AirdropCard';
import WelcomeBonusPopup from './WelcomeBonusPopup';
import { Search, Filter, TrendingUp, Calendar, Trophy, Sparkles, Zap, Wallet, AlertCircle, Star, Globe, Users } from 'lucide-react';

export default function AirdropList() {
  const { airdrops } = useApp();
  const { walletState, connectWallet, isConnecting, connectionError, clearError } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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

  // Placeholder function for compatibility with AirdropCard
  const handleViewTasks = (airdrop: Airdrop) => {
    // This function is not used as navigation happens inside AirdropCard
    console.log('View tasks for airdrop:', airdrop.id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Bonus Popup */}
      <WelcomeBonusPopup />

      {/* Enhanced Hero Section */}
      <div className="text-center mb-12 sm:mb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-20 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-10 left-1/3 w-20 sm:w-28 h-20 sm:h-28 bg-emerald-500/8 rounded-full blur-2xl animate-pulse delay-500" />
        </div>

        <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full">
          <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
          <span className="text-purple-300 font-medium text-sm sm:text-base">New opportunities every day</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Discover the World of <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
            Crypto Airdrops
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
          Complete simple tasks and earn rewards from the most promising cryptocurrency projects. 
          Connect your wallet and start earning today!
        </p>
        
        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 px-4">
          <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl sm:rounded-2xl">
                <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">{activeAirdropsCount}</p>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Active Airdrops</p>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs">Live now</span>
            </div>
          </div>
          
          <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-yellow-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl">
                <Trophy className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">${(totalRewards / 1000000).toFixed(1)}M</p>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Total Rewards</p>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs">Available</span>
            </div>
          </div>
          
          <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-blue-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl">
                <Globe className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">{airdrops.length}</p>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Total Projects</p>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <Users className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs">Growing</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!walletState.isConnected && (
          <div className="mb-8 sm:mb-12 px-4">
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-600 to-emerald-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:via-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 flex items-center space-x-3 text-lg"
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span>Connect Wallet to Start Earning</span>
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </button>
            
            {connectionError && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{connectionError}</span>
                <button onClick={clearError} className="text-red-300 hover:text-red-200">×</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Wallet Connection for Connected Users */}
      {walletState.isConnected && (
        <div className="mb-8 sm:mb-12 px-4">
          <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white">Wallet Connected!</h3>
                  <p className="text-slate-400 text-sm">You're ready to participate in airdrops and earn rewards</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-emerald-400 font-bold text-lg">{walletState.balance ? parseFloat(walletState.balance).toFixed(3) : '0'} ETH</p>
                  <p className="text-slate-400 text-xs">Balance</p>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Filters */}
      <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-8 sm:mb-12 shadow-2xl mx-4 sm:mx-0">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
            <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Search & Filter</h3>
        </div>

        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-6">
          {/* Enhanced Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 sm:w-5 h-4 sm:h-5" />
            <input
              type="text"
              placeholder="Search airdrops by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-700/30 border border-slate-600/50 rounded-xl sm:rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-3 sm:pl-4 pr-8 sm:pr-10 py-3 sm:py-4 bg-slate-700/30 border border-slate-600/50 rounded-xl sm:rounded-2xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer min-w-[140px] sm:min-w-[180px] backdrop-blur-sm text-sm sm:text-base"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
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
              className="pl-3 sm:pl-4 pr-8 sm:pr-10 py-3 sm:py-4 bg-slate-700/30 border border-slate-600/50 rounded-xl sm:rounded-2xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer min-w-[120px] sm:min-w-[150px] backdrop-blur-sm text-sm sm:text-base"
            >
              {statuses.map(status => (
                <option key={status} value={status} className="bg-slate-800">
                  {status === 'all' ? 'All Status' : 
                   status === 'active' ? 'Active' :
                   status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-sm">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                Category: {selectedCategory}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                Status: {selectedStatus}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded-full text-xs hover:bg-slate-600 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Airdrops Grid */}
      {filteredAirdrops.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-4">
          <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-slate-800/50 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
            <Search className="w-8 sm:w-10 h-8 sm:h-10 text-slate-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">No Airdrops Found</h3>
          <p className="text-slate-400 text-base sm:text-lg mb-6">Try adjusting your search parameters or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 sm:mb-8 px-4 sm:px-0">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Available Airdrops ({filteredAirdrops.length})
              </h2>
            </div>
            
            {/* Sort Options */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-slate-400 text-sm">Sort by:</span>
              <select className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-purple-500">
                <option>Newest</option>
                <option>Most Popular</option>
                <option>Highest Reward</option>
                <option>Ending Soon</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            {filteredAirdrops.map((airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
                onViewTasks={handleViewTasks}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}