import { Airdrop, AdminStats, FAQ } from '../types';

export const mockAirdrops: Airdrop[] = [
  {
    id: '1',
    title: 'DefiSwap Token Airdrop',
    description: 'Get rewarded for being an early supporter of the next-generation DeFi protocol. Complete simple tasks to earn DSWAP tokens and join our growing community.',
    logo: '🔄',
    reward: '150 DSWAP',
    totalReward: '1,000,000 DSWAP',
    participants: 12450,
    maxParticipants: 50000,
    startDate: '2025-01-20T00:00:00Z',
    endDate: '2025-02-15T23:59:59Z',
    status: 'active',
    category: 'DeFi',
    blockchain: 'Ethereum',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'Join Telegram',
        description: 'Join our official Telegram channel for updates',
        url: 'https://t.me/defiswap',
        points: 50,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'Follow Twitter',
        description: 'Follow @DefiSwap and retweet our pinned post',
        url: 'https://twitter.com/defiswap',
        points: 30,
        required: true
      },
      {
        id: 'task3',
        type: 'discord',
        title: 'Join Discord',
        description: 'Join our Discord community and verify your account',
        url: 'https://discord.gg/defiswap',
        points: 25,
        required: false
      },
      {
        id: 'task4',
        type: 'wallet',
        title: 'Connect Wallet',
        description: 'Connect your wallet to receive rewards',
        points: 45,
        required: true
      }
    ],
    requirements: ['Minimum 0.1 ETH balance', 'Complete all required tasks', 'Active social media accounts']
  },
  {
    id: '2',
    title: 'MetaChain Gaming Rewards',
    description: 'Revolutionary blockchain gaming platform offering exclusive NFT rewards and governance tokens for early users. Join the future of gaming.',
    logo: '🎮',
    reward: '500 MCG + NFT',
    totalReward: '2,500,000 MCG',
    participants: 8720,
    maxParticipants: 25000,
    startDate: '2025-01-15T00:00:00Z',
    endDate: '2025-01-30T23:59:59Z',
    status: 'active',
    category: 'Gaming',
    blockchain: 'Polygon',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'Gaming Community',
        description: 'Join our Telegram gaming community',
        url: 'https://t.me/metachain',
        points: 40,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'Twitter Activity',
        description: 'Follow and engage with our Twitter content',
        url: 'https://twitter.com/metachain',
        points: 35,
        required: true
      },
      {
        id: 'task3',
        type: 'discord',
        title: 'Discord Gaming Hub',
        description: 'Join our Discord gaming community',
        url: 'https://discord.gg/metachain',
        points: 30,
        required: true
      },
      {
        id: 'task4',
        type: 'website',
        title: 'Play Demo',
        description: 'Try our demo game on the website',
        url: 'https://metachain.game',
        points: 50,
        required: false
      }
    ],
    requirements: ['Gaming wallet setup', 'Social media verification', 'Demo game completion']
  },
  {
    id: '3',
    title: 'CrossBridge Protocol Launch',
    description: 'Interoperability protocol connecting multiple blockchains. Early supporters receive governance tokens and bridge fee discounts.',
    logo: '🌉',
    reward: '200 CROSS',
    totalReward: '5,000,000 CROSS',
    participants: 15670,
    maxParticipants: 100000,
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-03-01T23:59:59Z',
    status: 'upcoming',
    category: 'Infrastructure',
    blockchain: 'Multi-chain',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'Protocol Updates',
        description: 'Join for protocol updates and announcements',
        url: 'https://t.me/crossbridge',
        points: 45,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'Community Growth',
        description: 'Follow and share our bridge technology',
        url: 'https://twitter.com/crossbridge',
        points: 40,
        required: true
      },
      {
        id: 'task3',
        type: 'website',
        title: 'Test Bridge',
        description: 'Test our bridge on testnet',
        url: 'https://testnet.crossbridge.io',
        points: 60,
        required: false
      }
    ],
    requirements: ['Multi-chain wallet', 'Testnet participation', 'Community activity']
  },
  {
    id: '4',
    title: 'AI Trading Bot Genesis',
    description: 'First decentralized AI trading bot on blockchain. Get exclusive access to beta version and AIBOT tokens for early adoption.',
    logo: '🤖',
    reward: '300 AIBOT',
    totalReward: '3,000,000 AIBOT',
    participants: 6890,
    maxParticipants: 20000,
    startDate: '2025-02-10T00:00:00Z',
    endDate: '2025-02-28T23:59:59Z',
    status: 'upcoming',
    category: 'DeFi',
    blockchain: 'Arbitrum',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'AI Trading Community',
        description: 'Join the AI traders community',
        url: 'https://t.me/aitradingbot',
        points: 55,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'AI Innovation Updates',
        description: 'Follow AI innovation updates',
        url: 'https://twitter.com/aitradingbot',
        points: 45,
        required: true
      },
      {
        id: 'task3',
        type: 'discord',
        title: 'Beta Testers Hub',
        description: 'Join the beta testers hub',
        url: 'https://discord.gg/aitradingbot',
        points: 40,
        required: false
      }
    ],
    requirements: ['DeFi trading experience', 'Active Arbitrum wallet', 'Beta testing participation']
  },
  {
    id: '5',
    title: 'NFT Marketplace Launch',
    description: 'Revolutionary NFT marketplace with zero gas fees and creator royalties. Early users get exclusive NFTs and platform tokens.',
    logo: '🎨',
    reward: '250 NFTM + Exclusive NFT',
    totalReward: '4,000,000 NFTM',
    participants: 9340,
    maxParticipants: 30000,
    startDate: '2025-01-25T00:00:00Z',
    endDate: '2025-02-20T23:59:59Z',
    status: 'active',
    category: 'NFT',
    blockchain: 'Ethereum',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'NFT Community',
        description: 'Join our NFT creators community',
        url: 'https://t.me/nftmarketplace',
        points: 60,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'NFT Updates',
        description: 'Follow for NFT drops and updates',
        url: 'https://twitter.com/nftmarketplace',
        points: 50,
        required: true
      },
      {
        id: 'task3',
        type: 'discord',
        title: 'Creator Hub',
        description: 'Join the NFT creators hub',
        url: 'https://discord.gg/nftmarketplace',
        points: 45,
        required: true
      },
      {
        id: 'task4',
        type: 'website',
        title: 'Browse Collections',
        description: 'Explore NFT collections on our platform',
        url: 'https://nftmarketplace.io',
        points: 40,
        required: false
      }
    ],
    requirements: ['NFT wallet setup', 'Social verification', 'Platform exploration']
  },
  {
    id: '6',
    title: 'Layer 2 Scaling Solution',
    description: 'Next-generation Layer 2 solution for Ethereum with instant transactions and minimal fees. Early adopters get governance tokens.',
    logo: '⚡',
    reward: '400 L2S',
    totalReward: '6,000,000 L2S',
    participants: 11250,
    maxParticipants: 40000,
    startDate: '2025-01-18T00:00:00Z',
    endDate: '2025-02-10T23:59:59Z',
    status: 'active',
    category: 'Layer 2',
    blockchain: 'Ethereum',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'L2 Community',
        description: 'Join Layer 2 scaling community',
        url: 'https://t.me/layer2scaling',
        points: 70,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'Scaling Updates',
        description: 'Follow scaling technology updates',
        url: 'https://twitter.com/layer2scaling',
        points: 60,
        required: true
      },
      {
        id: 'task3',
        type: 'website',
        title: 'Test Network',
        description: 'Test transactions on our L2 network',
        url: 'https://testnet.layer2scaling.io',
        points: 80,
        required: false
      }
    ],
    requirements: ['Ethereum mainnet activity', 'L2 testing', 'Community participation']
  },
  {
    id: '7',
    title: 'Decentralized Storage Network',
    description: 'Secure, decentralized file storage with encryption and redundancy. Early users receive storage tokens and free storage space.',
    logo: '💾',
    reward: '350 DSN + 100GB Storage',
    totalReward: '5,500,000 DSN',
    participants: 7680,
    maxParticipants: 25000,
    startDate: '2025-02-05T00:00:00Z',
    endDate: '2025-02-25T23:59:59Z',
    status: 'upcoming',
    category: 'Infrastructure',
    blockchain: 'Solana',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'Storage Community',
        description: 'Join decentralized storage community',
        url: 'https://t.me/decstorage',
        points: 65,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'Storage Innovation',
        description: 'Follow storage innovation updates',
        url: 'https://twitter.com/decstorage',
        points: 55,
        required: true
      },
      {
        id: 'task3',
        type: 'discord',
        title: 'Developer Hub',
        description: 'Join the developer community',
        url: 'https://discord.gg/decstorage',
        points: 50,
        required: false
      }
    ],
    requirements: ['Solana wallet', 'Storage testing', 'Developer activity']
  },
  {
    id: '8',
    title: 'Social DeFi Platform',
    description: 'Combining social media with DeFi features. Users earn tokens for content creation and community engagement.',
    logo: '🌐',
    reward: '180 SOCIAL',
    totalReward: '3,600,000 SOCIAL',
    participants: 13420,
    maxParticipants: 50000,
    startDate: '2025-01-22T00:00:00Z',
    endDate: '2025-02-18T23:59:59Z',
    status: 'active',
    category: 'DeFi',
    blockchain: 'Polygon',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'Social DeFi Community',
        description: 'Join our social DeFi community',
        url: 'https://t.me/socialdefi',
        points: 40,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'Social Engagement',
        description: 'Follow and engage with our content',
        url: 'https://twitter.com/socialdefi',
        points: 35,
        required: true
      },
      {
        id: 'task3',
        type: 'discord',
        title: 'Creator Hub',
        description: 'Join the content creators hub',
        url: 'https://discord.gg/socialdefi',
        points: 30,
        required: true
      },
      {
        id: 'task4',
        type: 'website',
        title: 'Create Profile',
        description: 'Create your social DeFi profile',
        url: 'https://socialdefi.app',
        points: 45,
        required: false
      }
    ],
    requirements: ['Social media activity', 'Content creation', 'Community engagement']
  },
  {
    id: '9',
    title: 'Green Energy Blockchain',
    description: 'Eco-friendly blockchain for carbon credit trading and renewable energy certificates. Support green initiatives and earn rewards.',
    logo: '🌱',
    reward: '220 GREEN',
    totalReward: '4,400,000 GREEN',
    participants: 5890,
    maxParticipants: 20000,
    startDate: '2025-02-12T00:00:00Z',
    endDate: '2025-03-05T23:59:59Z',
    status: 'upcoming',
    category: 'Infrastructure',
    blockchain: 'Multi-chain',
    tasks: [
      {
        id: 'task1',
        type: 'telegram',
        title: 'Green Community',
        description: 'Join the green blockchain community',
        url: 'https://t.me/greenblockchain',
        points: 50,
        required: true
      },
      {
        id: 'task2',
        type: 'twitter',
        title: 'Eco Updates',
        description: 'Follow eco-friendly blockchain updates',
        url: 'https://twitter.com/greenblockchain',
        points: 45,
        required: true
      },
      {
        id: 'task3',
        type: 'website',
        title: 'Carbon Calculator',
        description: 'Use our carbon footprint calculator',
        url: 'https://greenblockchain.eco',
        points: 55,
        required: false
      }
    ],
    requirements: ['Environmental interest', 'Carbon awareness', 'Green initiatives support']
  }
];

