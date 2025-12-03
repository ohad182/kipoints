import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'points.db'));

const today = new Date().toISOString().split('T')[0];
console.log('Today:', today);
console.log('\nToday\'s transactions:');
const rows = db.prepare(`
    SELECT id, child_id, action_type, task_assignment_id, description, is_reviewed, DATE(timestamp) as date 
    FROM transaction_log 
    WHERE DATE(timestamp) = ?
`).all(today);

console.log(JSON.stringify(rows, null, 2));

db.close();