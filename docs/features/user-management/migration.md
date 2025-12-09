# Migration - User Management

## Migration Strategy

### Phase 1: Database Migration
```sql
-- Create new tables
CREATE TABLE families (...);
CREATE TABLE users (...);
CREATE TABLE family_invitations (...);
CREATE TABLE sessions (...);

-- Create default family for existing data
INSERT INTO families (name) VALUES ('Default Family');

-- Update existing children (and other tables)
UPDATE children SET family_id = 1;
UPDATE task_catalog SET family_id = 1;
UPDATE rewards SET family_id = 1;
UPDATE task_assignments SET family_id = 1;
UPDATE transaction_log SET family_id = 1;

-- Add indexes (see database-schema.md)
```

### Phase 2: Prompt Existing Users
On first launch after update:
1. Detect no users exist in 'users' table
2. Show setup wizard
3. Create parent account
4. Link to existing 'Default Family'
5. Data preserved, now protected

## Testing Checklist

### Security Tests
- [ ] Passwords hashed with bcrypt
- [ ] OAuth tokens never stored client-side
- [ ] Session tokens secure (HTTP-only, Secure, SameSite)
- [ ] CSRF protection works (OAuth state parameter)
- [ ] SQL injection prevented
- [ ] XSS attacks prevented

### Functional Tests - Traditional Login
- [ ] First-time setup creates family and user
- [ ] Parent can login with email/password
- [ ] Email validation works
- [ ] Session expiration works
- [ ] Remember me extends session
- [ ] Password change works

### Functional Tests - OAuth
- [ ] Google OAuth flow works end-to-end
- [ ] Microsoft OAuth flow works end-to-end
- [ ] OAuth user profile retrieved correctly
- [ ] New OAuth user creates account automatically
- [ ] Existing OAuth user logs in correctly
- [ ] OAuth email matches account linking
- [ ] OAuth state parameter prevents CSRF
- [ ] OAuth error handling works (user cancels, provider error)

### Functional Tests - Family Management
- [ ] Parent can send invitation
- [ ] Invitation link generated correctly
- [ ] Invitee can view invitation details
- [ ] Invitee can accept invitation and create account
- [ ] Invitee can accept invitation via OAuth
- [ ] Invitation expires after 7 days
- [ ] Expired invitation cannot be accepted
- [ ] Multiple parents can exist for same family
- [ ] All parents see same family data
- [ ] Can resend pending invitation
- [ ] Can cancel pending invitation

### Data Isolation Tests
- [ ] Family A cannot see Family B's data
- [ ] Children only see own family's data
- [ ] Parents only manage own family
- [ ] API enforces family_id filtering

## Rollback Plan

If issues arise during deployment:
1. Database backup before migration
2. Keep old routes active during transition
3. Feature flag for new auth system
4. Rollback script to restore old state

## Success Criteria

✅ Traditional and OAuth login work
✅ Invitation system functional
✅ Multi-family isolation enforced
✅ No data loss during migration
✅ Login < 200ms, session check < 50ms