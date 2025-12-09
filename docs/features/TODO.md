# TODO - Points System

## Recent Updates (December 2025)

- ✅ **Navigation Redesign** (Dec 7): Hamburger menu, side nav, removed back buttons
- ✅ **Gender Theming** (Dec 7): Boy/girl/not-set themes, CSS custom properties → `scripts/add-gender-column.js`
- ✅ **Real-time Updates** (Dec 7): WebSocket listeners for assignments
- ✅ **UI Polish** (Dec 7-8): Task cards, icon centralization, scrollbars
- ✅ **Parent Dashboard Redesign** (Dec 4): 7→5 tabs, inline assignments → See [`parent-dashboard/`](./parent-dashboard/)
- ✅ **Import/Export** (Dec 3): Backup tab implemented → See [`backup/`](./backup/)

---

## Priority Order

### 🔴 Priority 1: Parent Dashboard Redesign ✅ COMPLETE
**Status:** Implemented (Dec 4, 2025)  
**Doc:** [`parent-dashboard/`](./parent-dashboard/)  
**Results:** 5 tabs, 67% fewer clicks, inline task assignments

---

### 🟠 Priority 2: User Management
**Status:** Design phase  
**Doc:** [`user-management/`](./user-management/)  
**Effort:** 8-11 sessions

**Summary:**
- Multi-family authentication
- Email/password + OAuth (Google, Microsoft)
- Family invitation system
- Parent-only login (children supervised)
- Session-based auth

**Tasks:**
- [ ] Database schema (families, users, sessions, invitations)
- [ ] Core authentication (login/logout, sessions)
- [ ] OAuth integration (Google, Microsoft)
- [ ] Invitation system (send, accept, expire)
- [ ] Settings UI (family management, password change)
- [ ] Migration & testing

---

### 🟡 Priority 3: Production Deployment
**Status:** Not started  
**Doc:** `DEPLOYMENT.md`  
**Effort:** 1-2 sessions

**Summary:**
- Nginx reverse proxy configuration
- SSL with Let's Encrypt
- Systemd service for backend
- Database backup automation

**Tasks:**
- [ ] Nginx config (static files + API proxy + WebSocket)
- [ ] SSL setup
- [ ] Backend systemd service
- [ ] Deployment documentation
- [ ] Backup cron job

---

### 🟢 Priority 4: Mobile Apps
**Status:** Planning  
**Effort:** 1 session (PWA) to 20+ sessions (native)

**Recommendation:** Start with PWA, evaluate if native needed

**Tasks:**
- [ ] PWA setup (manifest.json, service worker)
- [ ] Test offline capabilities
- [ ] Decide on native approach if needed

---

## Backlog (Lower Priority)

### Features
- [ ] **Daily Summary** (see [`daily-summary/`](./daily-summary/)) - Bottom bar with progress, modal with category breakdown (3-4 hours)
- [ ] Task scheduling (specific days/times)
- [ ] Recurring rewards
- [ ] Achievements/Badges
- [ ] Charts and analytics
- [ ] Browser notifications
- [ ] Task difficulty levels
- [ ] Streak bonuses
- [ ] Dark mode
- [ ] Sound effects
- [ ] Custom themes

### Technical Debt
- [ ] Database migration system (beyond manual scripts)
- [ ] Error handling improvements
- [ ] Logging system
- [ ] Unit and integration tests
- [ ] API documentation
- [ ] User manual

---

## Notes

- Complete each priority before moving to next
- All major features have design docs in `docs/features/`
- Test thoroughly before marking complete
- Keep docs under 200 lines (focused, straightforward)
