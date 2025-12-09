# Daily Summary Feature

**Status:** Design Phase

## Summary
Daily progress tracking showing points earned by children with category breakdowns and task details.

## Sub-Documents
- [`specification.md`](./specification.md) - Full feature specification
- `ui-components.md` - UI components (to be created during implementation)
- `api-endpoints.md` - Backend API (to be created during implementation)

## Overview
- **Bottom Bar**: Fixed bar showing daily total with progress bar (clickable)
- **Modal**: Detailed breakdown by category with collapseable task lists
- **Real-time**: Updates via WebSocket when tasks completed

## Quick Reference
**Location:** Child Dashboard (bottom bar)
**Display**: `📊 Today: {current}/{total} ⭐ 👆 Details`
**Categories**: Morning, Afternoon, Evening, Other
**Details:** Collapseable (closed by default for UX)
