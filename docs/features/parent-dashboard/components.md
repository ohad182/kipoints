# Components - Parent Dashboard

## New Components

### DashboardTab.jsx
- Purpose: Overview tab
- Props: None (uses context)
- Features: Stats, children overview, quick actions, activity feed

### SetupTab.jsx
- Purpose: Unified configuration
- Props: None (uses context)
- Features: Children, tasks, rewards sections

### StatsCard.jsx
- Purpose: Display single stat
- Props: `{ icon, label, value }`
- Styling: Card with gradient background

### ChildCard.jsx
- Purpose: Child overview in dashboard
- Props: `{ child, taskCount, onClick }`
- Features: Clickable, shows points and task count

### QuickActions.jsx
- Purpose: Action button group
- Props: `{ onAssignTask, onBonus, onPenalty }`
- Styling: Flex row with colored buttons

### RecentActivity.jsx
- Purpose: Transaction feed
- Props: `{ transactions }`
- Features: Shows last 5 transactions with icons and points

## Modified Components

### AddTaskModal.jsx
**Enhanced with inline assignments:**
- Added `assignments` state: `{ childId: { enabled: bool, points: number } }`
- Shows checkbox + points input for each child
- Batch creates task + assignments on save

### ParentDashboard.jsx
**Tab structure change:**
- Updated from 7 tabs to 5 tabs
- Tab state: `['dashboard', 'setup', 'review', 'history', 'backup']`
- Added DashboardTab and SetupTab components
- Removed separate Children, Tasks, Assignments, Rewards tabs

## Styling Files

- `DashboardTab.css` - Stats cards, child cards, quick actions
- `SetupTab.css` - Unified layout for all sections
- `ParentDashboard.css` - Updated tab styles
