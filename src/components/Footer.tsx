import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Coins, 
  Twitter, 
  MessageCircle, 
  Github, 
  Mail, 
  Heart, 
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/airdrophub',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Telegram',
      icon: MessageCircle,
      url: 'https://t.me/airdrophub',
      color: 'hover:text-blue-500'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/airdrophub',
      color: 'hover:text-white'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:support@airdrophub.com',
      color: 'hover:text-emerald-400'
    }
  ];

  const quickLinks = [
    { name: 'Airdrops', path: '/' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'FAQ', path: '/faq' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', url: '#' },
    { name: 'Terms of Service', url: '#' },
    { name: 'Support', url: 'mailto:support@airdrophub.com' }
  ];

  return (
    <footer className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 mt-16">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/3 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-blue-500/3 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 lg:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    AirdropHub
                  </h3>
                  <p className="text-xs text-slate-400">Free Crypto Rewards</p>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Discover and participate in cryptocurrency airdrops from promising blockchain projects.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 text-slate-400 ${social.color} transition-all duration-200 hover:scale-105`}
                    title={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Quick Links</span>
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Legal</span>
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>© {currentYear} AirdropHub. Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for crypto community</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Online</span>
              </div>
              
              <a
                href="https://github.com/airdrophub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <span>Open Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}