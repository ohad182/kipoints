# Database Schema - User Management

## New Tables

### families
```sql
CREATE TABLE families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,                    -- NULL for OAuth-only users
    name TEXT,
    auth_provider TEXT DEFAULT 'local',   -- 'local', 'google', 'microsoft'
    oauth_id TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id),
    UNIQUE(auth_provider, oauth_id)
);
```

### family_invitations
```sql
CREATE TABLE family_invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    invited_by INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    expires_at DATETIME NOT NULL,            -- 7 days
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id)
);
```

### sessions
```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Modified Tables

Add `family_id` to existing tables:
```sql
ALTER TABLE children ADD COLUMN family_id INTEGER REFERENCES families(id);
ALTER TABLE task_catalog ADD COLUMN family_id INTEGER REFERENCES families(id);
ALTER TABLE rewards ADD COLUMN family_id INTEGER REFERENCES families(id);
ALTER TABLE task_assignments ADD COLUMN family_id INTEGER REFERENCES families(id);
ALTER TABLE transaction_log ADD COLUMN family_id INTEGER REFERENCES families(id);
```

## Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_family_id ON users(family_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_invitations_token ON family_invitations(token);
CREATE INDEX idx_invitations_email ON family_invitations(email);
```