import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { useWallet } from './hooks/useWallet';
import Header from './components/Header';
import AirdropList from './components/AirdropList';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import RewardsPage from './components/RewardsPage';
import LeaderboardPage from './components/LeaderboardPage';
import FAQPage from './components/FAQPage';
import SecretAdminPanel from './components/SecretAdminPanel';
import TasksPage from './components/TasksPage';
import SettingsPage from './components/SettingsPage';
import { Airdrop } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<'airdrops' | 'admin' | 'rewards' | 'leaderboard' | 'faq' | 'secret-admin' | 'tasks' | 'settings'>('airdrops');
  const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop | null>(null);
  const { isAdmin, isAdminAuthenticated, setIsAdminAuthenticated, setIsAdmin } = useApp();
  const { walletState } = useWallet();

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setIsAdmin(true);
      setCurrentView('admin');
    }
  };

  const handleViewTasks = (airdrop: Airdrop) => {
    setSelectedAirdrop(airdrop);
    setCurrentView('tasks');
  };

  // Check for secret admin access
  React.useEffect(() => {
    const checkSecretAccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'secret' && urlParams.get('key') === 'master2025') {
        setCurrentView('secret-admin');
      }
    };
    checkSecretAccess();
  }, []);

  // Show secret admin panel
  if (currentView === 'secret-admin') {
    return <SecretAdminPanel />;
  }

  // Show admin login if trying to access admin but not authenticated
  if (isAdmin && !isAdminAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 relative z-10">
        {currentView === 'airdrops' && <AirdropList onViewTasks={handleViewTasks} />}
        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'rewards' && <RewardsPage onBack={() => setCurrentView('airdrops')} />}
        {currentView === 'leaderboard' && <LeaderboardPage />}
        {currentView === 'faq' && <FAQPage />}
        {currentView === 'settings' && <SettingsPage />}
        {currentView === 'tasks' && selectedAirdrop && (
          <TasksPage 
            airdrop={selectedAirdrop} 
            onBack={() => {
              setCurrentView('airdrops');
              setSelectedAirdrop(null);
            }} 
          />
        )}
      </main>

      {/* Enhanced background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/8 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-yellow-500/5 rounded-full blur-xl animate-pulse delay-2000" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;