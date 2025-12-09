# OAuth Integration - User Management

## Providers
- Google Sign-In
- Microsoft Account

## OAuth Flow

1. Click "Sign in with Google/Microsoft"
2. Redirect to OAuth provider
3. User authenticates with provider
4. Provider redirects back with authorization code
5. Backend exchanges code for access token
6. Retrieve user profile (email, name, picture)
7. Check if user exists:
   - If exists: Create session
   - If new: Create account + family (or link to invitation)
8. Redirect to parent dashboard

## API Endpoints

- `GET /api/auth/oauth/:provider` - Initiate OAuth flow
  - provider: 'google' or 'microsoft'
  - Redirects to OAuth provider

- `GET /api/auth/oauth/callback/:provider` - OAuth callback
  - Receives authorization code
  - Exchanges for token
  - Creates/logs in user
  - Redirects to dashboard

## Environment Variables

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/callback/google

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-application-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/auth/oauth/callback/microsoft
```

## OAuth Setup

**Google:**
- Configure at: https://console.cloud.google.com/apis/credentials
- Create OAuth 2.0 Client ID
- Add redirect URI

**Microsoft:**
- Configure at: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps
- Register application
- Add redirect URI

## Security

- **PKCE Flow**: Proof Key for Code Exchange
- **State Parameter**: CSRF protection (random state parameter)
- **Minimal Scopes**: email, profile only
- **Server-side Exchange**: Tokens never exposed to client
- **Provider Verification**: Validate responses match initiated requests

## Account Linking

- OAuth email must match existing account OR create new
- Users can link multiple auth methods (email+password AND OAuth)
- OAuth-only users: `password_hash` is NULL

## Dependencies

```json
{
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-microsoft": "^1.0.0"
}
```