import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Airdrop } from '../types';
import { Calendar, Users, Trophy, ExternalLink, CheckCircle2, Clock, Wallet, Zap, Star } from 'lucide-react';

interface AirdropCardProps {
  airdrop: Airdrop;
  onViewTasks: (airdrop: Airdrop) => void;
}

export default function AirdropCard({ airdrop, onViewTasks }: AirdropCardProps) {
  const { user } = useApp();
  const { walletState } = useWallet();
  const navigate = useNavigate();
  
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

  const handleViewTasks = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Переход на страницу задач с ID аирдропа
    navigate(`/airdrop?id=${airdrop.id}`);
  };

  return (
    <div className="group relative bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.02] overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

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
            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
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
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {airdrop.reward}
            </p>
          </div>
          <p className="text-xs text-slate-400">Per user</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed">
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
            <span className="text-sm font-medium text-slate-400">Task Progress</span>
            <span className="text-sm font-bold text-white">{completedCount}/{totalTasks}</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">{Math.round(progress)}% completed</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-700/20 backdrop-blur-sm rounded-xl border border-slate-600/30">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-xs text-slate-400 mb-1">Participants</p>
          <p className="text-sm font-bold text-white">{airdrop.participants.toLocaleString()}</p>
        </div>
        
        <div className="text-center p-3 bg-slate-700/20 backdrop-blur-sm rounded-xl border border-slate-600/30">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-xs text-slate-400 mb-1">Days Left</p>
          <p className="text-sm font-bold text-white">{daysLeft > 0 ? daysLeft : 'Ended'}</p>
        </div>
        
        <div className="text-center p-3 bg-slate-700/20 backdrop-blur-sm rounded-xl border border-slate-600/30">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-xs text-slate-400 mb-1">Total Pool</p>
          <p className="text-sm font-bold text-white">{airdrop.totalReward}</p>
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
              <div className="flex items-center space-x-2 text-slate-400">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Not Started</span>
              </div>
            )
          ) : (
            <div className="flex items-center space-x-2 text-slate-400">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">View Tasks</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleViewTasks}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 group/btn shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
        >
          <span className="text-sm font-semibold">View Tasks</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}