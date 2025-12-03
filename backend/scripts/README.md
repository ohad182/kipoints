# Backend Utility Scripts

This directory contains utility scripts for database maintenance and debugging.

## Scripts

### `check-transactions.js`
**Purpose**: Debug script to check today's transactions in the database.

**Usage**:
```bash
node scripts/check-transactions.js
```

**When to use**: When you need to verify transaction data for debugging purposes.

---

### `fix-categories.js`
**Purpose**: One-time migration script to fix category constraint in task_catalog table to allow 'other' category.

**Usage**:
```bash
node scripts/fix-categories.js
```

**Status**: ✅ Already applied. Keep for reference only.

---

### `migrate.js`
**Purpose**: Database migration script to add:
- `completion_type` column to `task_catalog` table
- `task_assignment_id` column to `transaction_log` table

**Usage**:
```bash
node scripts/migrate.js
```

**Status**: ✅ Already applied. Keep for reference only.

---

## Notes

- All migration scripts are idempotent (safe to run multiple times)
- These scripts connect directly to `points.db`
- Always backup your database before running migration scripts
