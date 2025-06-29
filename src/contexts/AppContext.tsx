import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDatabase } from '../hooks/useDatabase';
import { useWallet } from '../hooks/useWallet';
import { Airdrop, User, AdminStats, WithdrawalHistory } from '../types';
import { mockAirdrops, mockAdminStats } from '../data/mockData';

interface AppContextType {
  airdrops: Airdrop[];
  setAirdrops: (airdrops: Airdrop[]) => void;
  user: User;
  setUser: (user: User) => void;
  updateUser: (user: User) => void;
  adminStats: AdminStats;
  setAdminStats: (stats: AdminStats) => void;
  connectedUsers: User[];
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (authenticated: boolean) => void;
  completeTask: (airdropId: string, taskId: string) => void;
  addAirdrop: (airdrop: Omit<Airdrop, 'id'>) => void;
  updateAirdrop: (id: string, airdrop: Partial<Airdrop>) => void;
  deleteAirdrop: (id: string) => void;
  withdrawPoints: (points: number) => void;
  withdrawalHistory: WithdrawalHistory[];
  updateUserPoints: (userId: string, newPoints: number) => void;
  addWithdrawal: (withdrawal: Omit<WithdrawalHistory, 'id'>) => void;
  updateWithdrawal: (id: string, updates: Partial<WithdrawalHistory>) => void;
  deleteWithdrawal: (id: string) => void;
  getAllWithdrawals: () => WithdrawalHistory[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [airdrops, setAirdrops] = useLocalStorage<Airdrop[]>('airdrops', mockAirdrops);
  const [connectedUsers, setConnectedUsers] = useLocalStorage<User[]>('connectedUsers', []);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('isAdmin', false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage<boolean>('isAdminAuthenticated', false);
  const { walletState } = useWallet();
  
  const { 
    isInitialized, 
    saveAirdrop, 
    getAirdrops, 
    saveUser, 
    getUsers, 
    saveWithdrawal,
    getWithdrawals,
    updateWithdrawal: dbUpdateWithdrawal,
    deleteWithdrawal: dbDeleteWithdrawal,
    deleteAirdrop: dbDeleteAirdrop 
  } = useDatabase();
  
  // Create initial user based on wallet connection
  const createInitialUser = (walletAddress?: string): User => ({
    id: walletAddress || 'guest',
    walletAddress: walletAddress || '',
    telegram: '',
    twitter: '',
    discord: '',
    completedTasks: {},
    totalPoints: 0,
    isConnected: !!walletAddress,
    balance: '0',
    wallet: walletAddress || '',
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  });

  const [user, setUser] = useLocalStorage<User>('user', createInitialUser());

  // Load data from SQL database when initialized
  useEffect(() => {
    if (isInitialized) {
      const dbAirdrops = getAirdrops();
      const dbUsers = getUsers();
      
      if (dbAirdrops.length > 0) {
        setAirdrops(dbAirdrops);
      } else {
        // Initialize with mock data
        mockAirdrops.forEach(airdrop => saveAirdrop(airdrop));
      }
      
      if (dbUsers.length > 0) {
        setConnectedUsers(dbUsers);
      }
    }
  }, [isInitialized]);

  // Get user-specific withdrawal history
  const withdrawalHistory = isInitialized ? getWithdrawals(user.id) : [];

  // Calculate admin stats based on real data
  const adminStats: AdminStats = {
    totalAirdrops: airdrops.length,
    activeAirdrops: airdrops.filter(a => a.status === 'active').length,
    totalUsers: connectedUsers.length,
    connectedWallets: connectedUsers.filter(u => u.isConnected).length,
    totalRewardsDistributed: `$${(connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0) / 100).toFixed(2)}`,
    totalPointsEarned: connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0)
  };

  const updateUser = (updatedUser: User) => {
    const userWithTimestamp = {
      ...updatedUser,
      lastActive: new Date().toISOString()
    };
    
    setUser(userWithTimestamp);
    if (isInitialized) {
      saveUser(userWithTimestamp);
    }
    
    // Update in connected users list
    setConnectedUsers(prev => {
      const existing = prev.find(u => u.id === userWithTimestamp.id);
      if (existing) {
        return prev.map(u => u.id === userWithTimestamp.id ? userWithTimestamp : u);
      } else {
        return [...prev, userWithTimestamp];
      }
    });
  };

  const updateUserPoints = (userId: string, newPoints: number) => {
    // Update current user if it's them
    if (user.id === userId) {
      const updatedUser = { 
        ...user, 
        totalPoints: newPoints,
        lastActive: new Date().toISOString()
      };
      setUser(updatedUser);
      if (isInitialized) {
        saveUser(updatedUser);
      }
    }
    
    // Update in connected users list
    setConnectedUsers(prev => 
      prev.map(u => u.id === userId ? { 
        ...u, 
        totalPoints: newPoints,
        lastActive: new Date().toISOString()
      } : u)
    );
  };

  // Update user when wallet connection changes
  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      const updatedUser = {
        ...user,
        id: walletState.address,
        walletAddress: walletState.address,
        isConnected: true,
        balance: walletState.balance || '0',
        lastActive: new Date().toISOString()
      };
      
      if (user.id !== walletState.address) {
        // New wallet connected
        setUser(updatedUser);
        updateUser(updatedUser);
      }
    }
  }, [walletState.isConnected, walletState.address]);

  const completeTask = (airdropId: string, taskId: string) => {
    const updatedUser = { ...user };
    if (!updatedUser.completedTasks[airdropId]) {
      updatedUser.completedTasks[airdropId] = [];
    }
    
    if (!updatedUser.completedTasks[airdropId].includes(taskId)) {
      updatedUser.completedTasks[airdropId].push(taskId);
      
      // Find the task and add points
      const airdrop = airdrops.find(a => a.id === airdropId);
      const task = airdrop?.tasks.find(t => t.id === taskId);
      if (task) {
        updatedUser.totalPoints += task.points;
      }
      
      updateUser(updatedUser);
    }
  };

  const withdrawPoints = (points: number) => {
    const updatedUser = { 
      ...user, 
      totalPoints: user.totalPoints - points,
      lastActive: new Date().toISOString()
    };
    updateUser(updatedUser);
  };

  const addAirdrop = (airdropData: Omit<Airdrop, 'id'>) => {
    const newAirdrop: Airdrop = {
      ...airdropData,
      id: Date.now().toString(),
    };
    setAirdrops([...airdrops, newAirdrop]);
    if (isInitialized) {
      saveAirdrop(newAirdrop);
    }
  };

  const updateAirdrop = (id: string, updates: Partial<Airdrop>) => {
    const updatedAirdrops = airdrops.map(airdrop => 
      airdrop.id === id ? { ...airdrop, ...updates } : airdrop
    );
    setAirdrops(updatedAirdrops);
    
    const updatedAirdrop = updatedAirdrops.find(a => a.id === id);
    if (updatedAirdrop && isInitialized) {
      saveAirdrop(updatedAirdrop);
    }
  };

  const deleteAirdrop = (id: string) => {
    setAirdrops(airdrops.filter(airdrop => airdrop.id !== id));
    if (isInitialized) {
      dbDeleteAirdrop(id);
    }
  };

  const addWithdrawal = (withdrawalData: Omit<WithdrawalHistory, 'id'>) => {
    const newWithdrawal: WithdrawalHistory = {
      ...withdrawalData,
      id: Date.now().toString()
    };
    
    if (isInitialized) {
      saveWithdrawal(newWithdrawal);
    }
  };

  const updateWithdrawal = (id: string, updates: Partial<WithdrawalHistory>) => {
    if (isInitialized) {
      dbUpdateWithdrawal(id, updates);
    }
  };

  const deleteWithdrawal = (id: string) => {
    if (isInitialized) {
      dbDeleteWithdrawal(id);
    }
  };

  const getAllWithdrawals = (): WithdrawalHistory[] => {
    return isInitialized ? getWithdrawals() : [];
  };

  return (
    <AppContext.Provider value={{
      airdrops,
      setAirdrops,
      user,
      setUser,
      updateUser,
      adminStats,
      setAdminStats: () => {}, // Read-only calculated stats
      connectedUsers,
      isAdmin,
      setIsAdmin,
      isAdminAuthenticated,
      setIsAdminAuthenticated,
      completeTask,
      addAirdrop,
      updateAirdrop,
      deleteAirdrop,
      withdrawPoints,
      withdrawalHistory,
      updateUserPoints,
      addWithdrawal,
      updateWithdrawal,
      deleteWithdrawal,
      getAllWithdrawals
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}