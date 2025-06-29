import { useState, useEffect } from 'react';
import { Airdrop, User, WithdrawalHistory } from '../types';

// MySQL-compatible database implementation using better-sqlite3 for WebContainer
let Database: any = null;
let db: any = null;

const initDatabase = async () => {
  if (!Database) {
    // Import better-sqlite3 for MySQL-like functionality
    const sqlite3 = await import('better-sqlite3');
    Database = sqlite3.default;
    
    // Initialize database with MySQL-like structure
    db = new Database(':memory:');
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Create tables with MySQL-like syntax
    db.exec(`
      CREATE TABLE IF NOT EXISTS airdrops (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        logo VARCHAR(10),
        reward VARCHAR(100),
        totalReward VARCHAR(100),
        participants INT DEFAULT 0,
        maxParticipants INT,
        startDate DATETIME,
        endDate DATETIME,
        status ENUM('active', 'completed', 'upcoming') DEFAULT 'upcoming',
        category VARCHAR(100),
        blockchain VARCHAR(100),
        tasks JSON,
        requirements JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        walletAddress VARCHAR(255),
        telegram VARCHAR(100),
        twitter VARCHAR(100),
        discord VARCHAR(100),
        completedTasks JSON,
        totalPoints INT DEFAULT 0,
        isConnected BOOLEAN DEFAULT 0,
        balance VARCHAR(50),
        wallet VARCHAR(255),
        joinedAt DATETIME,
        lastActive DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_wallet (walletAddress),
        INDEX idx_points (totalPoints),
        INDEX idx_active (lastActive)
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255),
        username VARCHAR(255),
        amount INT,
        usdcAmount DECIMAL(10,2),
        timestamp DATETIME,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        txHash VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
        INDEX idx_user (userId),
        INDEX idx_status (status),
        INDEX idx_timestamp (timestamp)
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTOINCREMENT,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id INT PRIMARY KEY AUTOINCREMENT,
        admin_id VARCHAR(255),
        action VARCHAR(255),
        target_type VARCHAR(100),
        target_id VARCHAR(255),
        details JSON,
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_admin (admin_id),
        INDEX idx_action (action),
        INDEX idx_created (created_at)
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT PRIMARY KEY AUTOINCREMENT,
        user_id VARCHAR(255),
        session_token VARCHAR(255) UNIQUE,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_token (session_token),
        INDEX idx_expires (expires_at)
      )
    `);
    
    // Create triggers for updated_at timestamps (MySQL-like behavior)
    db.exec(`
      CREATE TRIGGER update_airdrops_timestamp 
      AFTER UPDATE ON airdrops
      BEGIN
        UPDATE airdrops SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);
    
    db.exec(`
      CREATE TRIGGER update_users_timestamp 
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);
    
    db.exec(`
      CREATE TRIGGER update_withdrawals_timestamp 
      AFTER UPDATE ON withdrawals
      BEGIN
        UPDATE withdrawals SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);
    
    // Insert default settings
    const insertSetting = db.prepare(`
      INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)
    `);
    
    insertSetting.run('points_to_usdc_rate', '100');
    insertSetting.run('min_withdrawal', '100');
    insertSetting.run('platform_fee', '0');
    insertSetting.run('max_daily_withdrawals', '10');
    insertSetting.run('maintenance_mode', 'false');
  }
};

export function useMySQLDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    initDatabase()
      .then(() => {
        setIsInitialized(true);
        setConnectionStatus('connected');
      })
      .catch((error) => {
        console.error('Database initialization failed:', error);
        setConnectionStatus('error');
      });
  }, []);

  // Airdrop operations
  const saveAirdrop = (airdrop: Airdrop) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO airdrops 
        (id, title, description, logo, reward, totalReward, participants, maxParticipants, 
         startDate, endDate, status, category, blockchain, tasks, requirements)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        airdrop.id,
        airdrop.title,
        airdrop.description,
        airdrop.logo,
        airdrop.reward,
        airdrop.totalReward,
        airdrop.participants,
        airdrop.maxParticipants,
        airdrop.startDate,
        airdrop.endDate,
        airdrop.status,
        airdrop.category,
        airdrop.blockchain,
        JSON.stringify(airdrop.tasks),
        JSON.stringify(airdrop.requirements)
      );
      
      return true;
    } catch (error) {
      console.error('Error saving airdrop:', error);
      return false;
    }
  };

  const getAirdrops = (filters?: {
    status?: string;
    category?: string;
    blockchain?: string;
    limit?: number;
    offset?: number;
  }): Airdrop[] => {
    if (!db) return [];
    
    try {
      let query = 'SELECT * FROM airdrops WHERE 1=1';
      const params: any[] = [];
      
      if (filters?.status && filters.status !== 'all') {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      if (filters?.category && filters.category !== 'all') {
        query += ' AND category = ?';
        params.push(filters.category);
      }
      
      if (filters?.blockchain && filters.blockchain !== 'all') {
        query += ' AND blockchain = ?';
        params.push(filters.blockchain);
      }
      
      query += ' ORDER BY created_at DESC';
      
      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
        
        if (filters?.offset) {
          query += ' OFFSET ?';
          params.push(filters.offset);
        }
      }
      
      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      
      return rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        logo: row.logo,
        reward: row.reward,
        totalReward: row.totalReward,
        participants: row.participants,
        maxParticipants: row.maxParticipants,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status,
        category: row.category,
        blockchain: row.blockchain,
        tasks: JSON.parse(row.tasks || '[]'),
        requirements: JSON.parse(row.requirements || '[]')
      }));
    } catch (error) {
      console.error('Error getting airdrops:', error);
      return [];
    }
  };

  const getAirdropById = (id: string): Airdrop | null => {
    if (!db) return null;
    
    try {
      const stmt = db.prepare('SELECT * FROM airdrops WHERE id = ?');
      const row = stmt.get(id);
      
      if (!row) return null;
      
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        logo: row.logo,
        reward: row.reward,
        totalReward: row.totalReward,
        participants: row.participants,
        maxParticipants: row.maxParticipants,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status,
        category: row.category,
        blockchain: row.blockchain,
        tasks: JSON.parse(row.tasks || '[]'),
        requirements: JSON.parse(row.requirements || '[]')
      };
    } catch (error) {
      console.error('Error getting airdrop by ID:', error);
      return null;
    }
  };

  const updateAirdrop = (id: string, updates: Partial<Airdrop>) => {
    if (!db) return false;
    
    try {
      const fields = Object.keys(updates)
        .filter(key => key !== 'id')
        .map(key => `${key} = ?`)
        .join(', ');
      
      if (!fields) return false;
      
      const values = Object.entries(updates)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => {
          if (key === 'tasks' || key === 'requirements') {
            return JSON.stringify(value);
          }
          return value;
        });
      
      const stmt = db.prepare(`UPDATE airdrops SET ${fields} WHERE id = ?`);
      const result = stmt.run(...values, id);
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating airdrop:', error);
      return false;
    }
  };

  const deleteAirdrop = (id: string) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare('DELETE FROM airdrops WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting airdrop:', error);
      return false;
    }
  };

  // User operations
  const saveUser = (user: User) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO users 
        (id, walletAddress, telegram, twitter, discord, completedTasks, totalPoints, 
         isConnected, balance, wallet, joinedAt, lastActive)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        user.id,
        user.walletAddress || '',
        user.telegram || '',
        user.twitter || '',
        user.discord || '',
        JSON.stringify(user.completedTasks),
        user.totalPoints,
        user.isConnected ? 1 : 0,
        user.balance || '',
        user.wallet || '',
        user.joinedAt,
        user.lastActive
      );
      
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  };

  const getUsers = (filters?: {
    isConnected?: boolean;
    minPoints?: number;
    limit?: number;
    offset?: number;
  }): User[] => {
    if (!db) return [];
    
    try {
      let query = 'SELECT * FROM users WHERE 1=1';
      const params: any[] = [];
      
      if (filters?.isConnected !== undefined) {
        query += ' AND isConnected = ?';
        params.push(filters.isConnected ? 1 : 0);
      }
      
      if (filters?.minPoints !== undefined) {
        query += ' AND totalPoints >= ?';
        params.push(filters.minPoints);
      }
      
      query += ' ORDER BY totalPoints DESC, lastActive DESC';
      
      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
        
        if (filters?.offset) {
          query += ' OFFSET ?';
          params.push(filters.offset);
        }
      }
      
      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      
      return rows.map((row: any) => ({
        id: row.id,
        walletAddress: row.walletAddress,
        telegram: row.telegram,
        twitter: row.twitter,
        discord: row.discord,
        completedTasks: JSON.parse(row.completedTasks || '{}'),
        totalPoints: row.totalPoints,
        isConnected: Boolean(row.isConnected),
        balance: row.balance,
        wallet: row.wallet,
        joinedAt: row.joinedAt,
        lastActive: row.lastActive
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const getUserById = (id: string): User | null => {
    if (!db) return null;
    
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      const row = stmt.get(id);
      
      if (!row) return null;
      
      return {
        id: row.id,
        walletAddress: row.walletAddress,
        telegram: row.telegram,
        twitter: row.twitter,
        discord: row.discord,
        completedTasks: JSON.parse(row.completedTasks || '{}'),
        totalPoints: row.totalPoints,
        isConnected: Boolean(row.isConnected),
        balance: row.balance,
        wallet: row.wallet,
        joinedAt: row.joinedAt,
        lastActive: row.lastActive
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  };

  const updateUserPoints = (userId: string, points: number) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare(`
        UPDATE users 
        SET totalPoints = ?, lastActive = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      const result = stmt.run(points, userId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating user points:', error);
      return false;
    }
  };

  // Withdrawal operations
  const saveWithdrawal = (withdrawal: WithdrawalHistory) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO withdrawals 
        (id, userId, username, amount, usdcAmount, timestamp, status, txHash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        withdrawal.id,
        withdrawal.userId,
        withdrawal.username,
        withdrawal.amount,
        withdrawal.usdcAmount,
        withdrawal.timestamp,
        withdrawal.status,
        withdrawal.txHash || null
      );
      
      return true;
    } catch (error) {
      console.error('Error saving withdrawal:', error);
      return false;
    }
  };

  const getWithdrawals = (userId?: string, filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): WithdrawalHistory[] => {
    if (!db) return [];
    
    try {
      let query = 'SELECT * FROM withdrawals WHERE 1=1';
      const params: any[] = [];
      
      if (userId) {
        query += ' AND userId = ?';
        params.push(userId);
      }
      
      if (filters?.status && filters.status !== 'all') {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      query += ' ORDER BY timestamp DESC';
      
      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
        
        if (filters?.offset) {
          query += ' OFFSET ?';
          params.push(filters.offset);
        }
      }
      
      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      
      return rows.map((row: any) => ({
        id: row.id,
        userId: row.userId,
        username: row.username,
        amount: row.amount,
        usdcAmount: row.usdcAmount,
        timestamp: row.timestamp,
        status: row.status,
        txHash: row.txHash
      }));
    } catch (error) {
      console.error('Error getting withdrawals:', error);
      return [];
    }
  };

  const updateWithdrawal = (id: string, updates: Partial<WithdrawalHistory>) => {
    if (!db) return false;
    
    try {
      const fields = Object.keys(updates)
        .filter(key => key !== 'id')
        .map(key => `${key} = ?`)
        .join(', ');
      
      if (!fields) return false;
      
      const values = Object.entries(updates)
        .filter(([key]) => key !== 'id')
        .map(([, value]) => value);
      
      const stmt = db.prepare(`UPDATE withdrawals SET ${fields} WHERE id = ?`);
      const result = stmt.run(...values, id);
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      return false;
    }
  };

  const deleteWithdrawal = (id: string) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare('DELETE FROM withdrawals WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting withdrawal:', error);
      return false;
    }
  };

  // Settings operations
  const getSetting = (key: string): string | null => {
    if (!db) return null;
    
    try {
      const stmt = db.prepare('SELECT setting_value FROM settings WHERE setting_key = ?');
      const row = stmt.get(key);
      return row ? row.setting_value : null;
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  };

  const setSetting = (key: string, value: string) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO settings (setting_key, setting_value) 
        VALUES (?, ?)
      `);
      stmt.run(key, value);
      return true;
    } catch (error) {
      console.error('Error setting value:', error);
      return false;
    }
  };

  // Analytics operations
  const getAnalytics = () => {
    if (!db) return null;
    
    try {
      const totalAirdrops = db.prepare('SELECT COUNT(*) as count FROM airdrops').get().count;
      const activeAirdrops = db.prepare("SELECT COUNT(*) as count FROM airdrops WHERE status = 'active'").get().count;
      const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
      const connectedUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE isConnected = 1').get().count;
      const totalPoints = db.prepare('SELECT SUM(totalPoints) as total FROM users').get().total || 0;
      const totalWithdrawals = db.prepare('SELECT COUNT(*) as count FROM withdrawals').get().count;
      const pendingWithdrawals = db.prepare("SELECT COUNT(*) as count FROM withdrawals WHERE status = 'pending'").get().count;
      
      return {
        totalAirdrops,
        activeAirdrops,
        totalUsers,
        connectedUsers,
        totalPoints,
        totalWithdrawals,
        pendingWithdrawals,
        totalRewardsDistributed: `$${(totalPoints / 100).toFixed(2)}`
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  };

  // Admin logging
  const logAdminAction = (adminId: string, action: string, targetType: string, targetId: string, details?: any) => {
    if (!db) return false;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        adminId,
        action,
        targetType,
        targetId,
        details ? JSON.stringify(details) : null,
        '127.0.0.1' // WebContainer environment
      );
      
      return true;
    } catch (error) {
      console.error('Error logging admin action:', error);
      return false;
    }
  };

  // Database maintenance
  const vacuum = () => {
    if (!db) return false;
    
    try {
      db.exec('VACUUM');
      return true;
    } catch (error) {
      console.error('Error vacuuming database:', error);
      return false;
    }
  };

  const backup = () => {
    if (!db) return null;
    
    try {
      const backup = db.serialize();
      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  };

  const getConnectionInfo = () => {
    return {
      status: connectionStatus,
      isInitialized,
      databaseType: 'SQLite (MySQL-compatible)',
      version: '3.x',
      location: 'In-Memory'
    };
  };

  return {
    // Connection info
    isInitialized,
    connectionStatus,
    getConnectionInfo,
    
    // Airdrop operations
    saveAirdrop,
    getAirdrops,
    getAirdropById,
    updateAirdrop,
    deleteAirdrop,
    
    // User operations
    saveUser,
    getUsers,
    getUserById,
    updateUserPoints,
    
    // Withdrawal operations
    saveWithdrawal,
    getWithdrawals,
    updateWithdrawal,
    deleteWithdrawal,
    
    // Settings operations
    getSetting,
    setSetting,
    
    // Analytics
    getAnalytics,
    
    // Admin operations
    logAdminAction,
    
    // Maintenance
    vacuum,
    backup
  };
}