import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { Settings, User, Coins, Wallet, LogOut, Gift, HelpCircle, Trophy, Menu, X, Home, Star, Copy, Sparkles, Zap } from 'lucide-react';

export default function Header() {
  const { user, isAdmin, setIsAdmin } = useApp();
  const { walletState, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
    }
  };

  // Простая навигация для обычных пользователей (убрали кнопку админ панели)
  const userNavItems = [
    { id: '/', label: 'Airdrops', icon: Home },
    { id: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: '/faq', label: 'FAQ', icon: HelpCircle }
  ];

  // Навигация для админов
  const adminNavItems = [
    { id: '/', label: 'Airdrops', icon: Coins },
    { id: '/admin', label: 'Admin Panel', icon: Settings }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isCurrentPath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path;
  };

  // Функция для перехода к rewards через клик на поинты
  const handlePointsClick = () => {
    if (walletState.isConnected) {
      navigate('/rewards');
    }
  };

  return (
    <header className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-0 left-3/4 w-16 h-16 bg-emerald-500/3 rounded-full blur-lg animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-600 to-emerald-500 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              
              {/* Main logo */}
              <div className="relative w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                <Coins className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
              </div>
              
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-emerald-400 rounded-full animate-pulse">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-blue-300 group-hover:to-emerald-300 transition-all duration-300">
                AirdropHub
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-slate-400 font-medium">
                  Free Crypto Rewards
                </p>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                  <span className="text-xs text-yellow-400 font-semibold">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`group relative px-3 xl:px-4 py-2 xl:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 text-sm xl:text-base overflow-hidden ${
                  isCurrentPath(item.id)
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm'
                }`}
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <item.icon className="w-4 h-4 relative z-10" />
                <span className="hidden xl:inline relative z-10">{item.label}</span>
                
                {/* Active indicator */}
                {isCurrentPath(item.id) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors relative"
          >
            <div className="relative">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              {!mobileMenuOpen && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              )}
            </div>
          </button>

          {/* Enhanced Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Enhanced Wallet & Points & Profile Block */}
            {walletState.isConnected ? (
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-3 xl:px-4 py-2 group-hover:border-slate-600/50 transition-all duration-300">
                  {/* Status indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="text-emerald-400 text-xs font-medium">LIVE</span>
                  </div>
                  
                  {/* Wallet Address */}
                  <div className="text-center">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-white">{formatAddress(walletState.address!)}</p>
                      <button
                        onClick={copyAddress}
                        className="relative p-1 text-slate-400 hover:text-white transition-colors group/copy"
                        title="Copy address"
                      >
                        <Copy className="w-3 h-3 group-hover/copy:scale-110 transition-transform duration-200" />
                        {showCopyTooltip && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-700 text-white text-xs rounded whitespace-nowrap animate-fade-in">
                            Copied!
                          </div>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">Connected</p>
                  </div>

                  {/* Elegant Separator */}
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

                  {/* Enhanced Points Display - Clickable */}
                  <button
                    onClick={handlePointsClick}
                    className="text-center group/points hover:scale-105 transition-transform duration-200"
                    title="View Rewards"
                  >
                    <div className="flex items-center space-x-1">
                      <div className="relative">
                        <Star className="w-3 h-3 text-emerald-400 group-hover/points:text-yellow-400 transition-colors duration-200" />
                        <div className="absolute inset-0 animate-pulse">
                          <Star className="w-3 h-3 text-emerald-300 opacity-50" />
                        </div>
                      </div>
                      <p className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent group-hover/points:from-yellow-400 group-hover/points:to-orange-400 transition-all duration-200">
                        {user.totalPoints.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs text-emerald-300 group-hover/points:text-yellow-300 transition-colors duration-200">Points</p>
                  </button>

                  {/* Elegant Separator */}
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

                  {/* Profile Button - только для обычных пользователей */}
                  {!isAdmin && (
                    <button
                      onClick={() => navigate('/profile')}
                      className={`group/profile relative p-2 rounded-lg transition-all duration-300 overflow-hidden ${
                        isCurrentPath('/profile')
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                      title="Profile"
                    >
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-300" />
                      <User className="w-4 h-4 relative z-10" />
                    </button>
                  )}

                  {/* Settings Button - только для админов */}
                  {isAdmin && (
                    <button
                      onClick={() => navigate('/settings')}
                      className={`group/settings relative p-2 rounded-lg transition-all duration-300 overflow-hidden ${
                        isCurrentPath('/settings')
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                      title="Settings"
                    >
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover/settings:opacity-100 transition-opacity duration-300" />
                      <Settings className="w-4 h-4 relative z-10" />
                    </button>
                  )}

                  {/* Disconnect Button */}
                  <button
                    onClick={disconnectWallet}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors group/disconnect"
                    title="Disconnect Wallet"
                  >
                    <LogOut className="w-4 h-4 group-hover/disconnect:scale-110 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="group relative overflow-hidden flex items-center space-x-2 px-3 xl:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <Wallet className="w-4 h-4 relative z-10" />
                <span className="font-medium text-sm xl:text-base relative z-10">Connect</span>
              </button>
            )}

            {/* Скрытая кнопка переключения админ режима (только по секретному URL) */}
            {window.location.search.includes('admin=secret') && (
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`group relative p-2 xl:p-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25 scale-105' 
                    : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
                title={isAdmin ? 'Admin Mode' : 'User Mode'}
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isAdmin ? <Settings className="w-4 xl:w-5 h-4 xl:h-5 relative z-10" /> : <User className="w-4 xl:w-5 h-4 xl:h-5 relative z-10" />}
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 py-4 relative">
            {/* Background blur */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-b-2xl" />
            
            <div className="relative space-y-2 mb-4">
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
                  {isCurrentPath(item.id) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Enhanced Mobile Wallet & Actions */}
            <div className="relative space-y-3 pt-4 border-t border-slate-700/50">
              {walletState.isConnected ? (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">{formatAddress(walletState.address!)}</p>
                        <button
                          onClick={copyAddress}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <p className="text-slate-400 text-sm">Connected</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handlePointsClick();
                        setMobileMenuOpen(false);
                      }}
                      className="text-right group"
                    >
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-emerald-400 group-hover:text-yellow-400 transition-colors" />
                        <p className="text-emerald-400 font-bold group-hover:text-yellow-400 transition-colors">{user.totalPoints.toLocaleString()}</p>
                      </div>
                      <p className="text-slate-400 text-sm group-hover:text-yellow-300 transition-colors">Points</p>
                    </button>
                  </div>
                  
                  {/* Mobile Profile/Settings and Disconnect buttons */}
                  <div className="flex space-x-2">
                    {!isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setMobileMenuOpen(false);
                        }}
                        className={`flex-1 py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                          isCurrentPath('/profile')
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setMobileMenuOpen(false);
                        }}
                        className={`flex-1 py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                          isCurrentPath('/settings')
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    )}

                    <button
                      onClick={disconnectWallet}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
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

              {/* Скрытая кнопка переключения админ режима в мобильном меню */}
              {window.location.search.includes('admin=secret') && (
                <button
                  onClick={() => {
                    setIsAdmin(!isAdmin);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isAdmin 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25' 
                      : 'bg-slate-800/50 text-slate-300 hover:text-white'
                  }`}
                >
                  {isAdmin ? <Settings className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  <span>{isAdmin ? 'Admin Mode' : 'User Mode'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}