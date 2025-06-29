import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { useDesign } from '../contexts/DesignContext';
import { Airdrop } from '../types';
import { Calendar, Users, Trophy, ExternalLink, CheckCircle2, Clock, Wallet, Zap, Star } from 'lucide-react';

interface AirdropCardProps {
  airdrop: Airdrop;
}

export default function AirdropCard({ airdrop }: AirdropCardProps) {
  const { user } = useApp();
  const { walletState } = useWallet();
  const { currentTheme, themes } = useDesign();
  
  const theme = themes.find(t => t.id === currentTheme) || themes[0];
  
  const completedTasks = user.completedTasks[airdrop.id] || [];
  const totalTasks = airdrop.tasks.length;
  const completedCount = completedTasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  const daysLeft = Math.ceil((new Date(airdrop.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
      case 'ethereum': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'polygon': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'multi-chain': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getCardBg = () => {
    return currentTheme === 'minimal' 
      ? 'bg-white/80 border-slate-200/50 hover:border-purple-500/30' 
      : 'bg-slate-800/30 border-slate-700/50 hover:border-purple-500/30';
  };

  const getTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-900' : 'text-white';
  };

  const getSecondaryTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-300';
  };

  const getTertiaryTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-500' : 'text-slate-400';
  };

  const getButtonClass = () => {
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
    <div className={`group relative ${getCardBg()} backdrop-blur-xl border rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.02] overflow-hidden`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.colors.primary} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${theme.colors.primary} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
              {airdrop.logo}
            </div>
            {airdrop.status === 'active' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${getTextColor()} group-hover:text-purple-300 transition-colors duration-300`}>
              {airdrop.title}
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(airdrop.status)}`}>
                {airdrop.status.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBlockchainColor(airdrop.blockchain)}`}>
                {airdrop.blockchain}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <p className={`text-2xl font-bold bg-gradient-to-r ${theme.colors.accent} bg-clip-text text-transparent`}>
              {airdrop.reward}
            </p>
          </div>
          <p className={`text-xs ${getTertiaryTextColor()}`}>Per user</p>
        </div>
      </div>

      {/* Description */}
      <p className={`${getSecondaryTextColor()} text-sm mb-6 line-clamp-2 leading-relaxed`}>
        {airdrop.description}
      </p>

      {/* Wallet Status - Only show if not connected */}
      {!walletState.isConnected && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-sm font-medium">Connect wallet to complete tasks</span>
        </div>
      )}

      {/* Progress Bar - Only show if user has started tasks */}
      {walletState.isConnected && completedCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${getTertiaryTextColor()}`}>Task Progress</span>
            <span className={`text-sm font-bold ${getTextColor()}`}>{completedCount}/{totalTasks}</span>
          </div>
          <div className={`w-full ${currentTheme === 'minimal' ? 'bg-slate-200/50' : 'bg-slate-700/50'} rounded-full h-2 overflow-hidden`}>
            <div 
              className={`bg-gradient-to-r ${theme.colors.primary} h-2 rounded-full transition-all duration-1000 relative`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <p className={`text-xs ${getTertiaryTextColor()} mt-1`}>{Math.round(progress)}% completed</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`text-center p-3 ${currentTheme === 'minimal' ? 'bg-slate-100/20' : 'bg-slate-700/20'} backdrop-blur-sm rounded-xl border ${currentTheme === 'minimal' ? 'border-slate-200/30' : 'border-slate-600/30'}`}>
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className={`text-xs ${getTertiaryTextColor()} mb-1`}>Participants</p>
          <p className={`text-sm font-bold ${getTextColor()}`}>{airdrop.participants.toLocaleString()}</p>
        </div>
        
        <div className={`text-center p-3 ${currentTheme === 'minimal' ? 'bg-slate-100/20' : 'bg-slate-700/20'} backdrop-blur-sm rounded-xl border ${currentTheme === 'minimal' ? 'border-slate-200/30' : 'border-slate-600/30'}`}>
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className={`text-xs ${getTertiaryTextColor()} mb-1`}>Days Left</p>
          <p className={`text-sm font-bold ${getTextColor()}`}>{daysLeft > 0 ? daysLeft : 'Ended'}</p>
        </div>
        
        <div className={`text-center p-3 ${currentTheme === 'minimal' ? 'bg-slate-100/20' : 'bg-slate-700/20'} backdrop-blur-sm rounded-xl border ${currentTheme === 'minimal' ? 'border-slate-200/30' : 'border-slate-600/30'}`}>
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <p className={`text-xs ${getTertiaryTextColor()} mb-1`}>Total Pool</p>
          <p className={`text-sm font-bold ${getTextColor()}`}>{airdrop.totalReward}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {walletState.isConnected ? (
            progress === 100 ? (
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">Completed</span>
              </div>
            ) : completedCount > 0 ? (
              <div className="flex items-center space-x-2 text-blue-400">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-semibold">In Progress</span>
              </div>
            ) : (
              <div className={`flex items-center space-x-2 ${getTertiaryTextColor()}`}>
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Not Started</span>
              </div>
            )
          ) : (
            <div className={`flex items-center space-x-2 ${getTertiaryTextColor()}`}>
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">View Tasks</span>
            </div>
          )}
        </div>
        
        <Link
          to={`/airdrops/${airdrop.id}`}
          className={`px-6 py-3 ${getButtonClass()} text-white rounded-xl transition-all duration-300 flex items-center space-x-2 group/btn hover:scale-105`}
        >
          <span className="text-sm font-semibold">View Tasks</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}