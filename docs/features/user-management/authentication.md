# Authentication - User Management

## Key Flows

### First-Time Setup
1. No families exist → Setup wizard
2. Create family + first parent account
3. Redirect to parent dashboard

### Parent Login (Email/Password)
1. Login screen
2. Enter email + password
3. Validate credentials (bcrypt compare)
4. Create session (cookie)
5. Redirect to parent dashboard

### Child Access
1. Parent logs in → parent session active
2. Child selects picture → access dashboard
3. Parent logout → ends session for all

### Logout
1. Click logout
2. Destroy session
3. Redirect to login screen

## API Endpoints

### Authentication
- `POST /api/setup` - First-time setup
  - Body: `{ familyName, email, password, name }`
  - Returns: `{ success, user, token }`

- `POST /api/auth/login` - Email/password login
  - Body: `{ email, password, rememberMe }`
  - Returns: `{ success, user, token }`

- `POST /api/auth/logout` - Destroy session
  - Returns: `{ success }`

- `GET /api/auth/me` - Check auth status
  - Returns: `{ user, family }` or 401

- `POST /api/auth/change-password` - Change password
  - Body: `{ currentPassword, newPassword }`
  - Returns: `{ success }`

### User Management
- `GET /api/family` - Get family info + parents
  - Returns: `{ id, name, parents: [...] }`

- `PATCH /api/family` - Update family name
  - Body: `{ name }`
  - Returns: `{ success, family }`

- `DELETE /api/family/parents/:userId` - Remove parent
  - Returns: `{ success }`

## Session Management

**Configuration:**
- HTTP-only cookies
- Secure flag (HTTPS in production)
- SameSite=Strict
- Expiration: 24h default, 7d with "remember me"

**Storage:**
- Sessions stored in `sessions` table
- Session ID stored in cookie
- Cleanup: Expired sessions removed daily (cron job)

## Password Security

- bcrypt hashing (rounds: 12)
- Minimum 8 characters (configurable)
- HTTPS only in production
- No plaintext storage