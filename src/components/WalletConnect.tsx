import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Wallet, ExternalLink, Copy, LogOut, Zap, X, AlertCircle, Shield, Sparkles } from 'lucide-react';

export default function WalletConnect() {
  const { walletState, isConnecting, connectionError, connectWallet, disconnectWallet, clearError, formatAddress } = useWallet();

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      // You could add a toast notification here
    }
  };

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      case 56: return 'BSC';
      case 42161: return 'Arbitrum';
      default: return 'Unknown';
    }
  };

  if (!walletState.isConnected) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-emerald-500/5 rounded-full blur-lg animate-pulse delay-500" />
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-3xl blur opacity-30 animate-pulse" />

        <div className="relative text-center">
          {/* Icon with animated glow */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl blur-lg opacity-50 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
              <Wallet className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Connect Your Wallet
          </h3>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-md mx-auto">
            Unlock the world of crypto airdrops by connecting your Web3 wallet
          </p>
          
          {connectionError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 text-sm text-left font-medium">{connectionError}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="group relative w-full py-4 bg-gradient-to-r from-purple-500 via-blue-600 to-emerald-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:via-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center justify-center space-x-3 text-lg"
          >
            {isConnecting ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                <span>Connect Wallet</span>
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            )}
          </button>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl">
              <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">Secure</p>
              <p className="text-slate-400 text-xs">Your keys, your crypto</p>
            </div>
            <div className="p-4 bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">Fast</p>
              <p className="text-slate-400 text-xs">Instant connection</p>
            </div>
            <div className="p-4 bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl">
              <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">Rewards</p>
              <p className="text-slate-400 text-xs">Earn crypto tokens</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm">Supported Wallets</span>
            </div>
            <p className="text-blue-300 text-sm">
              MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet & more
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Connected Wallet</h3>
        <div className="flex items-center space-x-1 text-emerald-400">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Connected</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
          <div>
            <p className="text-sm text-slate-400">Address</p>
            <p className="text-white font-mono">{formatAddress(walletState.address!)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyAddress}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Copy address"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={`https://etherscan.io/address/${walletState.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="View on Etherscan"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
          <div>
            <p className="text-sm text-slate-400">Balance</p>
            <p className="text-white font-semibold">
              {parseFloat(walletState.balance!).toFixed(4)} ETH
            </p>
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
          <div>
            <p className="text-sm text-slate-400">Network</p>
            <p className="text-white font-semibold">
              {getChainName(walletState.chainId!)}
            </p>
          </div>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={disconnectWallet}
          className="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
}