import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useMySQLDatabase } from '../hooks/useMySQLDatabase';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Info,
  Server,
  Activity
} from 'lucide-react';

export default function DatabaseStatus() {
  const { databaseStatus, refreshData } = useApp();
  const { connectionStatus, getConnectionInfo, getAnalytics, vacuum } = useMySQLDatabase();
  
  const connectionInfo = getConnectionInfo();
  const analytics = getAnalytics();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'connecting':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Database className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'border-emerald-500/20 bg-emerald-500/10';
      case 'connecting':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'error':
        return 'border-red-500/20 bg-red-500/10';
      default:
        return 'border-slate-500/20 bg-slate-500/10';
    }
  };

  const handleOptimize = () => {
    vacuum();
    refreshData();
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Database Status</h3>
            <p className="text-slate-400 text-sm">MySQL-compatible database connection</p>
          </div>
        </div>
        
        <button
          onClick={refreshData}
          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-xl border mb-6 ${getStatusColor()}`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="text-white font-medium">
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Connection Error'}
            </p>
            <p className="text-slate-300 text-sm">{databaseStatus}</p>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Server className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm">Database Type</span>
          </div>
          <p className="text-white font-semibold">{connectionInfo.databaseType}</p>
          <p className="text-slate-400 text-sm">Version {connectionInfo.version}</p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-medium text-sm">Location</span>
          </div>
          <p className="text-white font-semibold">{connectionInfo.location}</p>
          <p className="text-slate-400 text-sm">High-performance storage</p>
        </div>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-4">Database Analytics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs mb-1">Airdrops</p>
              <p className="text-white font-bold text-lg">{analytics.totalAirdrops}</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs mb-1">Users</p>
              <p className="text-white font-bold text-lg">{analytics.totalUsers}</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs mb-1">Points</p>
              <p className="text-white font-bold text-lg">{analytics.totalPoints.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-slate-400 text-xs mb-1">Withdrawals</p>
              <p className="text-white font-bold text-lg">{analytics.totalWithdrawals}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleOptimize}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
        >
          <Database className="w-4 h-4" />
          <span>Optimize</span>
        </button>
        
        <div className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 rounded-lg">
          <Info className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 text-sm">Auto-sync enabled</span>
        </div>
      </div>
    </div>
  );
}