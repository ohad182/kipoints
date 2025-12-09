# State Management - Parent Dashboard

## Before (15 states)
```jsx
const [children, setChildren] = useState([]);
const [tasks, setTasks] = useState([]);
const [rewards, setRewards] = useState([]);
const [pendingTransactions, setPendingTransactions] = useState([]);
const [allTransactions, setAllTransactions] = useState([]);
const [allAssignments, setAllAssignments] = useState([]);
const [assignmentFilter, setAssignmentFilter] = useState('all');
const [selectedTasks, setSelectedTasks] = useState([]);
const [preselectedAssignmentId, setPreselectedAssignmentId] = useState(null);
const [showAddChild, setShowAddChild] = useState(false);
const [showAddTask, setShowAddTask] = useState(false);
const [showAddReward, setShowAddReward] = useState(false);
const [showAssignTask, setShowAssignTask] = useState(false);
const [showPenalty, setShowPenalty] = useState(false);
const [showBonus, setShowBonus] = useState(false);
```

## After (7 states) - 53% Reduction
```jsx
const [children, setChildren] = useState([]);
const [tasks, setTasks] = useState([]);
const [rewards, setRewards] = useState([]);
const [pendingTransactions, setPendingTransactions] = useState([]);
const [allTransactions, setAllTransactions] = useState([]);
const [allAssignments, setAllAssignments] = useState([]);
const [modal, setModal] = useState({ type: null, data: null });
```

## Unified Modal State

**Removed:** 
- 6 separate modal boolean states
- assignmentFilter, selectedTasks, preselectedAssignmentId

**Replaced with:**
```jsx
modal: {
  type: 'child' | 'task' | 'reward' | 'penalty' | 'bonus' | null,
  data: {} // Optional data for edit mode
}
```

**Usage:**
```jsx
// Open modal
setModal({ type: 'task', data: null }); // Add mode
setModal({ type: 'task', data: existingTask }); // Edit mode

// Close modal
setModal({ type: null, data: null });

// Conditional rendering
{modal.type === 'task' && <AddTaskModal ... />}
```

## Benefits
- Simpler state management
- Prevents multiple modals open simultaneously
- Easier to track modal state
- Less re-renders
- More maintainable code
