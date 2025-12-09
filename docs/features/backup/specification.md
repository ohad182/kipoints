# Import/Export Feature

**Status:** ✅ IMPLEMENTED (Dec 3, 2025)

## Overview
Backup and restore all app data (children, tasks, rewards, assignments, transactions) as JSON.

## Data Structure
```json
{
  "version": "1.0",
  "exportDate": "2025-12-03T10:30:00Z",
  "data": {
    "children": [...],
    "tasks": [...],
    "rewards": [...],
    "assignments": [...],
    "transactions": [...]
  }
}
```

## Features

### Export
- Downloads JSON file with all data
- Filename: `points-backup-{timestamp}.json`
- Includes complete transaction history
- Version number for compatibility checking

### Import
- Upload JSON backup file
- Validates version compatibility
- **Replaces ALL existing data** (with confirmation)
- Atomic transaction (all-or-nothing)
- Restores database to backup state

## UI Location
**Parent Dashboard ➔ Backup Tab**

Two main actions:
1. **Export Full Backup** button
  - Triggers download of JSON file
  - No data modification

2. **Choose File to Import** button
  - File picker for JSON file
  - Shows confirmation dialog
  - Warning: "This will replace all current data!"
  - Performs import on confirmation

## API Endpoints

**GET /api/export**
- Returns JSON with all data
- Sets Content-Disposition header for download
- No parameters needed

**POST /api/import**
- Body: Uploaded JSON data
- Validates version
- Clears existing data
- Inserts backup data
- Uses database transaction for atomicity

## Security Considerations
- **Backup Tab requires parent authentication**
- Import confirmation dialog prevents accidents
- Atomic transactions prevent partial imports
- Version validation prevents incompatible restores

## Implementation Notes
- Uses browser download API for export
- File input for import upload
- Database operations use `better-sqlite3` transactions
- Delete existing data before inserting backup (prevent duplicates)
- Maintain foreign key relationships during import

## Testing Checklist
- [ ] Export downloads valid JSON
- [ ] Import validates version number
- [ ] Import rejects invalid JSON
- [ ] Import confirmation dialog works
- [ ] Data correctly restored after import
- [ ] Atomicity: failed import doesn't corrupt database
- [ ] Child images preserved (base64 encoded)
- [ ] Translations work (English/Hebrew)

## Error Handling
- Invalid JSON: Show error message
- Incompatible version: Reject with message
- Database error during import: Rollback transaction
- Network error during export: Browser handles retry

## Future Enhancements
- Selective import (choose what to restore)
- Scheduled automatic backups
- Cloud storage integration
- Backup encryption
- Import merge (add to existing vs replace)