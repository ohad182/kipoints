const API_URL = 'http://localhost:3000/api';

export const api = {
    // Children API
    getChildren: () => fetch(`${API_URL}/children`).then(res => res.json()),
    addChild: (data) => fetch(`${API_URL}/children`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateChild: (id, data) => fetch(`${API_URL}/children/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteChild: (id) => fetch(`${API_URL}/children/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Task Catalog API
    getTasks: () => fetch(`${API_URL}/tasks`).then(res => res.json()),
    addTask: (data) => fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateTask: (id, data) => fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteTask: (id) => fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Assignments API
    getAssignments: (childId) => fetch(`${API_URL}/assignments/${childId}`).then(res => res.json()),
    addAssignment: (data) => fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateAssignment: (id, data) => fetch(`${API_URL}/assignments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteAssignment: (id) => fetch(`${API_URL}/assignments/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Rewards API
    getRewards: () => fetch(`${API_URL}/rewards`).then(res => res.json()),
    addReward: (data) => fetch(`${API_URL}/rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    updateReward: (id, data) => fetch(`${API_URL}/rewards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteReward: (id) => fetch(`${API_URL}/rewards/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),

    // Transactions API
    getTransactions: () => fetch(`${API_URL}/transactions`).then(res => res.json()),
    getPendingTransactions: () => fetch(`${API_URL}/transactions/pending`).then(res => res.json()),
    addTransaction: (data) => fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    reviewTransaction: (id, approved) => fetch(`${API_URL}/transactions/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
    }).then(res => res.json()),
};
