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
  FileText,
  HelpCircle,
  Zap,
  Star,
  Globe,
  Users
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
    { name: 'Airdrops', path: '/', icon: Coins },
    { name: 'Rewards', path: '/rewards', icon: Star },
    { name: 'Leaderboard', path: '/leaderboard', icon: Users },
    { name: 'FAQ', path: '/faq', icon: HelpCircle }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', url: '#', icon: Shield },
    { name: 'Terms of Service', url: '#', icon: FileText },
    { name: 'Cookie Policy', url: '#', icon: Globe }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Rewards Distributed', value: '$2.5M+', icon: Star },
    { label: 'Projects Listed', value: '500+', icon: Zap },
    { label: 'Countries', value: '150+', icon: Globe }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-black border-t border-slate-700/50 mt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-blue-500/3 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-emerald-500/2 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-600 to-emerald-500 rounded-2xl blur opacity-30" />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Coins className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    AirdropHub
                  </h3>
                  <p className="text-xs text-slate-400">Free Crypto Rewards</p>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                The ultimate platform for discovering and participating in cryptocurrency airdrops. 
                Earn free tokens from the most promising blockchain projects.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 text-slate-400 ${social.color} transition-all duration-200 hover:scale-110 hover:border-slate-600`}
                    title={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Quick Links</span>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      <link.icon className="w-4 h-4 group-hover:text-purple-400 transition-colors duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="text-white font-semibold mb-6 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Legal & Support</span>
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      <link.icon className="w-4 h-4 group-hover:text-emerald-400 transition-colors duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:support@airdrophub.com"
                    className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4 group-hover:text-blue-400 transition-colors duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Contact Support
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform Stats */}
            <div>
              <h4 className="text-white font-semibold mb-6 flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Platform Stats</span>
              </h4>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                      <stat.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{stat.value}</p>
                      <p className="text-slate-400 text-xs">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-slate-700/50">
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 border border-purple-500/20 rounded-2xl p-6 lg:p-8">
            <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-slate-300">Get notified about new airdrops and exclusive opportunities</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-w-[250px]"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>© {currentYear} AirdropHub. Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for the crypto community</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>All systems operational</span>
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