import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { 
  ArrowLeft, 
  Coins, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Wallet,
  ExternalLink,
  Star,
  Zap
} from 'lucide-react';

interface RewardsPageProps {
  onBack: () => void;
}

export default function RewardsPage({ onBack }: RewardsPageProps) {
  const { user, withdrawPoints, withdrawalHistory, addWithdrawal } = useApp();
  const { walletState } = useWallet();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const pointsToUSDC = (points: number) => points / 100;
  const minWithdrawal = 100;

  const handleWithdraw = async () => {
    const points = parseInt(withdrawAmount);
    if (points < minWithdrawal || points > user.totalPoints) return;

    setIsWithdrawing(true);
    
    // Simulate withdrawal process
    setTimeout(() => {
      const usdcAmount = pointsToUSDC(points);
      
      // Add withdrawal record
      addWithdrawal({
        userId: user.id,
        username: user.walletAddress ? 
          `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
          `User #${user.id.slice(0, 8)}`,
        amount: points,
        usdcAmount,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      
      withdrawPoints(points);
      setWithdrawAmount('');
      setIsWithdrawing(false);
    }, 2000);
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
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-emerald-500/25">
            <Coins className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Rewards Center</h1>
          <p className="text-lg sm:text-xl text-slate-300">Convert your points to USDC and withdraw to your wallet</p>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Star className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
            </div>
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Available Points</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{user.totalPoints.toLocaleString()}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
            </div>
            <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Available for Withdrawal</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400">${pointsToUSDC(user.totalPoints).toFixed(2)}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
              <Wallet className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
            </div>
            <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Wallet</p>
          <p className="text-base sm:text-lg font-bold text-white">
            {walletState.isConnected ? 'Connected' : 'Not Connected'}
          </p>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
            <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Withdraw Funds</h2>
        </div>

        {!walletState.isConnected ? (
          <div className="text-center py-6 sm:py-8">
            <Wallet className="w-12 sm:w-16 h-12 sm:h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-slate-400 text-sm sm:text-base">You need to connect your wallet to withdraw funds</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm sm:text-base">Exchange Rate</span>
              </div>
              <p className="text-blue-300 text-sm sm:text-base">100 points = 1 USDC</p>
              <p className="text-blue-300 text-xs sm:text-sm">Minimum withdrawal: {minWithdrawal} points</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Points to withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min={minWithdrawal}
                  max={user.totalPoints}
                  step={100}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-base sm:text-lg"
                  placeholder={`Minimum ${minWithdrawal} points`}
                />
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm sm:text-base">
                  points
                </div>
              </div>
              {withdrawAmount && (
                <p className="mt-2 text-emerald-400 font-semibold text-sm sm:text-base">
                  ≈ ${pointsToUSDC(parseInt(withdrawAmount) || 0).toFixed(2)} USDC
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              <button
                onClick={() => setWithdrawAmount(minWithdrawal.toString())}
                className="px-3 sm:px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base"
              >
                Minimum
              </button>
              <button
                onClick={() => setWithdrawAmount((Math.floor(user.totalPoints / 100) * 100).toString())}
                className="px-3 sm:px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base"
              >
                Maximum
              </button>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={
                isWithdrawing || 
                !withdrawAmount || 
                parseInt(withdrawAmount) < minWithdrawal || 
                parseInt(withdrawAmount) > user.totalPoints
              }
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isWithdrawing ? (
                <>
                  <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span>Withdraw USDC</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Withdrawal History */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Withdrawal History</h3>
        
        {withdrawalHistory.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Clock className="w-10 sm:w-12 h-10 sm:h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 text-sm sm:text-base">No withdrawal history</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {withdrawalHistory.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 space-y-3 sm:space-y-0"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className={`p-2 rounded-lg border ${getStatusColor(withdrawal.status)}`}>
                    {getStatusIcon(withdrawal.status)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {withdrawal.amount} points → ${withdrawal.usdcAmount} USDC
                    </p>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {new Date(withdrawal.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end space-x-3">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status === 'completed' ? 'Completed' :
                     withdrawal.status === 'pending' ? 'Processing' : 'Failed'}
                  </span>
                  {withdrawal.txHash && (
                    <a
                      href={`https://etherscan.io/tx/${withdrawal.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}