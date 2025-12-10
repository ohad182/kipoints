const getApiUrl = () => {
    const savedUrl = localStorage.getItem('backendUrl') || 'http://localhost:3000';
    return `${savedUrl}/api`;
};

export const api = {
    // Children API
    getChildren: () => fetch(`${getApiUrl()}/children`).then(res => res.json()),
    addChild: (data) => fetch(`${getApiUrl()}/children`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateChild: (id, data) => fetch(`${getApiUrl()}/children/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteChild: (id) => fetch(`${getApiUrl()}/children/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Task Catalog API
    getTasks: () => fetch(`${getApiUrl()}/tasks`).then(res => res.json()),
    addTask: (data) => fetch(`${getApiUrl()}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateTask: (id, data) => fetch(`${getApiUrl()}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteTask: (id) => fetch(`${getApiUrl()}/tasks/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Assignments API
    getAssignments: (childId) => fetch(`${getApiUrl()}/assignments/${childId}`).then(res => res.json()),
    getCompletedToday: (childId) => fetch(`${getApiUrl()}/assignments/${childId}/completed-today`).then(res => res.json()),
    getPendingTasks: (childId) => fetch(`${getApiUrl()}/children/${childId}/pending-tasks`).then(res => res.json()),
    getDailySummary: (childId) => fetch(`${getApiUrl()}/children/${childId}/daily-summary`).then(res => res.json()),
    addAssignment: (data) => fetch(`${getApiUrl()}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateAssignment: (id, data) => fetch(`${getApiUrl()}/assignments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteAssignment: (id) => fetch(`${getApiUrl()}/assignments/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Rewards API
    getRewards: () => fetch(`${getApiUrl()}/rewards`).then(res => res.json()),
    addReward: (data) => fetch(`${getApiUrl()}/rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateReward: (id, data) => fetch(`${getApiUrl()}/rewards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteReward: (id) => fetch(`${getApiUrl()}/rewards/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Transactions API
    getTransactions: () => fetch(`${getApiUrl()}/transactions`).then(res => res.json()),
    getPendingTransactions: () => fetch(`${getApiUrl()}/transactions/pending`).then(res => res.json()),
    addTransaction: (data) => fetch(`${getApiUrl()}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    reviewTransaction: (id, approved) => fetch(`${getApiUrl()}/transactions/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
    }).then(res => res.json()),
    undoTransaction: (id) => fetch(`${getApiUrl()}/transactions/${id}/undo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),
    deleteTransaction: (id) => fetch(`${getApiUrl()}/transactions/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Backup/Restore API
    exportData: () => fetch(`${getApiUrl()}/export`).then(res => res.blob()),
    importData: (data) => fetch(`${getApiUrl()}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
    }).then(res => res.json()),
};
