# Setup Tab

## Purpose
All configuration in one place (Children + Tasks + Rewards)

## Sections

### 1. Children Section
- Grid of child cards
- Add/Edit/Delete actions
- Child avatar, name, points display

### 2. Task Library
- List of all tasks
- **Key Feature**: Inline assignment display
  - Shows which children task is assigned to
  - Points per child
  - Expandable/collapseable
- Add/Edit/Delete actions

### 3. Rewards Section
- Grid of reward cards
- Cost and icon display
- Add/Edit/Delete actions

## Inline Task Assignment

When creating/editing a task, show all children with checkboxes:
```jsx
{children.map(child => (
  <div>
    <input type="checkbox" onChange={toggleAssignment} />
    {child.name}
    <input type="number" placeholder="Points" disabled={!assigned} />
  </div>
))}
```

**Benefit**: Eliminates 3-step workflow (Create Task ➔ Navigate to Assignments ➔ Assign to Children)

## Components
- `SetupTab.jsx` - Main container
- `AddTaskModal.jsx` - Enhanced with inline assignments
- `AddChildModal.jsx` - Existing component
- `AddRewardModal.jsx` - Existing component

## State Management
- Task creation includes assignment data
- Batch API call creates task + assignments atomically
- Edit mode pre-populates existing assignments

## Translations
Added `parent.setup.*` keys to en.json/he.json