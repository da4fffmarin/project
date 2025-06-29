export interface Airdrop {
  id: string;
  title: string;
  description: string;
  logo: string;
  reward: string;
  totalReward: string;
  participants: number;
  maxParticipants: number;
  startDate: string; // Added start date
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  category: string;
  blockchain: string;
  tasks: Task[];
  requirements: string[];
}

export interface Task {
  id: string;
  type: 'telegram' | 'twitter' | 'discord' | 'website' | 'wallet';
  title: string;
  description: string;
  url?: string;
  points: number;
  completed?: boolean;
  required: boolean;
}

export interface User {
  id: string;
  walletAddress?: string;
  telegram?: string;
  twitter?: string;
  discord?: string;
  completedTasks: Record<string, string[]>; // airdropId -> taskIds
  totalPoints: number;
  isConnected: boolean;
  balance?: string;
  wallet?: string;
  joinedAt: string; // Added join timestamp
  lastActive: string; // Added last activity timestamp
}

export interface AdminStats {
  totalAirdrops: number;
  activeAirdrops: number;
  totalUsers: number;
  connectedWallets: number;
  totalRewardsDistributed: string;
  totalPointsEarned: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
}

export interface WithdrawalHistory {
  id: string;
  userId: string;
  amount: number;
  usdcAmount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  walletAddress: string;
  totalPoints: number;
  completedAirdrops: number;
  rank: number;
}

export interface DatabaseState {
  airdrops: Airdrop[];
  users: User[];
  withdrawals: WithdrawalHistory[];
  settings: {
    lastBackup: string;
    version: string;
    totalTransactions: number;
  };
}