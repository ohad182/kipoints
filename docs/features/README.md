# Features Documentation

## Organization

This directory contains feature specifications and design documents organized by feature area.

### Active Features (Implemented)

- **[`parent-dashboard/`](./parent-dashboard/)** - Parent dashboard redesign (7→5 tabs, inline assignments)
- **[`backup/`](./backup/)** - Import/Export system for data backup and restore

### Planned Features (Design Phase)

- **[`user-management/`](./user-management/)** - Authentication system with OAuth support
- **[`daily-summary/`](./daily-summary/)** - Daily progress tracking with category breakdowns

### Quick Links

- **[TODO.md](./TODO.md)** - Project roadmap and priority list
- **[../SETUP.md](../SETUP.md)** - Development setup guide
- **[../DEPLOYMENT.md](../DEPLOYMENT.md)** - Production deployment guide

## Documentation Structure

Each feature has its own directory with:
- `README.md` - Overview and quick reference
- Sub-documents covering specific aspects (architecture, API, UI, etc.)

## Recent Updates

- **Dec 9, 2025**: Reorganized docs into feature subdirectories
- **Dec 7-8, 2025**: Navigation redesign, gender theming, real-time updates
- **Dec 4, 2025**: Parent dashboard redesign completed
- **Dec 3, 2025**: Import/Export feature completed

## Navigation

```
features/
├── README.md (this file)
├── TODO.md (roadmap)
│
├── parent-dashboard/
│   ├── README.md
│   ├── dashboard-tab.md
│   ├── setup-tab.md
│   ├── components.md
│   └── state-management.md
│
├── backup/
│   ├── README.md
│   ├── specification.md
│   └── implementation.md
│
├── user-management/
│   ├── README.md
│   ├── database-schema.md
│   ├── authentication.md
│   ├── oauth.md
│   ├── invitations.md
│   ├── security.md
│   ├── settings-ui.md
│   └── migration.md
│
└── daily-summary/
    ├── README.md
    └── specification.md
```
