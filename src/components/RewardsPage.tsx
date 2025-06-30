import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { 
  Coins, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Zap,
  ChevronDown,
  Wallet,
  ArrowRight,
  Info,
  Shield,
  Globe
} from 'lucide-react';

// Поддерживаемые сети для вывода
const SUPPORTED_NETWORKS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '🔷',
    color: 'from-blue-500 to-blue-600',
    fee: '~$5-15',
    time: '1-5 min'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '🟣',
    color: 'from-purple-500 to-purple-600',
    fee: '~$0.01',
    time: '30 sec'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    icon: '🔵',
    color: 'from-blue-400 to-cyan-500',
    fee: '~$0.50',
    time: '1-2 min'
  },
  {
    id: 'bsc',
    name: 'BSC',
    symbol: 'BNB',
    icon: '🟡',
    color: 'from-yellow-500 to-orange-500',
    fee: '~$0.20',
    time: '30 sec'
  }
];

export default function RewardsPage() {
  const { user, withdrawPoints, withdrawalHistory, addWithdrawal } = useApp();
  const { walletState } = useWallet();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(SUPPORTED_NETWORKS[1]); // Polygon по умолчанию
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

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

  const quickAmounts = [
    { label: 'Min', value: minWithdrawal },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
    { label: 'Max', value: Math.floor(user.totalPoints / 100) * 100 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Enhanced Header */}
      <div className="text-center mb-8 sm:mb-12 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/25 relative">
          <Coins className="w-10 h-10 text-white" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Star className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Rewards <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Center</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Convert your earned points to USDC and withdraw to any supported network
        </p>
      </div>

      {/* Enhanced Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur opacity-30" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl">
                <Star className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Available</span>
              </div>
            </div>
            <p className="text-slate-400 text-lg mb-2">Your Points</p>
            <p className="text-4xl font-bold text-white mb-4">{user.totalPoints.toLocaleString()}</p>
            <div className="flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-emerald-400 font-semibold">${pointsToUSDC(user.totalPoints).toFixed(2)} USDC</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur opacity-30" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Ready</span>
              </div>
            </div>
            <p className="text-slate-400 text-lg mb-2">Withdrawable</p>
            <p className="text-4xl font-bold text-emerald-400 mb-4">${pointsToUSDC(user.totalPoints).toFixed(2)}</p>
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Min: ${(minWithdrawal / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Withdrawal Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 mb-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl">
              <Wallet className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
              <p className="text-slate-400">Convert points to USDC and withdraw to your wallet</p>
            </div>
          </div>

          {!walletState.isConnected ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-3xl mb-6">
                <Wallet className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Connect Your Wallet</h3>
              <p className="text-slate-400 text-lg">You need to connect your wallet to withdraw funds</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Exchange Rate Info */}
              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Exchange Rate</h3>
                      <p className="text-blue-300">100 points = 1 USDC • Min withdrawal: {minWithdrawal} points</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">1:100</p>
                    <p className="text-blue-300 text-sm">USDC:Points</p>
                  </div>
                </div>
              </div>

              {/* Network Selection */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Select Network
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                    className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{selectedNetwork.icon}</div>
                      <div className="text-left">
                        <p className="font-semibold">{selectedNetwork.name}</p>
                        <p className="text-slate-400 text-sm">Fee: {selectedNetwork.fee} • Time: {selectedNetwork.time}</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showNetworkSelector ? 'rotate-180' : ''}`} />
                  </button>

                  {showNetworkSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-10 overflow-hidden">
                      {SUPPORTED_NETWORKS.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => {
                            setSelectedNetwork(network);
                            setShowNetworkSelector(false);
                          }}
                          className="w-full p-4 hover:bg-slate-700/50 transition-colors flex items-center space-x-4 border-b border-slate-700/30 last:border-b-0"
                        >
                          <div className="text-2xl">{network.icon}</div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-white">{network.name}</p>
                            <p className="text-slate-400 text-sm">Fee: {network.fee} • Time: {network.time}</p>
                          </div>
                          {selectedNetwork.id === network.id && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min={minWithdrawal}
                    max={user.totalPoints}
                    step={100}
                    className="w-full pl-6 pr-20 py-6 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-2xl font-bold"
                    placeholder={`Min ${minWithdrawal}`}
                  />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg font-semibold">
                    points
                  </div>
                </div>
                
                {withdrawAmount && (
                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300">You will receive:</span>
                      <span className="text-2xl font-bold text-emerald-400">
                        ${pointsToUSDC(parseInt(withdrawAmount) || 0).toFixed(2)} USDC
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-emerald-400">Network:</span>
                      <span className="text-emerald-300">{selectedNetwork.name}</span>
                    </div>
                  </div>
                )}

                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount.label}
                      onClick={() => setWithdrawAmount(amount.value.toString())}
                      disabled={amount.value > user.totalPoints}
                      className="px-4 py-2 bg-slate-600/50 text-white rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {amount.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-1">Security Notice</h4>
                    <p className="text-blue-300 text-sm">
                      Withdrawals are processed securely. Make sure your wallet address is correct before confirming.
                    </p>
                  </div>
                </div>
              </div>

              {/* Withdraw Button */}
              <button
                onClick={handleWithdraw}
                disabled={
                  isWithdrawing || 
                  !withdrawAmount || 
                  parseInt(withdrawAmount) < minWithdrawal || 
                  parseInt(withdrawAmount) > user.totalPoints
                }
                className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] flex items-center justify-center space-x-3"
              >
                {isWithdrawing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Withdrawal...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-6 h-6" />
                    <span>Withdraw to {selectedNetwork.name}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Withdrawal History */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Withdrawal History</h3>
            <p className="text-slate-400">Track your withdrawal transactions</p>
          </div>
        </div>
        
        {withdrawalHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-3xl mb-6">
              <Clock className="w-10 h-10 text-slate-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">No Withdrawals Yet</h4>
            <p className="text-slate-400">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawalHistory.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 space-y-4 sm:space-y-0"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl border ${getStatusColor(withdrawal.status)}`}>
                    {getStatusIcon(withdrawal.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <p className="text-white font-bold text-lg">
                        {withdrawal.amount.toLocaleString()} points
                      </p>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <p className="text-emerald-400 font-bold text-lg">
                        ${withdrawal.usdcAmount.toFixed(2)} USDC
                      </p>
                    </div>
                    <p className="text-slate-400 text-sm">
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
                
                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status === 'completed' ? 'Completed' :
                     withdrawal.status === 'pending' ? 'Processing' : 'Failed'}
                  </span>
                  {withdrawal.txHash && (
                    <a
                      href={`https://etherscan.io/tx/${withdrawal.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      title="View on Explorer"
                    >
                      <ExternalLink className="w-5 h-5" />
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