import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Airdrop, Task } from '../types';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Users, 
  Calendar, 
  Trophy,
  Wallet,
  MessageCircle,
  Twitter,
  Hash,
  Globe,
  Star,
  AlertCircle
} from 'lucide-react';

interface AirdropDetailsProps {
  airdrop: Airdrop;
  onBack: () => void;
}

export default function AirdropDetails({ airdrop, onBack }: AirdropDetailsProps) {
  const { user, completeTask, updateUser } = useApp();
  const { walletState } = useWallet();
  const [wallet, setWallet] = useState(user.wallet || '');
  const [telegram, setTelegram] = useState(user.telegram || '');
  const [twitter, setTwitter] = useState(user.twitter || '');
  
  const completedTasks = user.completedTasks[airdrop.id] || [];
  const totalTasks = airdrop.tasks.length;
  const completedCount = completedTasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  const handleTaskComplete = async (task: Task) => {
    if (!walletState.isConnected) {
      alert('Please connect your wallet first to participate in airdrops');
      return;
    }

    if (task.type === 'wallet' && !wallet) {
      alert('Please enter your wallet address first');
      return;
    }
    
    if (task.type === 'telegram' && !telegram) {
      alert('Please enter your Telegram username first');
      return;
    }
    
    if (task.type === 'twitter' && !twitter) {
      alert('Please enter your Twitter username first');
      return;
    }
    
    // Update user info
    updateUser({
      ...user,
      wallet,
      telegram,
      twitter,
      walletAddress: walletState.address || user.walletAddress
    });
    
    // Simulate task completion
    setTimeout(() => {
      completeTask(airdrop.id, task.id);
    }, 1000);
    
    // Open external link if provided
    if (task.url) {
      window.open(task.url, '_blank');
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'telegram': return <MessageCircle className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'discord': return <Hash className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      case 'wallet': return <Wallet className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'telegram': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'twitter': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'discord': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'website': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'wallet': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const daysLeft = Math.ceil((new Date(airdrop.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Airdrops</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{airdrop.logo}</div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{airdrop.title}</h1>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-sm font-medium">
                    {airdrop.status.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-purple-400/10 text-purple-400 rounded-full text-sm font-medium">
                    {airdrop.blockchain}
                  </span>
                  <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-sm font-medium">
                    {airdrop.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-400 mb-1">{airdrop.reward}</p>
              <p className="text-slate-400">Reward per user</p>
            </div>
          </div>

          <p className="text-slate-300 text-lg mb-6">{airdrop.description}</p>

          {/* Wallet Connection Warning */}
          {!walletState.isConnected && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">Wallet Connection Required</p>
                <p className="text-yellow-300 text-sm">Connect MetaMask or another Web3 wallet to participate in airdrops</p>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Your Progress</h3>
              <span className="text-lg font-bold text-white">{completedCount}/{totalTasks} Tasks</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-400 mt-2">{Math.round(progress)}% completed</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <Users className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400 mb-1">Participants</p>
              <p className="text-xl font-bold text-white">{airdrop.participants.toLocaleString()}</p>
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <Calendar className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400 mb-1">Days Left</p>
              <p className="text-xl font-bold text-white">{daysLeft > 0 ? daysLeft : 'Ended'}</p>
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <Trophy className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400 mb-1">Total Pool</p>
              <p className="text-xl font-bold text-white">{airdrop.totalReward}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address</label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0x..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Telegram Username</label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Twitter Username</label>
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="@username"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Complete Tasks</h2>
        <div className="space-y-4">
          {airdrop.tasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-emerald-400/5 border-emerald-400/20' 
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg border ${getTaskColor(task.type)}`}>
                      {getTaskIcon(task.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{task.title}</h3>
                        {task.required && (
                          <Star className="w-4 h-4 text-yellow-400" title="Required" />
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{task.description}</p>
                      <p className="text-purple-400 text-sm font-medium">+{task.points} points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isCompleted ? (
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Completed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTaskComplete(task)}
                        disabled={!walletState.isConnected}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Complete</span>
                        {task.url && <ExternalLink className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
        <ul className="space-y-2">
          {airdrop.requirements.map((requirement, index) => (
            <li key={index} className="flex items-center space-x-2 text-slate-300">
              <Circle className="w-4 h-4 text-slate-400" />
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}