import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'points.db');
const db = new Database(dbPath);

console.log('Starting migration: Ensure all tables use "image" field... \n');

try {
    // Start a transaction
    db.prepare('BEGIN').run();

    // Check rewards table structure
    const rewardsColumns = db.prepare('PRAGMA table_info(rewards)').all();
    const hasRewardIcon = rewardsColumns.some(col => col.name === 'icon');
    const hasRewardImage = rewardsColumns.some(col => col.name === 'image');

    console.log('Rewards table status:');
    console.log(`  - Has 'icon' column: ${hasRewardIcon}`);
    console.log(`  - Has 'image' column: ${hasRewardImage}`);

    if (hasRewardIcon && !hasRewardImage) {
        // Scenario 1: Production database (has icon, needs to rename to image)
        console.log(' → Renaming rewards.icon to rewards.image...');
        db.prepare('ALTER TABLE rewards RENAME COLUMN icon TO image').run();
        console.log(' ✅ Successfully renamed rewards.icon to rewards.image');
    } else if (hasRewardImage && !hasRewardIcon) {
        // Scenario 2: Database already has image field (no action needed)
        console.log(' ✅ Already using image field (no changes needed)');
    } else if (hasRewardIcon && hasRewardImage) {
        // Scenario 3: Both exist (this shouldn't happen, but let's handle it)
        console.log('  ⚠ Warning: Both icon and image columns exist!');
        console.log('Keeping both columns - manual intervention may be needed');
    } else {
        console.log(' ❌ Error: Neither icon nor image column found!');
        throw new Error('Invalid rewards table schema');
    }

    // Check task_catalog table structure
    const taskColumns = db.prepare('PRAGMA table_info(task_catalog)').all();
    const hasTaskIcon = taskColumns.some(col => col.name === 'icon');
    const hasTaskImage = taskColumns.some(col => col.name === 'image');

    console.log('\nTask_catalog table status:');
    console.log(`  - Has 'icon' column: ${hasTaskIcon}`);
    console.log(`  - Has 'image' column: ${hasTaskImage}`);

    if (hasTaskIcon && !hasTaskImage) {
        // Scenario 1: Has icon, needs to rename to image
        console.log('  → Renaming task_catalog.icon to task_catalog.image...');
        db.prepare('ALTER TABLE task_catalog RENAME COLUMN icon TO image').run();
        console.log('  ✅ Successfully renamed task_catalog.icon to task_catalog.image');
    } else if (hasTaskImage && !hasTaskIcon) {
        // Scenario 2: Database already has image field (no action needed)
        console.log('Already using image field (no changes needed)');
    } else if (hasTaskIcon && hasTaskImage) {
        // Scenario 3: Both exist (this shouldn't happen, but let's handle it)
        console.log('  ⚠ Warning: Both icon and image columns exist!');
        console.log('  ℹ Keeping both columns - manual intervention may be needed');
    } else {
        console.log(' ❌ Error: Neither icon nor image column found!');
        throw new Error('Invalid task_catalog table schema');
    }

    // Commit the transaction
    db.prepare('COMMIT').run();

    // Verify data integrity
    console.log('\nVerifying data integrity...');
    const rewards = db.prepare('SELECT * FROM rewards').all();
    const tasks = db.prepare('SELECT * FROM task_catalog').all();
    console.log(`  - Rewards: ${rewards.length} records found`);
    console.log(`  - Tasks: ${tasks.length} records found`);
    if (rewards.length > 0) {
        console.log(`    Example reward: ${rewards[0].name}, image: ${rewards[0].image}`);
    }
    if (tasks.length > 0) {
        console.log(`    Example task: ${tasks[0].name}, image: ${tasks[0].image}`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('All tables now use "image" field for consistency.');
} catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run();
    console.error('\n ❌ Migration failed:', error.message);
    process.exit(1);
} finally {
    db.close();
    console.log('Database connection closed.');
}