export const mockAdminStats: AdminStats = {
  totalAirdrops: 15,
  activeAirdrops: 8,
  totalUsers: 45230,
  connectedWallets: 12450,
  totalRewardsDistributed: '$2,450,000',
  totalPointsEarned: 245000
};

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'What is an airdrop?',
    answer: 'An airdrop is a distribution of cryptocurrency tokens or coins, usually for free, to numerous wallet addresses. Airdrops are primarily implemented as a way of gaining attention and new followers, resulting in a larger user-base and a wider disbursement of coins.',
    category: 'General'
  },
  {
    id: '2',
    question: 'How do I participate in airdrops?',
    answer: 'To participate in airdrops on our platform, you need to: 1) Connect your Web3 wallet (MetaMask recommended), 2) Complete the required tasks for each airdrop, 3) Provide your social media information when requested, 4) Wait for the airdrop distribution date.',
    category: 'Participation'
  },
  {
    id: '3',
    question: 'What wallets are supported?',
    answer: 'We support all Web3 wallets that are compatible with Ethereum and other major blockchains, including MetaMask, WalletConnect, Coinbase Wallet, and Trust Wallet.',
    category: 'Technical'
  },
  {
    id: '4',
    question: 'How do I convert points to USDC?',
    answer: 'You can convert your earned points to USDC at a rate of 100 points = 1 USDC. Go to the Rewards page, enter the amount of points you want to convert (minimum 100), and click withdraw. The USDC will be sent to your connected wallet.',
    category: 'Rewards'
  },
  {
    id: '5',
    question: 'Are there any fees for withdrawing rewards?',
    answer: 'There are no platform fees for converting points to USDC. However, you will need to pay standard blockchain gas fees for the transaction to your wallet.',
    category: 'Rewards'
  }
];