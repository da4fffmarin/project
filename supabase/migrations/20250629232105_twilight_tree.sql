-- AirdropHub MySQL Database Schema
-- Создание базы данных для платформы аирдропов

CREATE DATABASE IF NOT EXISTS airdrop_platform;
USE airdrop_platform;

-- Таблица аирдропов
CREATE TABLE IF NOT EXISTS airdrops (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_blockchain (blockchain),
  INDEX idx_dates (startDate, endDate)
);

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  walletAddress VARCHAR(255) UNIQUE,
  telegram VARCHAR(100),
  twitter VARCHAR(100),
  discord VARCHAR(100),
  completedTasks JSON,
  totalPoints INT DEFAULT 0,
  isConnected BOOLEAN DEFAULT FALSE,
  balance VARCHAR(50),
  wallet VARCHAR(255),
  joinedAt DATETIME,
  lastActive DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_wallet (walletAddress),
  INDEX idx_points (totalPoints),
  INDEX idx_active (lastActive),
  INDEX idx_connected (isConnected)
);

-- Таблица выводов средств
CREATE TABLE IF NOT EXISTS withdrawals (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255),
  username VARCHAR(255),
  amount INT NOT NULL,
  usdcAmount DECIMAL(10,2) NOT NULL,
  timestamp DATETIME,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  txHash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (userId),
  INDEX idx_status (status),
  INDEX idx_timestamp (timestamp)
);

-- Таблица настроек системы
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица логов активности
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (userId),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
);

-- Вставка начальных настроек
INSERT INTO settings (setting_key, setting_value, description) VALUES
('points_to_usdc_rate', '100', 'Количество поинтов за 1 USDC'),
('min_withdrawal', '100', 'Минимальная сумма для вывода в поинтах'),
('platform_fee', '0', 'Комиссия платформы в процентах'),
('max_airdrops_per_user', '10', 'Максимальное количество активных аирдропов на пользователя')
ON DUPLICATE KEY UPDATE 
setting_value = VALUES(setting_value),
updated_at = CURRENT_TIMESTAMP;

-- Создание представлений для удобства
CREATE OR REPLACE VIEW active_airdrops AS
SELECT * FROM airdrops 
WHERE status = 'active' 
AND startDate <= NOW() 
AND endDate >= NOW();

CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.walletAddress,
  u.totalPoints,
  COUNT(w.id) as total_withdrawals,
  COALESCE(SUM(w.amount), 0) as total_withdrawn,
  COUNT(DISTINCT JSON_UNQUOTE(JSON_KEYS(u.completedTasks))) as completed_airdrops
FROM users u
LEFT JOIN withdrawals w ON u.id = w.userId
GROUP BY u.id;

-- Триггеры для автоматического обновления
DELIMITER //

CREATE TRIGGER update_airdrop_participants 
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  -- Обновляем количество участников в аирдропах при изменении completedTasks
  IF OLD.completedTasks != NEW.completedTasks THEN
    -- Здесь можно добавить логику обновления счетчиков участников
    INSERT INTO activity_logs (userId, action, details) 
    VALUES (NEW.id, 'task_completed', JSON_OBJECT('old_tasks', OLD.completedTasks, 'new_tasks', NEW.completedTasks));
  END IF;
END//

CREATE TRIGGER log_withdrawal_changes
AFTER UPDATE ON withdrawals
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO activity_logs (userId, action, details)
    VALUES (NEW.userId, 'withdrawal_status_changed', 
            JSON_OBJECT('withdrawal_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status));
  END IF;
END//

DELIMITER ;

-- Индексы для оптимизации производительности
CREATE INDEX idx_airdrops_composite ON airdrops (status, startDate, endDate);
CREATE INDEX idx_users_composite ON users (isConnected, totalPoints DESC);
CREATE INDEX idx_withdrawals_composite ON withdrawals (userId, status, timestamp DESC);

-- Процедуры для часто используемых операций
DELIMITER //

CREATE PROCEDURE GetUserLeaderboard(IN limit_count INT)
BEGIN
  SELECT 
    u.id,
    u.walletAddress,
    u.totalPoints,
    COUNT(DISTINCT JSON_UNQUOTE(JSON_KEYS(u.completedTasks))) as completed_airdrops,
    RANK() OVER (ORDER BY u.totalPoints DESC) as rank_position
  FROM users u
  WHERE u.totalPoints > 0
  ORDER BY u.totalPoints DESC
  LIMIT limit_count;
END//

CREATE PROCEDURE ProcessWithdrawal(
  IN user_id VARCHAR(255),
  IN withdrawal_amount INT,
  IN tx_hash VARCHAR(255)
)
BEGIN
  DECLARE user_points INT DEFAULT 0;
  DECLARE withdrawal_id VARCHAR(255);
  
  START TRANSACTION;
  
  -- Получаем текущие поинты пользователя
  SELECT totalPoints INTO user_points FROM users WHERE id = user_id FOR UPDATE;
  
  -- Проверяем достаточность средств
  IF user_points >= withdrawal_amount THEN
    -- Создаем запись о выводе
    SET withdrawal_id = UUID();
    INSERT INTO withdrawals (id, userId, amount, usdcAmount, timestamp, status, txHash)
    VALUES (withdrawal_id, user_id, withdrawal_amount, withdrawal_amount/100, NOW(), 'completed', tx_hash);
    
    -- Списываем поинты
    UPDATE users SET totalPoints = totalPoints - withdrawal_amount WHERE id = user_id;
    
    COMMIT;
    SELECT 'success' as result, withdrawal_id as id;
  ELSE
    ROLLBACK;
    SELECT 'insufficient_funds' as result, NULL as id;
  END IF;
END//

DELIMITER ;