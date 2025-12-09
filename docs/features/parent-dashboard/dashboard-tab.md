# Dashboard Tab

## Purpose
Quick overview + common actions

## Features
- **Quick Stats Cards**: Children count, tasks count, pending transactions, rewards count
- **Children Overview**: Cards showing each child's avatar, points, task count (clickable to child dashboard)
- **Quick Actions**: Assign Task, Give Bonus, Apply Penalty buttons
- **Recent Activity**: Last 5 transactions feed

## Components
- `DashboardTab.jsx` - Main container
- `StatsCard.jsx` - Individual stat display
- `ChildCard.jsx` - Child overview card (clickable)
- `QuickActions.jsx` - Action button group
- `RecentActivity.jsx` - Transaction feed

## Layout
```
----------------------------------
| 📊 Quick Stats                 |
|  [👥 3] [✔ 12] [⌛ 5] [🎁 8]  |
|                                |
| 👥 Children Overview          |
|[🧒Alex 150⭐] [👧 Emma 220⭐]|
| ⚡ [Assign] [Bonus] [Penalty]  |
|                                |
| 📈 Recent Activity             |
|  *Alex completed "Homework" +20|
----------------------------------
```

## Translations
Added `parent.dashboard.*` keys to en.json/he.json
