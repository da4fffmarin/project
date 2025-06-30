import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { 
  User, 
  Trophy, 
  Star, 
  TrendingUp, 
  Calendar, 
  Gift,
  Target,
  Zap,
  ArrowRight,
  Wallet,
  Bell
} from 'lucide-react';

export default function UserDashboard() {
  const { user, airdrops } = useApp();
  const { walletState } = useWallet();
  const navigate = useNavigate();

  const completedAirdrops = Object.keys(user.completedTasks).length;
  const totalTasks = Object.values(user.completedTasks).flat().length;
  const activeAirdrops = airdrops.filter(a => a.status === 'active').length;

  const quickActions = [
    {
      title: 'Мой профиль',
      description: 'Просмотр и редактирование профиля',
      icon: User,
      color: 'from-blue-500 to-cyan-600',
      path: '/profile',
      action: () => navigate('/profile')
    },
    {
      title: 'Активные аирдропы',
      description: `${activeAirdrops} доступных аирдропов`,
      icon: Gift,
      color: 'from-purple-500 to-pink-600',
      path: '/',
      action: () => navigate('/')
    },
    {
      title: 'Мои награды',
      description: `${user.totalPoints} поинтов заработано`,
      icon: Trophy,
      color: 'from-emerald-500 to-teal-600',
      path: '/rewards',
      action: () => navigate('/rewards')
    },
    {
      title: 'Таблица лидеров',
      description: 'Посмотреть свой рейтинг',
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-600',
      path: '/leaderboard',
      action: () => navigate('/leaderboard')
    }
  ];

  const recentActivity = [
    {
      type: 'task_completed',
      title: 'Задача выполнена',
      description: 'Join Telegram в DefiSwap',
      points: 50,
      time: '2 часа назад'
    },
    {
      type: 'airdrop_joined',
      title: 'Новый аирдроп',
      description: 'Присоединились к MetaChain Gaming',
      points: 0,
      time: '1 день назад'
    },
    {
      type: 'reward_earned',
      title: 'Награда получена',
      description: 'Выполнены все задачи в NFT Marketplace',
      points: 200,
      time: '3 дня назад'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 border border-purple-500/20 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Добро пожаловать, {user.walletAddress ? 
                `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                'Пользователь'
              }!
            </h1>
            <p className="text-slate-300 text-lg">
              {walletState.isConnected ? 
                'Готовы зарабатывать больше поинтов?' : 
                'Подключите кошелек, чтобы начать участвовать в аирдропах'
              }
            </p>
          </div>
          
          {!walletState.isConnected && (
            <button
              onClick={() => navigate('/')}
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Wallet className="w-5 h-5" />
              <span>Подключить кошелек</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.totalPoints}</p>
              <p className="text-slate-400 text-sm">Поинты</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedAirdrops}</p>
              <p className="text-slate-400 text-sm">Аирдропы</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-emerald-400/10 rounded-lg">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalTasks}</p>
              <p className="text-slate-400 text-sm">Задачи</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-slate-400 text-sm">Дней</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Быстрые действия</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Последняя активность</h2>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-slate-700/20 rounded-xl">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <div className="flex-1">
                <h3 className="text-white font-medium">{activity.title}</h3>
                <p className="text-slate-400 text-sm">{activity.description}</p>
              </div>
              <div className="text-right">
                {activity.points > 0 && (
                  <p className="text-emerald-400 font-semibold">+{activity.points}</p>
                )}
                <p className="text-slate-500 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
          
          {recentActivity.length === 0 && (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-400">Пока нет активности</p>
              <p className="text-slate-500 text-sm">Начните участвовать в аирдропах!</p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Уведомления</h2>
          <Bell className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-blue-400 font-semibold text-sm">Новый аирдроп</span>
            </div>
            <p className="text-white">CrossBridge Protocol запустил новый аирдроп!</p>
            <p className="text-slate-400 text-sm">5 минут назад</p>
          </div>
          
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-emerald-400 font-semibold text-sm">Награда</span>
            </div>
            <p className="text-white">Вы получили 150 поинтов за выполнение задач</p>
            <p className="text-slate-400 text-sm">2 часа назад</p>
          </div>
        </div>
      </div>
    </div>
  );
}