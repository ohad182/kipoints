import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'points.db'));

console.log('Fixing category constraint...');

try {
    // Start a transaction
    db.exec('BEGIN TRANSACTION');

    // Create a new table with the correct constraint
    db.exec(`
        CREATE TABLE IF NOT EXISTS task_catalog_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT CHECK(category IN ('morning', 'afternoon', 'evening', 'other')),
            icon TEXT,
            completion_type TEXT CHECK(completion_type IN ('once', 'multiple')) DEFAULT 'once',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Copy data from old table to new table
    db.exec(`
        INSERT INTO task_catalog_new (id, name, category, icon, completion_type, created_at)
        SELECT id, name, category, icon, completion_type, created_at
        FROM task_catalog
    `);

    // Drop the old table
    db.exec('DROP TABLE task_catalog');

    // Rename the new table
    db.exec('ALTER TABLE task_catalog_new RENAME TO task_catalog');

    // Commit the transaction
    db.exec('COMMIT');

    console.log('✅ Category constraint fixed successfully!');
    console.log('   The "other" category is now allowed.');
} catch (error) {
    db.exec('ROLLBACK');
    console.error('❌ Failed to fix category constraint:', error.message);
    process.exit(1);
}

db.close();
