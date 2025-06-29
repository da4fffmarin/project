import React from 'react';
import { useServerDatabase } from '../hooks/useServerDatabase';
import { 
  Database, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader,
  Server,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function ServerDatabaseStatus() {
  const { 
    isInitialized, 
    isConnected, 
    error, 
    exportDatabase, 
    clearDatabase, 
    reconnect 
  } = useServerDatabase();

  const handleExport = async () => {
    if (confirm('Экспортировать базу данных в MySQL файл?')) {
      await exportDatabase();
    }
  };

  const handleClear = async () => {
    if (confirm('Вы уверены, что хотите очистить всю базу данных? Это действие нельзя отменить.')) {
      await clearDatabase();
    }
  };

  const handleReconnect = async () => {
    await reconnect();
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
          <Server className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Статус Серверной БД</h3>
      </div>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-emerald-400" />
            ) : isInitialized ? (
              <WifiOff className="w-5 h-5 text-red-400" />
            ) : (
              <Loader className="w-5 h-5 text-yellow-400 animate-spin" />
            )}
            <div>
              <p className="text-white font-medium">
                {isConnected ? 'Подключено к серверу' : 
                 error ? 'Ошибка подключения' : 'Подключение...'}
              </p>
              <p className="text-slate-400 text-sm">
                {isConnected ? 'MySQL база данных готова' : 
                 error ? error : 'Установка соединения с сервером...'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
            isConnected 
              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
              : error
              ? 'bg-red-400/10 text-red-400 border border-red-400/20'
              : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
          }`}>
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Активно</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="w-3 h-3" />
                <span>Ошибка</span>
              </>
            ) : (
              <>
                <Loader className="w-3 h-3 animate-spin" />
                <span>Загрузка</span>
              </>
            )}
          </div>
        </div>

        {/* Database Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-700/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm">База данных</span>
            </div>
            <p className="text-white font-medium">airdrop_platform</p>
            <p className="text-slate-400 text-xs">MySQL 8.0</p>
          </div>

          <div className="p-3 bg-slate-700/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Server className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm">Сервер</span>
            </div>
            <p className="text-white font-medium">localhost:3306</p>
            <p className="text-slate-400 text-xs">Локальный сервер</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            disabled={!isConnected}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Экспорт в SQL</span>
          </button>
          
          <button
            onClick={handleReconnect}
            disabled={isConnected}
            className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Переподключить</span>
          </button>
          
          <button
            onClick={handleClear}
            disabled={!isConnected}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Очистить</span>
          </button>
        </div>

        {/* Server Info */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-semibold text-sm">Информация о сервере</span>
          </div>
          <p className="text-emerald-300 text-sm mb-2">
            Все данные сохраняются в MySQL базе данных на сервере.
          </p>
          <p className="text-emerald-300 text-sm">
            Файл экспорта: <code className="bg-emerald-400/10 px-1 rounded">mysql.sql</code>
          </p>
        </div>

        {/* Note about current environment */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">Примечание</span>
          </div>
          <p className="text-yellow-300 text-sm">
            В текущей среде WebContainer используется симуляция серверной БД. 
            В реальном проекте здесь будет подключение к MySQL серверу.
          </p>
        </div>
      </div>
    </div>
  );
}