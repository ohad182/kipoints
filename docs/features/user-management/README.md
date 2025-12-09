# User Management System - Overview

**Status:** Design Phase | **Priority:** 2

## Summary
Self-hosted authentication for multi-family support with OAuth integration (Google, Microsoft).

## Goals
- Secure family data isolation
- Traditional email/password + OAuth login
- Multi-parent per family (shared dashboard)
- Child access via parent supervision (no child auth)
- Family invitation system

## User Roles

**Parents**
- Email + password OR OAuth (Google/Microsoft)
- Full CRUD access to family data
- Multiple parents per family allowed
- Session-based authentication

**Children**
- Picture selection only (no authentication)
- Access when parent logged in
- Parent supervision model

## Implementation Phases

1. **Core Auth** - See `authentication.md`
2. **OAuth** - See `oauth.md`
3. **Invitations** - See `invitations.md`
4. **Settings UI** - See `settings-ui.md`
5. **Migration** - See `migration.md`

## Sub-Documents
- [`database-schema.md`](./database-schema.md) - Database tables and modifications
- [`authentication.md`](./authentication.md) - Core auth flows and API endpoints
- [`oauth.md`](./oauth.md) - OAuth integration details
- [`invitations.md`](./invitations.md) - Family invitation system
- [`security.md`](./security.md) - Security considerations
- [`settings-ui.md`](./settings-ui.md) - UI components and screens
- [`migration.md`](./migration.md) - Migration strategy and testing

## Quick Reference

**Environment Variables:** See `oauth.md`
**API Endpoints:** See `authentication.md`
**Testing Checklist:** See `migration.md`
**Dependencies:** bcrypt, express-session, uuid, passport, passport-google-oauth20, passport-microsoft