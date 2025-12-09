# Backup System (Import/Export)

**Status:** ✅ Complete (Dec 3, 2025)

## Summary
Backup tab in Parent Dashboard allowing full data export and import for disaster recovery and data portability.

## Sub-Documents
- [`specification.md`](./specification.md) - Feature specification and data format
- [`implementation.md`](./implementation.md) - Implementation details (API, UI, components)

## Features
✅ Export all data to JSON file
✅ Import from backup file
✅ Version validation
✅ Atomic transactions (all-or-nothing)
✅ Confirmation dialogs
✅ English/Hebrew support
✅ Real-time sync via WebSocket

## Quick Reference
**UI Location:** Parent Dashboard ➔ Backup Tab
**Export Endpoint:** `GET /api/export`
**Import Endpoint:** `POST /api/import`
**File Format:** JSON with version number
