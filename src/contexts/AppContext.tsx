import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMySQLDatabase } from '../hooks/useMySQLDatabase';
import { useWallet } from '../hooks/useWallet';
import { Airdrop, User, AdminStats, WithdrawalHistory } from '../types';
import { mockAirdrops } from '../data/mockData';

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
  databaseStatus: string;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [airdrops, setAirdrops] = useLocalStorage<Airdrop[]>('airdrops_cache', []);
  const [connectedUsers, setConnectedUsers] = useLocalStorage<User[]>('users_cache', []);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('isAdmin', false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage<boolean>('isAdminAuthenticated', false);
  const { walletState } = useWallet();
  
  const { 
    isInitialized, 
    connectionStatus,
    saveAirdrop, 
    getAirdrops, 
    getAirdropById,
    updateAirdrop: dbUpdateAirdrop,
    deleteAirdrop: dbDeleteAirdrop,
    saveUser, 
    getUsers,
    getUserById,
    updateUserPoints: dbUpdateUserPoints,
    saveWithdrawal,
    getWithdrawals,
    updateWithdrawal: dbUpdateWithdrawal,
    deleteWithdrawal: dbDeleteWithdrawal,
    getAnalytics,
    logAdminAction,
    getSetting,
    setSetting
  } = useMySQLDatabase();
  
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

  const [user, setUser] = useLocalStorage<User>('user_cache', createInitialUser());

  // Load data from MySQL database when initialized
  useEffect(() => {
    if (isInitialized) {
      refreshData();
      
      // Initialize with mock data if database is empty
      const dbAirdrops = getAirdrops();
      if (dbAirdrops.length === 0) {
        console.log('Initializing database with mock data...');
        mockAirdrops.forEach(airdrop => {
          saveAirdrop(airdrop);
          logAdminAction('system', 'CREATE', 'airdrop', airdrop.id, { title: airdrop.title });
        });
        refreshData();
      }
    }
  }, [isInitialized]);

  const refreshData = () => {
    if (!isInitialized) return;
    
    try {
      // Load airdrops from database
      const dbAirdrops = getAirdrops();
      setAirdrops(dbAirdrops);
      
      // Load users from database
      const dbUsers = getUsers();
      setConnectedUsers(dbUsers);
      
      // Load current user if exists
      if (walletState.address) {
        const currentUser = getUserById(walletState.address);
        if (currentUser) {
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Get user-specific withdrawal history
  const withdrawalHistory = isInitialized ? getWithdrawals(user.id) : [];

  // Calculate admin stats from database
  const getAdminStats = (): AdminStats => {
    if (!isInitialized) {
      return {
        totalAirdrops: 0,
        activeAirdrops: 0,
        totalUsers: 0,
        connectedWallets: 0,
        totalRewardsDistributed: '$0.00',
        totalPointsEarned: 0
      };
    }
    
    const analytics = getAnalytics();
    if (!analytics) {
      return {
        totalAirdrops: airdrops.length,
        activeAirdrops: airdrops.filter(a => a.status === 'active').length,
        totalUsers: connectedUsers.length,
        connectedWallets: connectedUsers.filter(u => u.isConnected).length,
        totalRewardsDistributed: `$${(connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0) / 100).toFixed(2)}`,
        totalPointsEarned: connectedUsers.reduce((sum, u) => sum + u.totalPoints, 0)
      };
    }
    
    return {
      totalAirdrops: analytics.totalAirdrops,
      activeAirdrops: analytics.activeAirdrops,
      totalUsers: analytics.totalUsers,
      connectedWallets: analytics.connectedUsers,
      totalRewardsDistributed: analytics.totalRewardsDistributed,
      totalPointsEarned: analytics.totalPoints
    };
  };

  const adminStats = getAdminStats();

  const updateUser = (updatedUser: User) => {
    const userWithTimestamp = {
      ...updatedUser,
      lastActive: new Date().toISOString()
    };
    
    setUser(userWithTimestamp);
    
    if (isInitialized) {
      saveUser(userWithTimestamp);
      refreshData();
    }
  };

  const updateUserPoints = (userId: string, newPoints: number) => {
    if (isInitialized) {
      dbUpdateUserPoints(userId, newPoints);
      logAdminAction('admin', 'UPDATE_POINTS', 'user', userId, { newPoints });
      refreshData();
    }
    
    // Update current user if it's them
    if (user.id === userId) {
      const updatedUser = { 
        ...user, 
        totalPoints: newPoints,
        lastActive: new Date().toISOString()
      };
      setUser(updatedUser);
    }
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
        // New wallet connected - check if user exists in database
        if (isInitialized) {
          const existingUser = getUserById(walletState.address);
          if (existingUser) {
            setUser(existingUser);
          } else {
            // Create new user
            const newUser = {
              ...updatedUser,
              joinedAt: new Date().toISOString()
            };
            setUser(newUser);
            updateUser(newUser);
          }
        } else {
          setUser(updatedUser);
        }
      } else {
        updateUser(updatedUser);
      }
    }
  }, [walletState.isConnected, walletState.address, isInitialized]);

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
        
        if (isInitialized) {
          logAdminAction(user.id, 'COMPLETE_TASK', 'task', taskId, { 
            airdropId, 
            points: task.points,
            taskTitle: task.title 
          });
        }
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
    
    if (isInitialized) {
      logAdminAction(user.id, 'WITHDRAW_POINTS', 'user', user.id, { points });
    }
  };

  const addAirdrop = (airdropData: Omit<Airdrop, 'id'>) => {
    const newAirdrop: Airdrop = {
      ...airdropData,
      id: Date.now().toString(),
    };
    
    if (isInitialized) {
      saveAirdrop(newAirdrop);
      logAdminAction('admin', 'CREATE', 'airdrop', newAirdrop.id, { title: newAirdrop.title });
      refreshData();
    } else {
      setAirdrops([...airdrops, newAirdrop]);
    }
  };

  const updateAirdrop = (id: string, updates: Partial<Airdrop>) => {
    if (isInitialized) {
      dbUpdateAirdrop(id, updates);
      logAdminAction('admin', 'UPDATE', 'airdrop', id, updates);
      refreshData();
    } else {
      const updatedAirdrops = airdrops.map(airdrop => 
        airdrop.id === id ? { ...airdrop, ...updates } : airdrop
      );
      setAirdrops(updatedAirdrops);
    }
  };

  const deleteAirdrop = (id: string) => {
    if (isInitialized) {
      const airdrop = getAirdropById(id);
      dbDeleteAirdrop(id);
      logAdminAction('admin', 'DELETE', 'airdrop', id, { title: airdrop?.title });
      refreshData();
    } else {
      setAirdrops(airdrops.filter(airdrop => airdrop.id !== id));
    }
  };

  const addWithdrawal = (withdrawalData: Omit<WithdrawalHistory, 'id'>) => {
    const newWithdrawal: WithdrawalHistory = {
      ...withdrawalData,
      id: Date.now().toString()
    };
    
    if (isInitialized) {
      saveWithdrawal(newWithdrawal);
      logAdminAction('admin', 'CREATE', 'withdrawal', newWithdrawal.id, {
        userId: withdrawalData.userId,
        amount: withdrawalData.amount
      });
    }
  };

  const updateWithdrawal = (id: string, updates: Partial<WithdrawalHistory>) => {
    if (isInitialized) {
      dbUpdateWithdrawal(id, updates);
      logAdminAction('admin', 'UPDATE', 'withdrawal', id, updates);
    }
  };

  const deleteWithdrawal = (id: string) => {
    if (isInitialized) {
      dbDeleteWithdrawal(id);
      logAdminAction('admin', 'DELETE', 'withdrawal', id);
    }
  };

  const getAllWithdrawals = (): WithdrawalHistory[] => {
    return isInitialized ? getWithdrawals() : [];
  };

  const databaseStatus = isInitialized 
    ? `Connected (${connectionStatus})` 
    : `Connecting... (${connectionStatus})`;

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
      getAllWithdrawals,
      databaseStatus,
      refreshData
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