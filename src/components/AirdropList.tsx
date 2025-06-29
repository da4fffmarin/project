import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Airdrop } from '../types';
import AirdropCard from './AirdropCard';
import { Search, Filter, TrendingUp, Calendar, Trophy, Sparkles, Zap, Wallet, AlertCircle } from 'lucide-react';

interface AirdropListProps {
  onViewTasks: (airdrop: Airdrop) => void;
}

export default function AirdropList({ onViewTasks }: AirdropListProps) {
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-20 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
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
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 px-4">
          <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl sm:rounded-2xl">
                <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">{activeAirdropsCount}</p>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Active Airdrops</p>
          </div>
          
          <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-yellow-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl">
                <Trophy className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">${(totalRewards / 1000000).toFixed(1)}M</p>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Total Rewards</p>
          </div>
          
          <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-blue-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl">
                <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">{airdrops.length}</p>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Total Projects</p>
          </div>
        </div>
      </div>

      {/* Compact Wallet Connection */}
      {!walletState.isConnected && (
        <div className="mb-8 sm:mb-12 px-4">
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white">Connect Wallet to Participate</h3>
                  <p className="text-slate-400 text-sm">Connect your Web3 wallet to complete tasks and earn rewards</p>
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
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-purple-500/25"
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
      <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-8 sm:mb-12 shadow-2xl mx-4 sm:mx-0">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
            <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Search Filters</h3>
        </div>

        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 sm:w-5 h-4 sm:h-5" />
            <input
              type="text"
              placeholder="Search airdrops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-700/30 border border-slate-600/50 rounded-xl sm:rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
            />
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
      </div>

      {/* Airdrops Grid */}
      {filteredAirdrops.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-4">
          <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-slate-800/50 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
            <Search className="w-8 sm:w-10 h-8 sm:h-10 text-slate-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">No Airdrops Found</h3>
          <p className="text-slate-400 text-base sm:text-lg">Try adjusting your search parameters or filters</p>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            {filteredAirdrops.map((airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
                onViewTasks={onViewTasks}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}