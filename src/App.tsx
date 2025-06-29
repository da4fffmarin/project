import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { DesignProvider } from './contexts/DesignContext';
import Layout from './components/Layout';
import AirdropList from './components/AirdropList';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import RewardsPage from './components/RewardsPage';
import LeaderboardPage from './components/LeaderboardPage';
import FAQPage from './components/FAQPage';
import SecretAdminPanel from './components/SecretAdminPanel';
import TasksPage from './components/TasksPage';
import SettingsPage from './components/SettingsPage';
import DesignSelector from './components/DesignSelector';
import NotFoundPage from './components/NotFoundPage';
import { Airdrop } from './types';

function App() {
  return (
    <AppProvider>
      <DesignProvider>
        <Router>
          <Routes>
            {/* Main routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/airdrops" replace />} />
              <Route path="airdrops" element={<AirdropList />} />
              <Route path="airdrops/:id" element={<TasksPageWrapper />} />
              <Route path="rewards" element={<RewardsPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="design" element={<DesignSelector />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoutes />} />
            
            {/* Secret admin panel */}
            <Route path="/secret-admin" element={<SecretAdminPanel />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </DesignProvider>
    </AppProvider>
  );
}

// Wrapper component for tasks page to handle airdrop selection
function TasksPageWrapper() {
  const { id } = useParams();
  const { airdrops } = useApp();
  const navigate = useNavigate();
  
  const airdrop = airdrops.find(a => a.id === id);
  
  if (!airdrop) {
    return <Navigate to="/airdrops" replace />;
  }
  
  return (
    <TasksPage 
      airdrop={airdrop} 
      onBack={() => navigate('/airdrops')} 
    />
  );
}

// Admin routes component
function AdminRoutes() {
  const { isAdmin, isAdminAuthenticated, setIsAdminAuthenticated, setIsAdmin } = useApp();
  
  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setIsAdmin(true);
    }
  };

  if (isAdmin && !isAdminAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (!isAdmin) {
    return <Navigate to="/airdrops" replace />;
  }

  return <AdminPanel />;
}

export default App;