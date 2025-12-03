import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'points.db'));

console.log('Running database migration...');

try {
    // Add completion_type column to task_catalog
    try {
        db.prepare('ALTER TABLE task_catalog ADD COLUMN completion_type TEXT DEFAULT "once" CHECK(completion_type IN ("once", "multiple"))').run();
        console.log('✔ Added completion_type column to task_catalog');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('✔ completion_type column already exists in task_catalog');
        } else {
            throw e;
        }
    }

    // Add task_assignment_id column to transaction_log
    try {
        db.prepare('ALTER TABLE transaction_log ADD COLUMN task_assignment_id INTEGER').run();
        console.log('✔ Added task_assignment_id column to transaction_log');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('✔ task_assignment_id column already exists in transaction_log');
        } else {
            throw e;
        }
    }

    console.log('\n✅ Migration completed successfully!');
} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
}

db.close();
