# Настройка MySQL базы данных для AirdropHub

## Требования

- MySQL 8.0 или выше
- Node.js 18+ с пакетом mysql2
- Права администратора для создания базы данных

## Установка и настройка

### 1. Установка MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (с Homebrew)
brew install mysql

# Windows
# Скачайте MySQL Installer с официального сайта
```

### 2. Создание базы данных

```bash
# Войдите в MySQL как root
mysql -u root -p

# Выполните SQL скрипт
source /path/to/project/src/server/database.sql
```

### 3. Создание пользователя для приложения

```sql
-- Создайте пользователя для приложения
CREATE USER 'airdrop_user'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Дайте права на базу данных
GRANT ALL PRIVILEGES ON airdrop_platform.* TO 'airdrop_user'@'localhost';

-- Примените изменения
FLUSH PRIVILEGES;
```

### 4. Настройка подключения

Создайте файл `.env` в корне проекта:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=airdrop_platform
DB_USER=airdrop_user
DB_PASSWORD=secure_password_here

# Application Settings
NODE_ENV=production
PORT=3000
```

### 5. Установка зависимостей

```bash
npm install mysql2 dotenv
```

## Структура базы данных

### Таблицы

1. **airdrops** - Информация о аирдропах
2. **users** - Данные пользователей
3. **withdrawals** - История выводов средств
4. **settings** - Настройки системы
5. **activity_logs** - Логи активности

### Представления

1. **active_airdrops** - Активные аирдропы
2. **user_stats** - Статистика пользователей

### Процедуры

1. **GetUserLeaderboard** - Получение таблицы лидеров
2. **ProcessWithdrawal** - Обработка вывода средств

## Резервное копирование

### Создание бэкапа

```bash
mysqldump -u airdrop_user -p airdrop_platform > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из бэкапа

```bash
mysql -u airdrop_user -p airdrop_platform < backup_file.sql
```

## Мониторинг и обслуживание

### Проверка статуса

```sql
-- Проверка размера базы данных
SELECT 
  table_schema as 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'airdrop_platform';

-- Статистика таблиц
SELECT 
  table_name,
  table_rows,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) as 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'airdrop_platform';
```

### Оптимизация

```sql
-- Анализ и оптимизация таблиц
ANALYZE TABLE airdrops, users, withdrawals;
OPTIMIZE TABLE airdrops, users, withdrawals;
```

## Безопасность

1. **Регулярные обновления** MySQL
2. **Сильные пароли** для пользователей БД
3. **Ограничение доступа** по IP
4. **Шифрование соединений** SSL/TLS
5. **Регулярные бэкапы**

## Производительность

### Рекомендуемые настройки MySQL

```ini
# my.cnf
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M
tmp_table_size = 64M
max_heap_table_size = 64M
```

### Мониторинг запросов

```sql
-- Включение логирования медленных запросов
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
```

## Миграции

Для обновления схемы базы данных создавайте файлы миграций:

```sql
-- migration_001_add_user_preferences.sql
ALTER TABLE users ADD COLUMN preferences JSON;
ALTER TABLE users ADD INDEX idx_preferences (preferences);
```

## Поддержка

При возникновении проблем:

1. Проверьте логи MySQL: `/var/log/mysql/error.log`
2. Убедитесь в правильности настроек подключения
3. Проверьте права пользователя БД
4. Убедитесь, что MySQL сервис запущен