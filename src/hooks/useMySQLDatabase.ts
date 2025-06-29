import { useState, useEffect } from 'react';
import { Airdrop, User, WithdrawalHistory } from '../types';

// SQL.js database implementation for browser compatibility
let Database: any = null;
let db: any = null;

const initDatabase = async () => {
  if (!Database) {
    // Import sql.js for browser-compatible SQLite
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs({
      locateFile: (file: string) => `/sql-wasm.wasm`
    });
    
    // Initialize database
    db = new SQL.Database();
    Database = SQL;
    
    // Create tables with MySQL-like syntax
    db.run(`
      CREATE TABLE IF NOT EXISTS airdrops (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        logo TEXT,
        reward TEXT,
        totalReward TEXT,
        participants INTEGER DEFAULT 0,
        maxParticipants INTEGER,
        startDate TEXT,
        endDate TEXT,
        status TEXT DEFAULT 'upcoming' CHECK (status IN ('active', 'completed', 'upcoming')),
        category TEXT,
        blockchain TEXT,
        tasks TEXT,
        requirements TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        walletAddress TEXT,
        telegram TEXT,
        twitter TEXT,
        discord TEXT,
        completedTasks TEXT,
        totalPoints INTEGER DEFAULT 0,
        isConnected INTEGER DEFAULT 0,
        balance TEXT,
        wallet TEXT,
        joinedAt TEXT,
        lastActive TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_wallet ON users (walletAddress)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_points ON users (totalPoints)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_active ON users (lastActive)`);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id TEXT PRIMARY KEY,
        userId TEXT,
        username TEXT,
        amount INTEGER,
        usdcAmount REAL,
        timestamp TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
        txHash TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_user ON withdrawals (userId)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_status ON withdrawals (status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_timestamp ON withdrawals (timestamp)`);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id TEXT,
        action TEXT,
        target_type TEXT,
        target_id TEXT,
        details TEXT,
        ip_address TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_admin ON admin_logs (admin_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_action ON admin_logs (action)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_created ON admin_logs (created_at)`);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        session_token TEXT UNIQUE,
        expires_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_user_session ON user_sessions (user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_token ON user_sessions (session_token)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_expires ON user_sessions (expires_at)`);
    
    // Create triggers for updated_at timestamps
    db.run(`
      CREATE TRIGGER IF NOT EXISTS update_airdrops_timestamp 
      AFTER UPDATE ON airdrops
      BEGIN
        UPDATE airdrops SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);
    
    db.run(`
      CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);
    
    db.run(`
      CREATE TRIGGER IF NOT EXISTS update_withdrawals_timestamp 
      AFTER UPDATE ON withdrawals
      BEGIN
        UPDATE withdrawals SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);
    
    // Insert default settings
    const settingsToInsert = [
      ['points_to_usdc_rate', '100'],
      ['min_withdrawal', '100'],
      ['platform_fee', '0'],
      ['max_daily_withdrawals', '10'],
      ['maintenance_mode', 'false']
    ];
    
    settingsToInsert.forEach(([key, value]) => {
      db.run(`
        INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)
      `, [key, value]);
    });
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
      db.run(`
        INSERT OR REPLACE INTO airdrops 
        (id, title, description, logo, reward, totalReward, participants, maxParticipants, 
         startDate, endDate, status, category, blockchain, tasks, requirements)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
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
      ]);
      
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
      const result = stmt.getAsObject(params);
      const rows: any[] = [];
      
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      
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
      stmt.bind([id]);
      
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        
        return {
          id: row.id as string,
          title: row.title as string,
          description: row.description as string,
          logo: row.logo as string,
          reward: row.reward as string,
          totalReward: row.totalReward as string,
          participants: row.participants as number,
          maxParticipants: row.maxParticipants as number,
          startDate: row.startDate as string,
          endDate: row.endDate as string,
          status: row.status as string,
          category: row.category as string,
          blockchain: row.blockchain as string,
          tasks: JSON.parse((row.tasks as string) || '[]'),
          requirements: JSON.parse((row.requirements as string) || '[]')
        };
      }
      
      stmt.free();
      return null;
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
      
      db.run(`UPDATE airdrops SET ${fields} WHERE id = ?`, [...values, id]);
      return true;
    } catch (error) {
      console.error('Error updating airdrop:', error);
      return false;
    }
  };

  const deleteAirdrop = (id: string) => {
    if (!db) return false;
    
    try {
      db.run('DELETE FROM airdrops WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting airdrop:', error);
      return false;
    }
  };

  // User operations
  const saveUser = (user: User) => {
    if (!db) return false;
    
    try {
      db.run(`
        INSERT OR REPLACE INTO users 
        (id, walletAddress, telegram, twitter, discord, completedTasks, totalPoints, 
         isConnected, balance, wallet, joinedAt, lastActive)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
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
      ]);
      
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
      stmt.bind(params);
      const rows: any[] = [];
      
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      
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
      stmt.bind([id]);
      
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        
        return {
          id: row.id as string,
          walletAddress: row.walletAddress as string,
          telegram: row.telegram as string,
          twitter: row.twitter as string,
          discord: row.discord as string,
          completedTasks: JSON.parse((row.completedTasks as string) || '{}'),
          totalPoints: row.totalPoints as number,
          isConnected: Boolean(row.isConnected),
          balance: row.balance as string,
          wallet: row.wallet as string,
          joinedAt: row.joinedAt as string,
          lastActive: row.lastActive as string
        };
      }
      
      stmt.free();
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  };

  const updateUserPoints = (userId: string, points: number) => {
    if (!db) return false;
    
    try {
      db.run(`
        UPDATE users 
        SET totalPoints = ?, lastActive = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [points, userId]);
      return true;
    } catch (error) {
      console.error('Error updating user points:', error);
      return false;
    }
  };

  // Withdrawal operations
  const saveWithdrawal = (withdrawal: WithdrawalHistory) => {
    if (!db) return false;
    
    try {
      db.run(`
        INSERT OR REPLACE INTO withdrawals 
        (id, userId, username, amount, usdcAmount, timestamp, status, txHash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        withdrawal.id,
        withdrawal.userId,
        withdrawal.username,
        withdrawal.amount,
        withdrawal.usdcAmount,
        withdrawal.timestamp,
        withdrawal.status,
        withdrawal.txHash || null
      ]);
      
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
      stmt.bind(params);
      const rows: any[] = [];
      
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      
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
      
      db.run(`UPDATE withdrawals SET ${fields} WHERE id = ?`, [...values, id]);
      return true;
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      return false;
    }
  };

  const deleteWithdrawal = (id: string) => {
    if (!db) return false;
    
    try {
      db.run('DELETE FROM withdrawals WHERE id = ?', [id]);
      return true;
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
      stmt.bind([key]);
      
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row.setting_value as string;
      }
      
      stmt.free();
      return null;
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  };

  const setSetting = (key: string, value: string) => {
    if (!db) return false;
    
    try {
      db.run(`
        INSERT OR REPLACE INTO settings (setting_key, setting_value) 
        VALUES (?, ?)
      `, [key, value]);
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
      const getCount = (query: string, params: any[] = []) => {
        const stmt = db.prepare(query);
        stmt.bind(params);
        let result = 0;
        if (stmt.step()) {
          const row = stmt.getAsObject();
          result = row.count as number || 0;
        }
        stmt.free();
        return result;
      };

      const getSum = (query: string, params: any[] = []) => {
        const stmt = db.prepare(query);
        stmt.bind(params);
        let result = 0;
        if (stmt.step()) {
          const row = stmt.getAsObject();
          result = row.total as number || 0;
        }
        stmt.free();
        return result;
      };
      
      const totalAirdrops = getCount('SELECT COUNT(*) as count FROM airdrops');
      const activeAirdrops = getCount("SELECT COUNT(*) as count FROM airdrops WHERE status = 'active'");
      const totalUsers = getCount('SELECT COUNT(*) as count FROM users');
      const connectedUsers = getCount('SELECT COUNT(*) as count FROM users WHERE isConnected = 1');
      const totalPoints = getSum('SELECT SUM(totalPoints) as total FROM users');
      const totalWithdrawals = getCount('SELECT COUNT(*) as count FROM withdrawals');
      const pendingWithdrawals = getCount("SELECT COUNT(*) as count FROM withdrawals WHERE status = 'pending'");
      
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
      db.run(`
        INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        adminId,
        action,
        targetType,
        targetId,
        details ? JSON.stringify(details) : null,
        '127.0.0.1' // WebContainer environment
      ]);
      
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
      db.run('VACUUM');
      return true;
    } catch (error) {
      console.error('Error vacuuming database:', error);
      return false;
    }
  };

  const backup = () => {
    if (!db) return null;
    
    try {
      const data = db.export();
      return data;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  };

  const getConnectionInfo = () => {
    return {
      status: connectionStatus,
      isInitialized,
      databaseType: 'SQLite (sql.js)',
      version: '3.x',
      location: 'In-Memory (Browser)'
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