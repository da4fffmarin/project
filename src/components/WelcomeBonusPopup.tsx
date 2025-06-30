import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { 
  Gift, 
  X, 
  Wallet, 
  Star, 
  Sparkles, 
  Coins, 
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function WelcomeBonusPopup() {
  const { user, updateUser } = useApp();
  const { walletState, connectWallet, isConnecting } = useWallet();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<'welcome' | 'connecting' | 'success'>('welcome');
  const [hasClaimedBonus, setHasClaimedBonus] = useState(false);

  const WELCOME_BONUS = 100; // Приветственный бонус в поинтах

  useEffect(() => {
    // Показываем popup только если:
    // 1. Кошелек не подключен
    // 2. Пользователь еще не получал приветственный бонус
    // 3. Popup не был закрыт в этой сессии
    const hasSeenPopup = sessionStorage.getItem('welcomePopupSeen');
    const hasWelcomeBonus = localStorage.getItem('welcomeBonusClaimed');
    
    if (!walletState.isConnected && !hasSeenPopup && !hasWelcomeBonus) {
      // Показываем popup через 2 секунды после загрузки
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [walletState.isConnected]);

  useEffect(() => {
    // Когда кошелек подключается, переходим к успешному шагу
    if (walletState.isConnected && step === 'connecting') {
      setStep('success');
      claimWelcomeBonus();
    }
  }, [walletState.isConnected, step]);

  const claimWelcomeBonus = () => {
    if (!hasClaimedBonus) {
      const updatedUser = {
        ...user,
        totalPoints: user.totalPoints + WELCOME_BONUS,
        walletAddress: walletState.address || user.walletAddress
      };
      updateUser(updatedUser);
      setHasClaimedBonus(true);
      localStorage.setItem('welcomeBonusClaimed', 'true');
    }
  };

  const handleConnectWallet = async () => {
    setStep('connecting');
    await connectWallet();
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('welcomePopupSeen', 'true');
  };

  const handleComplete = () => {
    setIsVisible(false);
    sessionStorage.setItem('welcomePopupSeen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Popup */}
      <div className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-emerald-500/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-emerald-500/5 rounded-full blur-lg animate-pulse delay-500" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-8">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center">
              {/* Icon with glow effect */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full blur-lg opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Gift className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                🎉 Welcome Bonus!
              </h2>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                Get started with <span className="text-emerald-400 font-bold">{WELCOME_BONUS} FREE points</span> when you connect your wallet!
              </p>

              {/* Bonus features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-white text-sm">Instant {WELCOME_BONUS} points bonus</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white text-sm">Access to exclusive airdrops</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white text-sm">Earn rewards from top projects</span>
                </div>
              </div>

              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full py-4 bg-gradient-to-r from-purple-500 via-blue-600 to-emerald-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:via-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center justify-center space-x-3 text-lg"
              >
                <Wallet className="w-6 h-6" />
                <span>Connect Wallet & Claim Bonus</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-slate-500 text-xs mt-4">
                Safe & secure • Your keys, your crypto
              </p>
            </div>
          )}

          {/* Connecting Step */}
          {step === 'connecting' && (
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Connecting Wallet...
              </h2>
              
              <p className="text-slate-300 mb-6">
                Please approve the connection in your wallet
              </p>

              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg opacity-30 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                🎉 Bonus Claimed!
              </h2>
              
              <p className="text-slate-300 mb-6">
                Congratulations! You've received <span className="text-emerald-400 font-bold">{WELCOME_BONUS} points</span>
              </p>

              {/* Success stats */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">+{WELCOME_BONUS}</p>
                    <p className="text-emerald-300 text-sm">Points Added</p>
                  </div>
                  <div className="w-px h-12 bg-emerald-500/30" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">${(WELCOME_BONUS / 100).toFixed(2)}</p>
                    <p className="text-emerald-300 text-sm">USDC Value</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/25"
              >
                Start Earning More!
              </button>

              <p className="text-slate-400 text-sm mt-4">
                Ready to explore airdrops and earn more rewards?
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}