import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Airdrop, Task } from '../types';
import { 
  ArrowLeft, 
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
  AlertCircle,
  ExternalLink,
  Clock,
  Zap
} from 'lucide-react';

interface TasksPageProps {
  airdrop: Airdrop;
  onBack: () => void;
}

export default function TasksPage({ airdrop, onBack }: TasksPageProps) {
  const { user, completeTask, updateUser } = useApp();
  const { walletState } = useWallet();
  const [wallet, setWallet] = useState(user.wallet || '');
  const [telegram, setTelegram] = useState(user.telegram || '');
  const [twitter, setTwitter] = useState(user.twitter || '');
  
  const completedTasks = user.completedTasks[airdrop.id] || [];
  const totalTasks = airdrop.tasks.length;
  const completedCount = completedTasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  // Check if airdrop has started
  const hasStarted = new Date() >= new Date(airdrop.startDate);
  const daysLeft = Math.ceil((new Date(airdrop.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleTaskComplete = async (task: Task) => {
    if (!walletState.isConnected) {
      alert('Please connect your wallet first to participate in airdrops');
      return;
    }

    if (!hasStarted) {
      alert('This airdrop has not started yet. Please wait until the start date.');
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back to Airdrops</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl">{airdrop.logo}</div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{airdrop.title}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-2 sm:px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-xs sm:text-sm font-medium">
                    {airdrop.status.toUpperCase()}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-purple-400/10 text-purple-400 rounded-full text-xs sm:text-sm font-medium">
                    {airdrop.blockchain}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-xs sm:text-sm font-medium">
                    {airdrop.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">{airdrop.reward}</p>
              <p className="text-slate-400 text-sm">Reward per user</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">{airdrop.description}</p>

          {/* Airdrop Not Started Warning */}
          {!hasStarted && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-semibold text-sm sm:text-base">Airdrop Not Started</p>
                <p className="text-yellow-300 text-xs sm:text-sm">
                  This airdrop will start on {new Date(airdrop.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Wallet Connection Info */}
          {!walletState.isConnected && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start space-x-3">
              <Wallet className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-400 font-semibold text-sm sm:text-base">Wallet Required for Task Completion</p>
                <p className="text-blue-300 text-xs sm:text-sm">You can view all tasks below, but you'll need to connect your wallet to complete them and earn rewards.</p>
              </div>
            </div>
          )}

          {/* Progress - Only show if wallet is connected */}
          {walletState.isConnected && (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-white">Your Progress</h3>
                <span className="text-base sm:text-lg font-bold text-white">{completedCount}/{totalTasks} Tasks</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-emerald-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">{Math.round(progress)}% completed</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-xl">
              <Users className="w-4 sm:w-6 h-4 sm:h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-slate-400 mb-1">Participants</p>
              <p className="text-sm sm:text-xl font-bold text-white">{airdrop.participants.toLocaleString()}</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-xl">
              <Calendar className="w-4 sm:w-6 h-4 sm:h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-slate-400 mb-1">Days Left</p>
              <p className="text-sm sm:text-xl font-bold text-white">{daysLeft > 0 ? daysLeft : 'Ended'}</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-xl">
              <Trophy className="w-4 sm:w-6 h-4 sm:h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-slate-400 mb-1">Total Pool</p>
              <p className="text-sm sm:text-xl font-bold text-white">{airdrop.totalReward}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Form - Only show if wallet is connected */}
      {walletState.isConnected && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Your Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address</label>
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Telegram Username</label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Twitter Username</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          {walletState.isConnected ? 'Complete Tasks' : 'Available Tasks'}
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {airdrop.tasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            const canComplete = walletState.isConnected && hasStarted;
            
            return (
              <div
                key={task.id}
                className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-emerald-400/5 border-emerald-400/20' 
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                    <div className={`p-2 rounded-lg border flex-shrink-0 ${getTaskColor(task.type)}`}>
                      {getTaskIcon(task.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base">{task.title}</h3>
                        {task.required && (
                          <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 flex-shrink-0" title="Required" />
                        )}
                      </div>
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">{task.description}</p>
                      <p className="text-purple-400 text-xs sm:text-sm font-medium">+{task.points} points</p>
                      {task.url && (
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs sm:text-sm mt-1"
                        >
                          <span>Visit link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    {isCompleted ? (
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span className="font-medium text-sm sm:text-base">Completed</span>
                      </div>
                    ) : canComplete ? (
                      <button
                        onClick={() => handleTaskComplete(task)}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
                      >
                        <span>Complete</span>
                        {task.url && <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4" />}
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Circle className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span className="text-sm sm:text-base">
                          {!walletState.isConnected ? 'Connect wallet' : 'Not started'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Requirements</h2>
        <ul className="space-y-2">
          {airdrop.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start space-x-2 text-slate-300 text-sm sm:text-base">
              <Circle className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400 mt-1 flex-shrink-0" />
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}