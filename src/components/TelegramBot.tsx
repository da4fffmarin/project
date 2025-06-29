import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Bot, Users, Bell, Settings, QrCode } from 'lucide-react';

export default function TelegramBot() {
  const [botToken, setBotToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);

  // Симуляция Telegram бота
  useEffect(() => {
    // Симуляция подключения к Telegram Bot API
    if (botToken) {
      setTimeout(() => {
        setIsConnected(true);
        setSubscribers(Math.floor(Math.random() * 1000) + 100);
      }, 2000);
    }
  }, [botToken]);

  const handleConnect = () => {
    if (!botToken) {
      alert('Введите токен бота');
      return;
    }
    setIsConnected(true);
  };

  const sendNotification = (type: string, message: string) => {
    const newMessage = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date(),
      sent: subscribers
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const botCommands = [
    { command: '/start', description: 'Начать работу с ботом' },
    { command: '/airdrops', description: 'Показать активные аирдропы' },
    { command: '/balance', description: 'Показать баланс поинтов' },
    { command: '/notifications', description: 'Настроить уведомления' },
    { command: '/help', description: 'Показать справку' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/25">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Telegram Bot</h1>
        <p className="text-xl text-slate-300">
          Автоматические уведомления и управление через Telegram
        </p>
      </div>

      {/* Bot Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bot className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Настройка бота</h2>
          </div>

          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Токен Telegram бота
                </label>
                <input
                  type="password"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <p className="text-slate-400 text-sm mt-2">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={!botToken}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Подключить бота
              </button>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-blue-400 font-semibold mb-2">Как создать бота:</h3>
                <ol className="text-blue-300 text-sm space-y-1">
                  <li>1. Найдите @BotFather в Telegram</li>
                  <li>2. Отправьте команду /newbot</li>
                  <li>3. Следуйте инструкциям</li>
                  <li>4. Скопируйте токен сюда</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 font-semibold">Бот подключен</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{subscribers}</p>
                  <p className="text-slate-400 text-sm">Подписчиков</p>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <Send className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{messages.length}</p>
                  <p className="text-slate-400 text-sm">Сообщений</p>
                </div>
              </div>

              <button
                onClick={() => setIsConnected(false)}
                className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Отключить бота
              </button>
            </div>
          )}
        </div>

        {/* Bot Commands */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Команды бота</h2>
          </div>

          <div className="space-y-3">
            {botCommands.map((cmd, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                <div>
                  <code className="text-purple-400 font-mono">{cmd.command}</code>
                  <p className="text-slate-400 text-sm">{cmd.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <QrCode className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm">QR код для подписки</span>
            </div>
            <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center">
              <span className="text-slate-800 text-xs">QR Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      {isConnected && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Центр уведомлений</h2>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => sendNotification('airdrop', 'Новый аирдроп: MetaChain Gaming с наградой 500 MCG!')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Новый аирдроп
              </button>
              <button
                onClick={() => sendNotification('reward', 'Поздравляем! Вы получили 150 поинтов за выполнение задач')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                Награда
              </button>
              <button
                onClick={() => sendNotification('reminder', 'Напоминание: До окончания аирдропа DefiSwap осталось 2 дня')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Напоминание
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400">Нет отправленных сообщений</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      message.type === 'airdrop' ? 'bg-purple-400/10 text-purple-400' :
                      message.type === 'reward' ? 'bg-emerald-400/10 text-emerald-400' :
                      'bg-yellow-400/10 text-yellow-400'
                    }`}>
                      {message.type === 'airdrop' ? 'Аирдроп' :
                       message.type === 'reward' ? 'Награда' : 'Напоминание'}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-white mb-2">{message.message}</p>
                  <p className="text-slate-400 text-sm">
                    Отправлено {message.sent} подписчикам
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}