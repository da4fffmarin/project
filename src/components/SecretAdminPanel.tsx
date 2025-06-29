import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Wallet,
  Eye,
  BarChart3,
  Settings,
  Database
} from 'lucide-react';

export default function SecretAdminPanel() {
  const { airdrops, adminStats, connectedUsers } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics'>('overview');

  const totalPointsEarned = connectedUsers.reduce((sum, user) => sum + user.totalPoints, 0);
  const averagePointsPerUser = connectedUsers.length > 0 ? totalPointsEarned / connectedUsers.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-2xl shadow-red-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Secret Admin Panel</h1>
              <p className="text-slate-400">Full platform control and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-red-400 font-semibold">🔒 CONFIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs text-slate-400">TOTAL</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{adminStats.totalAirdrops}</p>
                <p className="text-slate-400 text-sm">Airdrops</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs text-slate-400">ACTIVE</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{adminStats.activeAirdrops}</p>
                <p className="text-slate-400 text-sm">Active</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <Wallet className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-slate-400">WALLETS</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{adminStats.connectedWallets}</p>
                <p className="text-slate-400 text-sm">Connected</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-xs text-slate-400">REWARDS</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{adminStats.totalRewardsDistributed}</p>
                <p className="text-slate-400 text-sm">Distributed</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Points Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total earned:</span>
                    <span className="text-white font-semibold">{totalPointsEarned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average per user:</span>
                    <span className="text-white font-semibold">{Math.round(averagePointsPerUser).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">USDC conversion:</span>
                    <span className="text-emerald-400 font-semibold">${(totalPointsEarned / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active today:</span>
                    <span className="text-emerald-400 font-semibold">{Math.floor(connectedUsers.length * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">New this week:</span>
                    <span className="text-blue-400 font-semibold">{Math.floor(connectedUsers.length * 0.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completed tasks:</span>
                    <span className="text-purple-400 font-semibold">{Math.floor(connectedUsers.length * 0.6)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-semibold">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-white font-semibold">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version:</span>
                    <span className="text-white font-semibold">v2.1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Connected Users</h3>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">{connectedUsers.length} active</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {connectedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.id.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">User #{index + 1}</div>
                            <div className="text-sm text-slate-400">{user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300 font-mono">
                          {user.walletAddress ? 
                            `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                            'Not connected'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-emerald-400">
                          {user.totalPoints.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">
                          {Object.values(user.completedTasks).flat().length} completed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isConnected 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isConnected ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Popular Airdrops</h3>
                <div className="space-y-3">
                  {airdrops.slice(0, 5).map((airdrop, index) => (
                    <div key={airdrop.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{airdrop.logo}</span>
                        <div>
                          <p className="text-white font-medium">{airdrop.title}</p>
                          <p className="text-slate-400 text-sm">{airdrop.participants} participants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-semibold">#{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Blockchain Statistics</h3>
                <div className="space-y-3">
                  {['Ethereum', 'Polygon', 'Arbitrum', 'Multi-chain'].map((blockchain) => {
                    const count = airdrops.filter(a => a.blockchain === blockchain).length;
                    const percentage = (count / airdrops.length) * 100;
                    return (
                      <div key={blockchain} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">{blockchain}</span>
                          <span className="text-white font-semibold">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}