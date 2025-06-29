import { useState, useEffect } from 'react';
import { Airdrop, User, WithdrawalHistory, DatabaseState } from '../types';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

// SQL.js database implementation
let SQL: any = null;
let db: any = null;

const initDatabase = async () => {
  if (!SQL) {
    // Import SQL.js dynamically
    const sqlModule = await import('sql.js');
    // Initialize SQL.js properly with locateFile option to find WASM file
    SQL = await sqlModule.default({
      locateFile: () => sqlWasmUrl
    });
    
    // Initialize database
    db = new SQL.Database();
    
    // Create tables
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
        status TEXT,
        category TEXT,
        blockchain TEXT,
        tasks TEXT,
        requirements TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        isConnected BOOLEAN DEFAULT 0,
        balance TEXT,
        wallet TEXT,
        joinedAt TEXT,
        lastActive TEXT
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id TEXT PRIMARY KEY,
        userId TEXT,
        username TEXT,
        amount INTEGER,
        usdcAmount REAL,
        timestamp TEXT,
        status TEXT,
        txHash TEXT,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
};

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initDatabase().then(() => {
      setIsInitialized(true);
    });
  }, []);

  const saveAirdrop = (airdrop: Airdrop) => {
    if (!db) return;
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO airdrops 
      (id, title, description, logo, reward, totalReward, participants, maxParticipants, 
       startDate, endDate, status, category, blockchain, tasks, requirements)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
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
    
    stmt.free();
  };

  const getAirdrops = (): Airdrop[] => {
    if (!db) return [];
    
    const stmt = db.prepare('SELECT * FROM airdrops ORDER BY created_at DESC');
    const airdrops: Airdrop[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      airdrops.push({
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
        status: row.status as any,
        category: row.category as string,
        blockchain: row.blockchain as string,
        tasks: JSON.parse(row.tasks as string),
        requirements: JSON.parse(row.requirements as string)
      });
    }
    
    stmt.free();
    return airdrops;
  };

  const deleteAirdrop = (id: string) => {
    if (!db) return;
    
    const stmt = db.prepare('DELETE FROM airdrops WHERE id = ?');
    stmt.run([id]);
    stmt.free();
  };

  const saveUser = (user: User) => {
    if (!db) return;
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users 
      (id, walletAddress, telegram, twitter, discord, completedTasks, totalPoints, 
       isConnected, balance, wallet, joinedAt, lastActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
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
    
    stmt.free();
  };

  const getUsers = (): User[] => {
    if (!db) return [];
    
    const stmt = db.prepare('SELECT * FROM users');
    const users: User[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      users.push({
        id: row.id as string,
        walletAddress: row.walletAddress as string,
        telegram: row.telegram as string,
        twitter: row.twitter as string,
        discord: row.discord as string,
        completedTasks: JSON.parse(row.completedTasks as string),
        totalPoints: row.totalPoints as number,
        isConnected: Boolean(row.isConnected),
        balance: row.balance as string,
        wallet: row.wallet as string,
        joinedAt: row.joinedAt as string,
        lastActive: row.lastActive as string
      });
    }
    
    stmt.free();
    return users;
  };

  const saveWithdrawal = (withdrawal: WithdrawalHistory) => {
    if (!db) return;
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO withdrawals 
      (id, userId, username, amount, usdcAmount, timestamp, status, txHash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      withdrawal.id,
      withdrawal.userId,
      withdrawal.username,
      withdrawal.amount,
      withdrawal.usdcAmount,
      withdrawal.timestamp,
      withdrawal.status,
      withdrawal.txHash || null
    ]);
    
    stmt.free();
  };

  const getWithdrawals = (userId?: string): WithdrawalHistory[] => {
    if (!db) return [];
    
    let query = 'SELECT * FROM withdrawals';
    let params: any[] = [];
    
    if (userId) {
      query += ' WHERE userId = ?';
      params = [userId];
    }
    
    query += ' ORDER BY timestamp DESC';
    
    const stmt = db.prepare(query);
    const withdrawals: WithdrawalHistory[] = [];
    
    if (params.length > 0) {
      stmt.bind(params);
    }
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      withdrawals.push({
        id: row.id as string,
        userId: row.userId as string,
        username: row.username as string,
        amount: row.amount as number,
        usdcAmount: row.usdcAmount as number,
        timestamp: row.timestamp as string,
        status: row.status as any,
        txHash: row.txHash as string
      });
    }
    
    stmt.free();
    return withdrawals;
  };

  const updateWithdrawal = (id: string, updates: Partial<WithdrawalHistory>) => {
    if (!db) return;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const stmt = db.prepare(`UPDATE withdrawals SET ${fields} WHERE id = ?`);
    stmt.run([...values, id]);
    stmt.free();
  };

  const deleteWithdrawal = (id: string) => {
    if (!db) return;
    
    const stmt = db.prepare('DELETE FROM withdrawals WHERE id = ?');
    stmt.run([id]);
    stmt.free();
  };

  const exportDatabase = () => {
    if (!db) return;
    
    const data = db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `airdrop_database_${new Date().toISOString().split('T')[0]}.db`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearDatabase = () => {
    if (!db) return;
    
    db.run('DELETE FROM airdrops');
    db.run('DELETE FROM users');
    db.run('DELETE FROM withdrawals');
    db.run('DELETE FROM settings');
  };

  return {
    isInitialized,
    saveAirdrop,
    getAirdrops,
    deleteAirdrop,
    saveUser,
    getUsers,
    saveWithdrawal,
    getWithdrawals,
    updateWithdrawal,
    deleteWithdrawal,
    exportDatabase,
    clearDatabase
  };
}