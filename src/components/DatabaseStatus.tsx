import React from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { Database, Download, Trash2, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export default function DatabaseStatus() {
  const { isInitialized, exportDatabase, clearDatabase } = useDatabase();

  const handleExport = () => {
    if (confirm('Export database to file?')) {
      exportDatabase();
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all database data? This action cannot be undone.')) {
      clearDatabase();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
          <Database className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Database Status</h3>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
          <div className="flex items-center space-x-3">
            {isInitialized ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Loader className="w-5 h-5 text-yellow-400 animate-spin" />
            )}
            <div>
              <p className="text-white font-medium">
                {isInitialized ? 'Connected' : 'Initializing...'}
              </p>
              <p className="text-slate-400 text-sm">
                {isInitialized ? 'SQL.js database ready' : 'Setting up database...'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isInitialized 
              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
              : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
          }`}>
            {isInitialized ? 'Ready' : 'Loading'}
          </div>
        </div>

        {/* Actions */}
        {isInitialized && (
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleClear}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-semibold text-sm">Database Info</span>
          </div>
          <p className="text-blue-300 text-sm">
            Using SQL.js for local browser storage. Data persists in localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}