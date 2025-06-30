import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AirdropList from './components/AirdropList';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import RewardsPage from './components/RewardsPage';
import LeaderboardPage from './components/LeaderboardPage';
import FAQPage from './components/FAQPage';
import SecretAdminPanel from './components/SecretAdminPanel';
import TasksPage from './components/TasksPage';
import SettingsPage from './components/SettingsPage';
import UserProfile from './components/UserProfile';
import PermissionGuard from './components/PermissionGuard';
import { useApp } from './contexts/AppContext';

// Компонент для отображения задач конкретного аирдропа
function AirdropTasksRoute() {
  const { airdrops } = useApp();
  const [searchParams] = useSearchParams();
  const airdropId = searchParams.get('id');
  
  const airdrop = airdrops.find(a => a.id === airdropId);
  
  if (!airdrop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Airdrop not found</h1>
          <p className="text-slate-400 mb-6">The airdrop with ID "{airdropId}" does not exist</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
          >
            Back to Airdrops
          </button>
        </div>
      </div>
    );
  }
  
  return <TasksPage airdrop={airdrop} onBack={() => window.history.back()} />;
}

// Компонент для админ роутов
function AdminRoutes() {
  const { isAdmin, isAdminAuthenticated, setIsAdminAuthenticated, setIsAdmin } = useApp();
  const [searchParams] = useSearchParams();

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setIsAdmin(true);
    }
  };

  // Проверка секретного доступа
  React.useEffect(() => {
    if (searchParams.get('admin') === 'secret' && searchParams.get('key') === 'master2025') {
      return;
    }
  }, [searchParams]);

  // Показать секретную админ панель
  if (searchParams.get('admin') === 'secret' && searchParams.get('key') === 'master2025') {
    return (
      <PermissionGuard requiredRole="admin">
        <SecretAdminPanel />
      </PermissionGuard>
    );
  }

  // Показать логин если пытается зайти в админку но не авторизован
  if (isAdmin && !isAdminAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <PermissionGuard requiredRole="admin">
      <AdminPanel />
    </PermissionGuard>
  );
}

// Основной компонент приложения с роутингом
function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 lg:py-12 relative z-10">
        <Routes>
          <Route path="/" element={<AirdropList />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminRoutes />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/airdrop" element={<AirdropTasksRoute />} />
          {/* Redirect old dashboard route to profile */}
          <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

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
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;