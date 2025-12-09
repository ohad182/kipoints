# Security - User Management

## Password Security

- **Hashing**: bcrypt with work factor 12
- **Storage**: Never store plaintext passwords
- **Transmission**: HTTPS only in production
- **Validation**: Minimum 8 characters (configurable)
- **NULL for OAuth**: OAuth-only users have NULL password_hash

## OAuth Security

- **PKCE Flow**: Proof Key for Code Exchange for authorization
- **State Parameter**: CSRF protection via random state parameter
- **Token Storage**: Access tokens never stored client-side (server-side session only)
- **Scope Limitation**: Request minimal scopes (email, profile only)
- **Provider Verification**: Validate OAuth responses match initiated requests
- **Credential Isolation**: OAuth users can optionally set password for mixed auth

## Session Management

- **HTTP-only cookies**: Prevent XSS attacks
- **Secure flag**: HTTPS only in production
- **SameSite=Strict**: Prevent CSRF
- **Expiration**: 7 days for "remember me", 24 hours otherwise
- **Session cleanup**: Expired sessions removed daily

## Data Isolation

- **Family-level isolation**: All queries filtered by `family_id`
- **Auth middleware**: Applied to all protected routes
- **Row-level security**: Database queries always include family_id filter
- **No cross-family access**: Family A cannot see Family B's data

## Invitation Security

- **UUID v4 tokens**: Unique and unpredictable
- **7-day expiration**: Automatic token expiry
- **One-time use**: Token consumed upon acceptance
- **Rate limiting**: Max 10 invitations per family per day
- **Email validation**: Validate email format before sending

## Child Access Security

- **Parent-supervised**: Children access system while parent is logged in
- **No child authentication**: Simplifies UX, parent responsibility model
- **Family session**: Children inherit parent's family context
- **Logout affects all**: Parent logout ends session for everyone

## Best Practices

- Environment variables for secrets (SESSION_SECRET, OAuth credentials)
- HTTPS in production (SSL/TLS)
- Regular security audits
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize inputs, HTTP-only cookies)
- CSRF protection (SameSite cookies, OAuth state parameter)