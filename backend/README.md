# KiPoints Backend

Backend server for the KiPoints application - a points management system for children's tasks and rewards.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

## Database Migration

**Important**: If you're upgrading from an older version, you need to run the migration script to add the gender column:

```bash
node scripts/add-gender-column.js
```

This migration:
- Adds a `gender` column to the `children` table
- Sets default value to 'not-set' for all existing children
- Safe to run multiple times (checks if column already exists)

## Starting the Server

To start the backend server on port 3000:

```bash
npm start
```

The server will be available at `http://localhost:3000`

## Environment

- **Port**: 3000
- **Database**: SQLite (points.db)
- **CORS Origin**: localhost:5173

## API Endpoints

### Children
- `GET /api/children` - Get all children
- `POST /api/children` - Create a new child
- `PATCH /api/children/:id` - Update a child
- `DELETE /api/children/:id` - Delete a child

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Task Assignments
- `GET /api/assignments/:childId` - Get assignments for a child
- `POST /api/assignments` - Assign a task to a child
- `PATCH /api/assignments/:id` - Update assignment points
- `DELETE /api/assignments/:id` - Delete an assignment

### Rewards
- `GET /api/rewards` - Get all rewards
- `POST /api/rewards` - Create a new reward
- `PATCH /api/rewards/:id` - Update a reward
- `DELETE /api/rewards/:id` - Delete a reward

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/pending` - Get pending transactions
- `POST /api/transactions` - Create a new transaction
- `PATCH /api/transactions/:id/review` - Review and approve/reject a transaction

## Real-time Updates

The server uses Socket.IO for real-time updates. Events are emitted for:
- `childAdded`, `childUpdated`, `childDeleted`
- `taskAdded`, `taskUpdated`, `taskDeleted`
- `assignmentAdded`, `assignmentUpdated`, `assignmentDeleted`
- `rewardAdded`, `rewardUpdated`, `rewardDeleted`
- `transactionAdded`, `transactionReviewed`
