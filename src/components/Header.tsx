import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { useDesign } from '../contexts/DesignContext';
import { Settings, User, Coins, Shield, Wallet, LogOut, Gift, HelpCircle, Trophy, Menu, X, Palette } from 'lucide-react';

export default function Header() {
  const { user, isAdmin, setIsAdmin } = useApp();
  const { walletState, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const { currentTheme, themes } = useDesign();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const theme = themes.find(t => t.id === currentTheme) || themes[0];

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      navigate('/airdrops');
    } else {
      setIsAdmin(true);
      navigate('/admin');
    }
  };

  const navItems = [
    { path: '/airdrops', label: 'Airdrops', icon: Coins },
    { path: '/rewards', label: 'Rewards', icon: Gift },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    ...(isAdmin ? [
      { path: '/admin', label: 'Admin', icon: Shield }
    ] : [])
  ];

  const getButtonClass = (isActive: boolean) => {
    const baseClass = "px-4 xl:px-6 py-2 xl:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2";
    
    if (isActive) {
      switch (currentTheme) {
        case 'cosmic':
          return `${baseClass} bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105`;
        case 'neon':
          return `${baseClass} bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-500/25 scale-105`;
        case 'minimal':
          return `${baseClass} bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/25 scale-105`;
        case 'gradient':
          return `${baseClass} bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 scale-105`;
        default:
          return `${baseClass} bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105`;
      }
    } else {
      const textColor = currentTheme === 'minimal' ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white';
      const bgColor = currentTheme === 'minimal' ? 'hover:bg-slate-200/50' : 'hover:bg-slate-800/50';
      return `${baseClass} ${textColor} ${bgColor} backdrop-blur-sm`;
    }
  };

  const getConnectButtonClass = () => {
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

  const getHeaderBg = () => {
    switch (currentTheme) {
      case 'minimal':
        return 'bg-white/95 border-slate-200/50';
      default:
        return 'bg-slate-900/95 border-slate-700/50';
    }
  };

  const getTextColor = () => {
    return currentTheme === 'minimal' ? 'text-slate-900' : 'text-white';
  };

  return (
    <header className={`${getHeaderBg()} backdrop-blur-xl border-b sticky top-0 z-50 shadow-2xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/airdrops" className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br ${theme.colors.primary} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl`}>
                <Coins className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl sm:text-2xl font-bold ${getTextColor()}`}>
                AirdropHub
              </h1>
              <p className={`text-xs ${currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-400'} font-medium`}>
                Crypto Rewards Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getButtonClass(location.pathname === item.path)}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm xl:text-base">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 ${currentTheme === 'minimal' ? 'text-slate-700 hover:text-slate-900' : 'text-slate-400 hover:text-white'} transition-colors`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Wallet Connection */}
            {walletState.isConnected ? (
              <div className={`flex items-center space-x-3 ${currentTheme === 'minimal' ? 'bg-slate-100/50 border-slate-200/50' : 'bg-slate-800/50 border-slate-700/50'} backdrop-blur-sm border rounded-xl px-3 xl:px-4 py-2`}>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <div className="text-right">
                  <p className={`text-sm font-medium ${getTextColor()}`}>{formatAddress(walletState.address!)}</p>
                  <p className={`text-xs ${currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {parseFloat(walletState.balance!).toFixed(3)} ETH
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className={`p-1 ${currentTheme === 'minimal' ? 'text-slate-600 hover:text-red-600' : 'text-slate-400 hover:text-red-400'} transition-colors`}
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 ${getConnectButtonClass()} text-white rounded-xl transition-all duration-200`}
              >
                <Wallet className="w-4 h-4" />
                <span className="font-medium text-sm xl:text-base">Connect</span>
              </button>
            )}

            {/* Points Display */}
            {walletState.isConnected && (
              <div className={`flex items-center space-x-3 ${currentTheme === 'minimal' ? 'bg-slate-100/50 border-slate-200/50' : 'bg-slate-800/50 border-slate-700/50'} backdrop-blur-sm border rounded-xl px-3 xl:px-4 py-2`}>
                <div className="text-right">
                  <p className={`text-sm font-bold ${currentTheme === 'minimal' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                    {user.totalPoints}
                  </p>
                  <p className={`text-xs ${currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-400'}`}>Points</p>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Link
                to="/design"
                className={`p-2 xl:p-3 rounded-xl transition-all duration-300 ${
                  location.pathname === '/design'
                    ? `bg-gradient-to-r ${theme.colors.secondary} text-white shadow-lg scale-105`
                    : `${currentTheme === 'minimal' ? 'bg-slate-100/50 border-slate-200/50 text-slate-700 hover:text-slate-900 hover:border-slate-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600'} backdrop-blur-sm border`
                }`}
              >
                <Palette className="w-4 xl:w-5 h-4 xl:h-5" />
              </Link>

              <Link
                to="/settings"
                className={`p-2 xl:p-3 rounded-xl transition-all duration-300 ${
                  location.pathname === '/settings'
                    ? `bg-gradient-to-r ${theme.colors.secondary} text-white shadow-lg scale-105`
                    : `${currentTheme === 'minimal' ? 'bg-slate-100/50 border-slate-200/50 text-slate-700 hover:text-slate-900 hover:border-slate-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600'} backdrop-blur-sm border`
                }`}
              >
                <Settings className="w-4 xl:w-5 h-4 xl:h-5" />
              </Link>

              <button
                onClick={handleAdminToggle}
                className={`p-2 xl:p-3 rounded-xl transition-all duration-300 ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25 scale-105' 
                    : `${currentTheme === 'minimal' ? 'bg-slate-100/50 border-slate-200/50 text-slate-700 hover:text-slate-900 hover:border-slate-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600'} backdrop-blur-sm border`
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
          <div className={`lg:hidden border-t ${currentTheme === 'minimal' ? 'border-slate-200/50' : 'border-slate-700/50'} py-4`}>
            <div className="space-y-2 mb-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    location.pathname === item.path
                      ? `bg-gradient-to-r ${theme.colors.primary} text-white shadow-lg`
                      : `${currentTheme === 'minimal' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Wallet & Actions */}
            <div className={`space-y-3 pt-4 border-t ${currentTheme === 'minimal' ? 'border-slate-200/50' : 'border-slate-700/50'}`}>
              {walletState.isConnected ? (
                <div className={`${currentTheme === 'minimal' ? 'bg-slate-100/50' : 'bg-slate-800/50'} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`${getTextColor()} font-medium`}>{formatAddress(walletState.address!)}</p>
                      <p className={`${currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-400'} text-sm`}>
                        {parseFloat(walletState.balance!).toFixed(3)} ETH
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`${currentTheme === 'minimal' ? 'text-emerald-600' : 'text-emerald-400'} font-bold`}>
                        {user.totalPoints}
                      </p>
                      <p className={`${currentTheme === 'minimal' ? 'text-slate-600' : 'text-slate-400'} text-sm`}>Points</p>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className={`w-full py-2 ${currentTheme === 'minimal' ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-600 hover:bg-slate-700 text-white'} rounded-lg transition-colors flex items-center justify-center space-x-2`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className={`w-full py-3 ${getConnectButtonClass()} text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Connect Wallet</span>
                </button>
              )}

              <div className="flex space-x-2">
                <Link
                  to="/design"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    location.pathname === '/design'
                      ? `bg-gradient-to-r ${theme.colors.secondary} text-white shadow-lg`
                      : `${currentTheme === 'minimal' ? 'bg-slate-100/50 text-slate-700 hover:text-slate-900' : 'bg-slate-800/50 text-slate-300 hover:text-white'}`
                  }`}
                >
                  <Palette className="w-5 h-5" />
                  <span>Design</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    location.pathname === '/settings'
                      ? `bg-gradient-to-r ${theme.colors.secondary} text-white shadow-lg`
                      : `${currentTheme === 'minimal' ? 'bg-slate-100/50 text-slate-700 hover:text-slate-900' : 'bg-slate-800/50 text-slate-300 hover:text-white'}`
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => {
                    handleAdminToggle();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isAdmin 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25' 
                      : `${currentTheme === 'minimal' ? 'bg-slate-100/50 text-slate-700 hover:text-slate-900' : 'bg-slate-800/50 text-slate-300 hover:text-white'}`
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