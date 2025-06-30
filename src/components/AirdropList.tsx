import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Airdrop } from '../types';
import AirdropCard from './AirdropCard';
import WelcomeBonusPopup from './WelcomeBonusPopup';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Sparkles, 
  Zap, 
  Wallet, 
  AlertCircle, 
  Star, 
  Globe, 
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  DollarSign,
  Coins,
  ArrowRight,
  Info
} from 'lucide-react';

const ITEMS_PER_PAGE = 12; // Количество аирдропов на странице

export default function AirdropList() {
  const { airdrops, connectedUsers } = useApp();
  const { walletState, connectWallet, isConnecting, connectionError, clearError } = useWallet();
  
  // Фильтры и поиск
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBlockchain, setSelectedBlockchain] = useState('all');
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  
  // Сортировка
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'reward' | 'ending'>('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Вид отображения
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', ...Array.from(new Set(airdrops.map(a => a.category)))];
  const statuses = ['all', 'active', 'upcoming', 'completed'];
  const blockchains = ['all', ...Array.from(new Set(airdrops.map(a => a.blockchain)))];

  // Фильтрация и сортировка
  const filteredAndSortedAirdrops = useMemo(() => {
    let filtered = airdrops.filter(airdrop => {
      const matchesSearch = airdrop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           airdrop.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || airdrop.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || airdrop.status === selectedStatus;
      const matchesBlockchain = selectedBlockchain === 'all' || airdrop.blockchain === selectedBlockchain;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesBlockchain;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'newest':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'popular':
          comparison = a.participants - b.participants;
          break;
        case 'reward':
          const aReward = parseInt(a.totalReward.replace(/[^0-9]/g, '')) || 0;
          const bReward = parseInt(b.totalReward.replace(/[^0-9]/g, '')) || 0;
          comparison = aReward - bReward;
          break;
        case 'ending':
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [airdrops, searchTerm, selectedCategory, selectedStatus, selectedBlockchain, sortBy, sortOrder]);

  // Пагинация
  const totalPages = Math.ceil(filteredAndSortedAirdrops.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAirdrops = filteredAndSortedAirdrops.slice(startIndex, endIndex);

  // Сброс страницы при изменении фильтров
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, selectedBlockchain, sortBy, sortOrder]);

  const activeAirdropsCount = airdrops.filter(a => a.status === 'active').length;
  const totalRewards = airdrops.reduce((sum, a) => sum + parseInt(a.totalReward.replace(/[^0-9]/g, '')), 0);
  const totalUsers = connectedUsers.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedBlockchain('all');
    setSortBy('newest');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Placeholder function for compatibility with AirdropCard
  const handleViewTasks = (airdrop: Airdrop) => {
    console.log('View tasks for airdrop:', airdrop.id);
  };

  // Генерация номеров страниц для отображения
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Bonus Popup */}
      <WelcomeBonusPopup />

      {/* Compact Hero Section */}
      <div className="text-center mb-8 sm:mb-12 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-20 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="inline-flex items-center space-x-2 mb-4 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 font-medium text-sm">Free Crypto Rewards</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Discover <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">Crypto Airdrops</span>
        </h1>
        <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto px-4">
          Complete tasks and earn rewards from promising cryptocurrency projects
        </p>
        
        {/* Compact Exchange Rate Info */}
        <div className="mb-8 px-4">
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-semibold">100 Points</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">1 USDC</span>
            </div>
            <div className="w-px h-4 bg-slate-600" />
            <div className="flex items-center space-x-1">
              <Info className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300 text-sm">Min: $1</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Stats with Platform Data */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8 px-4 max-w-4xl mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400">{activeAirdropsCount}</p>
            <p className="text-slate-400 text-sm">Active</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-xl font-bold text-yellow-400">${(totalRewards / 1000000).toFixed(1)}M</p>
            <p className="text-slate-400 text-sm">Rewards</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-blue-400">{airdrops.length}</p>
            <p className="text-slate-400 text-sm">Projects</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-xl font-bold text-purple-400">{totalUsers > 0 ? `${Math.floor(totalUsers / 1000)}K+` : '50K+'}</p>
            <p className="text-slate-400 text-sm">Active Users</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400">$2.5M+</p>
            <p className="text-slate-400 text-sm">Distributed</p>
          </div>
        </div>

        {/* Call to Action - только если кошелек не подключен */}
        {!walletState.isConnected && (
          <div className="mb-8 px-4">
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25 flex items-center space-x-2 mx-auto"
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet to Start</span>
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

      {/* Enhanced Filters & Controls */}
      <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8 mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Filter className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search airdrops by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-700/30 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-slate-800">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-700/30 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
          >
            {statuses.map(status => (
              <option key={status} value={status} className="bg-slate-800">
                {status === 'all' ? 'All Status' : 
                 status === 'active' ? 'Active' :
                 status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </option>
            ))}
          </select>

          <select
            value={selectedBlockchain}
            onChange={(e) => setSelectedBlockchain(e.target.value)}
            className="bg-slate-700/30 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
          >
            {blockchains.map(blockchain => (
              <option key={blockchain} value={blockchain} className="bg-slate-800">
                {blockchain === 'all' ? 'All Blockchains' : blockchain}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 bg-slate-700/30 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="reward">Highest Reward</option>
              <option value="ending">Ending Soon</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Active Filters & Clear */}
        {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedBlockchain !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-600/30">
            <span className="text-slate-400 text-sm">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                {selectedCategory}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                {selectedStatus}
              </span>
            )}
            {selectedBlockchain !== 'all' && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                {selectedBlockchain}
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs hover:bg-red-500/30 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">
            Available Airdrops ({filteredAndSortedAirdrops.length})
          </h2>
        </div>
        
        {totalPages > 1 && (
          <div className="hidden sm:flex items-center space-x-2 text-slate-400 text-sm">
            <span>Page {currentPage} of {totalPages}</span>
            <span>•</span>
            <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedAirdrops.length)} of {filteredAndSortedAirdrops.length}</span>
          </div>
        )}
      </div>

      {/* Airdrops Grid/List */}
      {filteredAndSortedAirdrops.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-3xl mb-6">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Airdrops Found</h3>
          <p className="text-slate-400 text-lg mb-6">Try adjusting your search parameters or filters</p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className={`px-4 sm:px-0 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8' 
              : 'space-y-4'
          }`}>
            {currentAirdrops.map((airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
                onViewTasks={handleViewTasks}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 px-4 sm:px-0">
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  {/* Page Info */}
                  <div className="text-slate-400 text-sm">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedAirdrops.length)} of {filteredAndSortedAirdrops.length} airdrops
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    {/* First Page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="px-3 py-2 text-slate-400">...</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(page as number)}
                              className={`px-3 py-2 rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Last Page */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Items per page selector */}
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-400">Show:</span>
                    <select
                      value={ITEMS_PER_PAGE}
                      className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      disabled
                    >
                      <option value={12}>12 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}