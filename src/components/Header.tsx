import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Settings, User, Coins, Shield, Wallet, LogOut, Gift, HelpCircle, Trophy, Menu, X } from 'lucide-react';

export default function Header() {
  const { user, isAdmin, setIsAdmin } = useApp();
  const { walletState, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      navigate('/');
    } else {
      setIsAdmin(true);
      navigate('/admin');
    }
  };

  const navItems = [
    { id: '/', label: 'Airdrops', icon: Coins },
    { id: '/rewards', label: 'Rewards', icon: Gift },
    { id: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: '/faq', label: 'FAQ', icon: HelpCircle },
    ...(isAdmin ? [
      { id: '/admin', label: 'Admin', icon: Shield }
    ] : [])
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl shadow-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <Coins className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                AirdropHub
              </h1>
              <p className="text-xs text-slate-400 font-medium">Crypto Rewards Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-4 xl:px-6 py-2 xl:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  isCurrentPath(item.id)
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm xl:text-base">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Wallet Connection */}
            {walletState.isConnected ? (
              <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-3 xl:px-4 py-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{formatAddress(walletState.address!)}</p>
                  <p className="text-xs text-slate-400">{parseFloat(walletState.balance!).toFixed(3)} ETH</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center space-x-2 px-3 xl:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                <Wallet className="w-4 h-4" />
                <span className="font-medium text-sm xl:text-base">Connect</span>
              </button>
            )}

            {/* Points Display */}
            {walletState.isConnected && (
              <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-3 xl:px-4 py-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">{user.totalPoints}</p>
                  <p className="text-xs text-slate-400">Points</p>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/settings')}
                className={`p-2 xl:p-3 rounded-xl transition-all duration-300 ${
                  isCurrentPath('/settings')
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                <Settings className="w-4 xl:w-5 h-4 xl:h-5" />
              </button>

              <button
                onClick={handleAdminToggle}
                className={`p-2 xl:p-3 rounded-xl transition-all duration-300 ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25 scale-105' 
                    : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
                title={isAdmin ? 'Admin Mode' : 'User Mode'}
              >
                {isAdmin ? <Shield className="w-4 xl:w-5 h-4 xl:h-5" /> : <User className="w-4 xl:w-5 h-4 xl:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 py-4">
            <div className="space-y-2 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isCurrentPath(item.id)
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Wallet & Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-700/50">
              {walletState.isConnected ? (
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{formatAddress(walletState.address!)}</p>
                      <p className="text-slate-400 text-sm">{parseFloat(walletState.balance!).toFixed(3)} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">{user.totalPoints}</p>
                      <p className="text-slate-400 text-sm">Points</p>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Connect Wallet</span>
                </button>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isCurrentPath('/settings')
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800/50 text-slate-300 hover:text-white'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    handleAdminToggle();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isAdmin 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25' 
                      : 'bg-slate-800/50 text-slate-300 hover:text-white'
                  }`}
                >
                  {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  <span>{isAdmin ? 'Admin' : 'User'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}