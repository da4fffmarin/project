import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Target,
  Zap,
  Award,
  Globe
} from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

export default function AnalyticsDashboard() {
  const { airdrops, connectedUsers } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeChart, setActiveChart] = useState<'users' | 'airdrops' | 'rewards'>('users');

  // Генерация данных для графиков
  const generateUserGrowthData = (): ChartData => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
    });

    const data = Array.from({ length: days }, (_, i) => {
      const baseGrowth = Math.floor(Math.random() * 50) + 10;
      const trend = i * 2; // Растущий тренд
      return baseGrowth + trend;
    });

    return {
      labels,
      datasets: [{
        label: 'Новые пользователи',
        data,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 1)'
      }]
    };
  };

  const generateAirdropData = (): ChartData => {
    const categories = ['DeFi', 'Gaming', 'NFT', 'Infrastructure', 'Layer 2'];
    const data = categories.map(category => 
      airdrops.filter(a => a.category === category).length
    );

    return {
      labels: categories,
      datasets: [{
        label: 'Количество аирдропов',
        data,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)'
      }]
    };
  };

  const generateRewardsData = (): ChartData => {
    const days = 7;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    });

    const data = Array.from({ length: days }, () => 
      Math.floor(Math.random() * 5000) + 1000
    );

    return {
      labels,
      datasets: [{
        label: 'Выданные награды (USDC)',
        data,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderColor: 'rgba(251, 191, 36, 1)'
      }]
    };
  };

  // Простая реализация графика без внешних библиотек
  const SimpleChart = ({ data, type = 'line' }: { data: ChartData; type?: 'line' | 'bar' }) => {
    const maxValue = Math.max(...data.datasets[0].data);
    const minValue = Math.min(...data.datasets[0].data);
    const range = maxValue - minValue;

    return (
      <div className="h-64 p-4">
        <div className="h-full relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400">
            <span>{maxValue}</span>
            <span>{Math.round((maxValue + minValue) / 2)}</span>
            <span>{minValue}</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-8 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map(percent => (
                <div
                  key={percent}
                  className="absolute w-full border-t border-slate-700/30"
                  style={{ top: `${percent}%` }}
                />
              ))}
            </div>
            
            {/* Data visualization */}
            <div className="relative h-full flex items-end justify-between">
              {data.datasets[0].data.map((value, index) => {
                const height = ((value - minValue) / range) * 100;
                return (
                  <div key={index} className="flex flex-col items-center">
                    {type === 'bar' ? (
                      <div
                        className="w-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t transition-all duration-500 hover:opacity-80"
                        style={{ height: `${height}%` }}
                      />
                    ) : (
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        style={{ marginBottom: `${height}%` }}
                      />
                    )}
                    <span className="text-xs text-slate-400 mt-2 transform -rotate-45 origin-left">
                      {data.labels[index]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stats = [
    {
      title: 'Всего пользователей',
      value: connectedUsers.length.toLocaleString(),
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Активные аирдропы',
      value: airdrops.filter(a => a.status === 'active').length.toString(),
      change: '+8.3%',
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    },
    {
      title: 'Выдано наград',
      value: `$${(connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0) / 100).toLocaleString()}`,
      change: '+23.1%',
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      title: 'Конверсия',
      value: '68.4%',
      change: '+5.2%',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ];

  const topAirdrops = airdrops
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 5);

  const topUsers = connectedUsers
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Аналитика</h1>
          <p className="text-slate-400">Подробная статистика платформы</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range === '7d' ? '7 дней' : range === '30d' ? '30 дней' : '90 дней'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-emerald-400 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Динамика роста</h3>
            <div className="flex space-x-2">
              {[
                { key: 'users', label: 'Пользователи', icon: Users },
                { key: 'airdrops', label: 'Аирдропы', icon: Activity },
                { key: 'rewards', label: 'Награды', icon: DollarSign }
              ].map((chart) => (
                <button
                  key={chart.key}
                  onClick={() => setActiveChart(chart.key as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeChart === chart.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <chart.icon className="w-4 h-4" />
                  <span className="text-sm">{chart.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <SimpleChart 
            data={
              activeChart === 'users' ? generateUserGrowthData() :
              activeChart === 'airdrops' ? generateAirdropData() :
              generateRewardsData()
            }
            type={activeChart === 'airdrops' ? 'bar' : 'line'}
          />
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Airdrops */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Популярные аирдропы</h3>
          <div className="space-y-4">
            {topAirdrops.map((airdrop, index) => (
              <div key={airdrop.id} className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="text-2xl">{airdrop.logo}</div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{airdrop.title}</h4>
                  <p className="text-slate-400 text-sm">{airdrop.participants.toLocaleString()} участников</p>
                </div>
                <div className="text-emerald-400 font-semibold">
                  {airdrop.reward}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Топ пользователи</h3>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.id.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">
                    {user.walletAddress ? 
                      `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                      `User #${user.id.slice(0, 8)}`
                    }
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {Object.keys(user.completedTasks).length} аирдропов
                  </p>
                </div>
                <div className="text-emerald-400 font-semibold">
                  {user.totalPoints.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">География</h3>
          </div>
          <div className="space-y-3">
            {['Россия', 'США', 'Германия', 'Франция', 'Япония'].map((country, index) => (
              <div key={country} className="flex items-center justify-between">
                <span className="text-slate-300">{country}</span>
                <span className="text-slate-400">{Math.floor(Math.random() * 30) + 10}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Активность</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Сегодня</span>
              <span className="text-emerald-400 font-semibold">+{Math.floor(Math.random() * 100) + 50}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Вчера</span>
              <span className="text-slate-400">{Math.floor(Math.random() * 80) + 30}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Неделя</span>
              <span className="text-slate-400">{Math.floor(Math.random() * 500) + 200}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Достижения</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Новички</span>
              <span className="text-blue-400">{Math.floor(Math.random() * 50) + 20}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Активные</span>
              <span className="text-emerald-400">{Math.floor(Math.random() * 30) + 15}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Эксперты</span>
              <span className="text-purple-400">{Math.floor(Math.random() * 10) + 5}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}