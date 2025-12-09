# Daily Summary Feature

## Overview
A daily progress tracking system that displays points earned by children throughout the day, with category breakdowns and task details.

## User Interface

### Bottom Bar (Child Dashboard)
- **Location**: Fixed bottom bar in child dashboard view
- **Display**:
  - Left side: `📊 Today: {current}/{total} ⭐`
  - Center: Horizontal progress bar showing daily progress
  - Right side: `👆 Details` or tap-to-open indicator
- **Progress Bar**:
  - Fills from left to right as points are earned
  - Uses child's gender theme accent color
  - Shows visual progress toward daily goal/target
- **Behavior**: Entire bar is clickable to open detailed modal
- **Styling**:
  - Backdrop filter blur for modern look
  - Semi-transparent background
  - Non-intrusive, complements existing UI
  - Smooth animation when progress updates

### Daily Summary Modal
Opens when bottom bar is clicked, showing:

#### Header
- Child's name and avatar
- Total points earned today
- Current date

#### Category Breakdown
For each category (Morning, Afternoon, Evening, Other):
- **Category name** with emoji icon
- **Progress bar** showing points earned in that category
- **Collapseable task list** (collapsed by default)
  - Task name and icon
  - Points earned
  - Completion timestamp
  - Task status badge

#### Summary Footer
- Total tasks completed today
- Total points earned
- Close button

## Technical Implementation

### Data Structure
```javascript
{
  date: '2025-12-09',
  childId: 1,
  totalPoints: 45,
  categories: [
    {
      name: "Morning",
      icon: '🌄',
      points:15,
      tasks: [
        {
          id: 1,
          name: 'Make Bed',
          icon: '🛌',
          points: 5,
          completedAt: '2025-12-09T07:30:00Z'
        }
      ]
    }
  ]
}
```

### Components
1. **DailySummaryBar.jsx** - Bottom bar component
2. **DailySummaryModal.jsx** - Modal with full breakdown
3. **CategorySection.jsx** - Collapseable category with progress bar and task list

### Data Source
- Query existing `/api/transactions` endpoint
- Filter by:
  - `child_id`: Current child
  - `action_type`: 'task'
  - `created_at`: Today's date (00:00:00 - 23:59:59)
- Join with `task_assignments` and `tasks` for category/icon info
- Group by category for aggregation

### State Management
- Use React hooks for modal open/close state
- Use React hooks for collapseable section state (default: collapsed)
- Real-time updates via WebSocket `transactionAdded` event

## User Experience

### Design Principles
- **Non-intrusive**: Bottom bar doesn't block main content
- **Scannable**: Collapsed by default for quick overview
- **Detailed on demand**: Expand categories to see task-level details
- **Real-time**: Updates immediately when tasks completed
- **Motivating**: Visual progress bars encourage completion
