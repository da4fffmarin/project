import React, { useState, useEffect } from 'react';
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
  Globe,
  Download,
  Gift
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
  const { user, withdrawPoints, withdrawalHistory, addWithdrawal, updateWithdrawal } = useApp();
  const { walletState } = useWallet();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(SUPPORTED_NETWORKS[1]); // Polygon по умолчанию
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [claimingWithdrawals, setClaimingWithdrawals] = useState<Set<string>>(new Set());
  const [processingWithdrawals, setProcessingWithdrawals] = useState<Set<string>>(new Set());

  const pointsToUSDC = (points: number) => points / 100;
  const minWithdrawal = 100;

  // Автоматическое обновление статуса выводов
  useEffect(() => {
    const interval = setInterval(() => {
      const pendingWithdrawals = withdrawalHistory.filter(w => 
        w.status === 'pending' && !processingWithdrawals.has(w.id)
      );
      
      pendingWithdrawals.forEach(withdrawal => {
        const withdrawalTime = new Date(withdrawal.timestamp).getTime();
        const currentTime = Date.now();
        const timeDiff = currentTime - withdrawalTime;
        
        // Обновляем статус через 3-5 секунд после создания
        if (timeDiff >= 3000) {
          setProcessingWithdrawals(prev => new Set(prev).add(withdrawal.id));
          
          setTimeout(() => {
            updateWithdrawal(withdrawal.id, {
              status: 'completed',
              txHash: `0x${Math.random().toString(16).substr(2, 64)}` // Генерируем фейковый хеш транзакции
            });
            
            setProcessingWithdrawals(prev => {
              const newSet = new Set(prev);
              newSet.delete(withdrawal.id);
              return newSet;
            });
          }, Math.random() * 2000 + 1000); // Случайная задержка 1-3 секунды
        }
      });
    }, 1000); // Проверяем каждую секунду

    return () => clearInterval(interval);
  }, [withdrawalHistory, updateWithdrawal, processingWithdrawals]);

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

  const handleClaim = async (withdrawalId: string) => {
    setClaimingWithdrawals(prev => new Set(prev).add(withdrawalId));
    
    // Simulate claiming process
    setTimeout(() => {
      // В реальном приложении здесь была бы отправка токенов на кошелек
      setClaimingWithdrawals(prev => {
        const newSet = new Set(prev);
        newSet.delete(withdrawalId);
        return newSet;
      });
      
      // Показываем уведомление об успешном получении
      alert('🎉 Tokens successfully sent to your wallet!');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Compact Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-2xl shadow-emerald-500/25 relative">
          <Coins className="w-8 h-8 text-white" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Star className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          Rewards <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Center</span>
        </h1>
        <p className="text-lg text-slate-300">
          Convert your earned points to USDC and withdraw to any supported network
        </p>
      </div>

      {/* Compact Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Available</span>
            </div>
          </div>
          <p className="text-slate-400 mb-1">Your Points</p>
          <p className="text-3xl font-bold text-white mb-2">{user.totalPoints.toLocaleString()}</p>
          <div className="flex items-center space-x-2">
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-emerald-400 font-semibold">${pointsToUSDC(user.totalPoints).toFixed(2)} USDC</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Ready</span>
            </div>
          </div>
          <p className="text-slate-400 mb-1">Withdrawable</p>
          <p className="text-3xl font-bold text-emerald-400 mb-2">${pointsToUSDC(user.totalPoints).toFixed(2)}</p>
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">Min: ${(minWithdrawal / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Compact Withdrawal Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
            <p className="text-slate-400">Convert points to USDC and withdraw to your wallet</p>
          </div>
        </div>

        {!walletState.isConnected ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-2xl mb-4">
              <Wallet className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-slate-400">You need to connect your wallet to withdraw funds</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Exchange Rate Info */}
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Exchange Rate</h3>
                    <p className="text-blue-300 text-sm">100 points = 1 USDC • Min withdrawal: {minWithdrawal} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-400">1:100</p>
                  <p className="text-blue-300 text-xs">USDC:Points</p>
                </div>
              </div>
            </div>

            {/* Network Selection */}
            <div>
              <label className="block text-base font-semibold text-white mb-3">
                Select Network
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{selectedNetwork.icon}</div>
                    <div className="text-left">
                      <p className="font-semibold">{selectedNetwork.name}</p>
                      <p className="text-slate-400 text-sm">Fee: {selectedNetwork.fee} • Time: {selectedNetwork.time}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showNetworkSelector ? 'rotate-180' : ''}`} />
                </button>

                {showNetworkSelector && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-10 overflow-hidden">
                    {SUPPORTED_NETWORKS.map((network) => (
                      <button
                        key={network.id}
                        onClick={() => {
                          setSelectedNetwork(network);
                          setShowNetworkSelector(false);
                        }}
                        className="w-full p-3 hover:bg-slate-700/50 transition-colors flex items-center space-x-3 border-b border-slate-700/30 last:border-b-0"
                      >
                        <div className="text-xl">{network.icon}</div>
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
              <label className="block text-base font-semibold text-white mb-3">
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
                  className="w-full pl-4 pr-16 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-xl font-bold"
                  placeholder={`Min ${minWithdrawal}`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-semibold">
                  points
                </div>
              </div>
              
              {withdrawAmount && (
                <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-300">You will receive:</span>
                    <span className="text-xl font-bold text-emerald-400">
                      ${pointsToUSDC(parseInt(withdrawAmount) || 0).toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-sm">
                    <span className="text-emerald-400">Network:</span>
                    <span className="text-emerald-300">{selectedNetwork.name}</span>
                  </div>
                </div>
              )}

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount.label}
                    onClick={() => setWithdrawAmount(amount.value.toString())}
                    disabled={amount.value > user.totalPoints}
                    className="px-3 py-2 bg-slate-600/50 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                  >
                    {amount.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-semibold text-sm mb-1">Security Notice</h4>
                  <p className="text-blue-300 text-xs">
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
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] flex items-center justify-center space-x-3"
            >
              {isWithdrawing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Withdrawal...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  <span>Withdraw to {selectedNetwork.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Compact Withdrawal History */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Withdrawal History</h3>
            <p className="text-slate-400">Track your withdrawal transactions</p>
          </div>
        </div>
        
        {withdrawalHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-2xl mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">No Withdrawals Yet</h4>
            <p className="text-slate-400">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawalHistory.map((withdrawal) => {
              const isClaiming = claimingWithdrawals.has(withdrawal.id);
              
              return (
                <div
                  key={withdrawal.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 space-y-3 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-white font-bold">
                          {withdrawal.amount.toLocaleString()} points
                        </p>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <p className="text-emerald-400 font-bold">
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
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status === 'completed' ? 'Completed' :
                       withdrawal.status === 'pending' ? 'Processing' : 'Failed'}
                    </span>
                    
                    {/* Claim Button - показывается только для completed статуса */}
                    {withdrawal.status === 'completed' && (
                      <button
                        onClick={() => handleClaim(withdrawal.id)}
                        disabled={isClaiming}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg shadow-emerald-500/25 text-sm"
                      >
                        {isClaiming ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Claiming...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            <span>Claim</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {withdrawal.txHash && (
                      <a
                        href={`https://etherscan.io/tx/${withdrawal.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        title="View on Explorer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}