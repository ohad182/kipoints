# Family Invitations - User Management

## Overview
Parents can invite other parents to join their family by email.

## Invitation Flow

### Sending Invitation
1. Parent logged in → Family Settings
2. Click "Invite Family Member"
3. Enter invitee email address
4. System generates unique invitation link (UUID v4 token)
5. Link copied to clipboard / displayed
6. Parent shares link via email/message

### Accepting Invitation
1. Invitee receives invitation link
2. Clicks link → Invitation acceptance page
3. If not registered:
   - Enter name (display name)
   - Choose: Set password OR Sign in with OAuth
   - Accept invitation
4. Account created and linked to family
5. Redirect to login or auto-login

### Expiration
- Invitations expire after 7 days
- Expired invitations cannot be accepted
- Status: 'pending', 'accepted', 'expired'

## API Endpoints

### Send Invitation
- `POST /api/family/invitations`
  - Body: `{ email }`
  - Returns: `{ success, invitation, inviteLink }`

### List Pending Invitations
- `GET /api/family/invitations`
  - Returns: `{ invitations: [{ id, email, status, expires_at, ...}] }`

### Get Invitation Details (Public)
- `GET /api/invitations/:token`
  - Returns: `{ family_name, invited_by_name, email, expired }`

### Accept Invitation
- `POST /api/invitations/:token/accept`
  - Body: `{ name, password }` OR `{ name, oauth_provider }`
  - Returns: `{ success, user, token }`

### Resend Invitation
- `POST /api/family/invitations/:id/resend`
  - Returns: `{ success, inviteLink }`

### Cancel Invitation
- `DELETE /api/family/invitations/:id`
  - Returns: `{ success }`

## Security

- **UUID v4 Tokens**: Unique, unpredictable
- **7-Day Expiration**: Automatic expiry
- **One-Time Use**: Token consumed upon acceptance
- **Rate Limiting**: Max 10 invitations per family per day
- **Email Validation**: Basic email format validation
- **Unique Email**: Email cannot be used by multiple families

## Database

See `database-schema.md` for `family_invitations` table structure.

## UI Components

See `settings-ui.md` for invitation UI in Family Settings.