import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Star, 
  TrendingUp,
  Users,
  Zap,
  Target
} from 'lucide-react';

export default function LeaderboardPage() {
  const { connectedUsers } = useApp();
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  // Sort users by total points and add rank
  const leaderboard = connectedUsers
    .filter(user => user.totalPoints > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      completedAirdrops: Object.keys(user.completedTasks).length
    }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-5 h-5 text-slate-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
    return 'bg-slate-700 text-slate-300';
  };

  const totalParticipants = leaderboard.length;
  const averagePoints = totalParticipants > 0 ? Math.round(leaderboard.reduce((sum, user) => sum + user.totalPoints, 0) / totalParticipants) : 0;
  const topPerformer = leaderboard[0];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl mb-6 shadow-2xl shadow-yellow-500/25">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
        <p className="text-xl text-slate-300">Top performers in our airdrop community</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Participants</p>
          <p className="text-2xl font-bold text-white">{totalParticipants}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Average Points</p>
          <p className="text-2xl font-bold text-white">{averagePoints.toLocaleString()}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <Crown className="w-6 h-6 text-emerald-400" />
            </div>
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Top Score</p>
          <p className="text-2xl font-bold text-white">
            {topPerformer ? topPerformer.totalPoints.toLocaleString() : '0'}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
              <Trophy className="w-6 h-6 text-blue-400" />
            </div>
            <Medal className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Active Users</p>
          <p className="text-2xl font-bold text-white">{Math.floor(totalParticipants * 0.7)}</p>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Rankings</h2>
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Time' },
            { key: 'month', label: 'This Month' },
            { key: 'week', label: 'This Week' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setTimeFilter(filter.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                timeFilter === filter.key
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-6 mb-12">
          {/* 2nd Place */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center order-1">
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <Medal className="w-8 h-8 text-gray-400 absolute -top-2 -right-2" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {leaderboard[1].walletAddress ? 
                `${leaderboard[1].walletAddress.slice(0, 6)}...${leaderboard[1].walletAddress.slice(-4)}` : 
                `User #${leaderboard[1].id.slice(0, 8)}`
              }
            </h3>
            <p className="text-2xl font-bold text-gray-400 mb-1">{leaderboard[1].totalPoints.toLocaleString()}</p>
            <p className="text-slate-400 text-sm">points</p>
          </div>

          {/* 1st Place */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 text-center order-2 transform scale-110">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <Crown className="w-10 h-10 text-yellow-400 absolute -top-3 -right-3" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {leaderboard[0].walletAddress ? 
                `${leaderboard[0].walletAddress.slice(0, 6)}...${leaderboard[0].walletAddress.slice(-4)}` : 
                `User #${leaderboard[0].id.slice(0, 8)}`
              }
            </h3>
            <p className="text-3xl font-bold text-yellow-400 mb-1">{leaderboard[0].totalPoints.toLocaleString()}</p>
            <p className="text-slate-400 text-sm">points</p>
          </div>

          {/* 3rd Place */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center order-3">
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <Award className="w-8 h-8 text-amber-600 absolute -top-2 -right-2" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {leaderboard[2].walletAddress ? 
                `${leaderboard[2].walletAddress.slice(0, 6)}...${leaderboard[2].walletAddress.slice(-4)}` : 
                `User #${leaderboard[2].id.slice(0, 8)}`
              }
            </h3>
            <p className="text-2xl font-bold text-amber-600 mb-1">{leaderboard[2].totalPoints.toLocaleString()}</p>
            <p className="text-slate-400 text-sm">points</p>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-semibold text-white">Full Rankings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Airdrops
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {leaderboard.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(user.rank)}`}>
                        <span className="text-sm font-bold">#{user.rank}</span>
                      </div>
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.id.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user.walletAddress ? 
                            `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                            `User #${user.id.slice(0, 8)}`
                          }
                        </div>
                        <div className="text-sm text-slate-400">
                          Joined {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-emerald-400">
                      {user.totalPoints.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">
                      {user.completedAirdrops} completed
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

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Rankings Yet</h3>
            <p className="text-slate-400">Complete airdrop tasks to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}