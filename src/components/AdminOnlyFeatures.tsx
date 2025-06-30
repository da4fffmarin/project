import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Shield, Users, BarChart3, Settings, Database, Crown } from 'lucide-react';

interface AdminFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  requiredRole: 'admin' | 'super_admin';
}

export default function AdminOnlyFeatures() {
  const { isAdmin, isAdminAuthenticated } = useApp();

  if (!isAdmin || !isAdminAuthenticated) {
    return null;
  }

  const adminFeatures: AdminFeature[] = [
    {
      id: 'user_management',
      title: 'Управление пользователями',
      description: 'Просмотр и редактирование профилей пользователей',
      icon: Users,
      path: '/admin/users',
      color: 'from-blue-500 to-cyan-600',
      requiredRole: 'admin'
    },
    {
      id: 'analytics',
      title: 'Расширенная аналитика',
      description: 'Подробная статистика и отчеты',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'from-purple-500 to-pink-600',
      requiredRole: 'admin'
    },
    {
      id: 'system_settings',
      title: 'Системные настройки',
      description: 'Конфигурация платформы и параметров',
      icon: Settings,
      path: '/admin/system',
      color: 'from-emerald-500 to-teal-600',
      requiredRole: 'admin'
    },
    {
      id: 'database_management',
      title: 'Управление БД',
      description: 'Резервное копирование и миграции',
      icon: Database,
      path: '/admin/database',
      color: 'from-yellow-500 to-orange-600',
      requiredRole: 'super_admin'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {adminFeatures.map((feature) => (
        <div
          key={feature.id}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                {feature.requiredRole === 'super_admin' && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <p className="text-slate-400 text-sm">{feature.description}</p>
              <div className="mt-3">
                <span className="text-xs text-purple-400 font-medium">
                  Только для {feature.requiredRole === 'super_admin' ? 'супер-админов' : 'администраторов'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}