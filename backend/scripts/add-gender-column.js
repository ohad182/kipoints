import Database from 'better-sqlite3';
const db = new Database('./points.db');

console.log('Adding gender column to children table...');

try {
    // Check if column already exists
    const columns = db.prepare('PRAGMA table_info(children)').all();
    const hasGender = columns.some(col => col.name === 'gender');
    if (hasGender) {
        console.log('✔ Gender column already exists. No migration needed.');
    } else {
        // Add gender column with default value
        db.prepare('ALTER TABLE children ADD COLUMN gender TEXT CHECK(gender IN (\'boy\', \'girl\', \'not-set\')) DEFAULT \'not-set\'').run();
        
        // Update existing rows to have the default value
        db.prepare('UPDATE children SET gender = \'not-set\' WHERE gender IS NULL').run();

        console.log('✔ Gender column added successfully!');
        console.log(' All existing children set to "not-set"');
    }
} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
} finally {
    db.close();
}

console.log('\nMigration complete!');