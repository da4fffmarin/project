import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'super_admin';
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

export default function PermissionGuard({ 
  children, 
  requiredRole = 'user', 
  fallback,
  showMessage = true 
}: PermissionGuardProps) {
  const { user, isAdmin, isAdminAuthenticated } = useApp();

  const hasPermission = () => {
    switch (requiredRole) {
      case 'user':
        return true; // Все пользователи имеют базовые права
      case 'admin':
        return isAdmin && isAdminAuthenticated;
      case 'super_admin':
        return isAdmin && isAdminAuthenticated && user.id === 'super_admin';
      default:
        return false;
    }
  };

  if (!hasPermission()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showMessage) {
      return null;
    }

    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Доступ ограничен</h2>
          <p className="text-slate-400 mb-6">
            {requiredRole === 'admin' 
              ? 'Эта страница доступна только администраторам'
              : 'У вас недостаточно прав для просмотра этого контента'
            }
          </p>
          <div className="flex items-center justify-center space-x-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Требуется роль: {requiredRole}</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}