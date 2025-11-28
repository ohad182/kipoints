import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'points.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    balance INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

    CREATE TABLE IF NOT EXISTS task_catalog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT CHECK(category IN ('morning', 'afternoon', 'evening', 'other')),
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

    CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cost INTEGER NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

    CREATE TABLE IF NOT EXISTS task_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES task_catalog(id) ON DELETE CASCADE,
    UNIQUE(child_id, task_id)
  );

    CREATE TABLE IF NOT EXISTS transaction_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    action_type TEXT CHECK(action_type IN ('task', 'reward', 'penalty', 'bonus')),
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    is_reviewed BOOLEAN DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_transactions_child ON transaction_log(child_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_reviewed ON transaction_log(is_reviewed);

  `);

console.log('Database initialized');

export default db;