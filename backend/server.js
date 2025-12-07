import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from './database.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== CHILDREN ROUTES =====
app.get('/api/children', (req, res) => {
    const children = db.prepare('SELECT * FROM children').all();
    res.json(children);
});

app.post('/api/children', (req, res) => {
    const { name, image, gender = 'not-set' } = req.body;
    const result = db.prepare('INSERT INTO children (name, image, gender) VALUES (?, ?, ?)').run(name, image, gender);
    const child = db.prepare('SELECT * FROM children WHERE id = ?').get(result.lastInsertRowid);
    io.emit('childAdded', child);
    res.status(201).json(child);
});

app.patch('/api/children/:id', (req, res) => {
    const { name, image, gender } = req.body;
    const updates = [];
    const values = [];

    if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
    }

    if (image !== undefined) {
        updates.push('image = ?');
        values.push(image);
    }

    if (gender !== undefined) {
        updates.push('gender = ?');
        values.push(gender);
    }

    if (updates.length > 0) {
        values.push(req.params.id);
        db.prepare(`UPDATE children SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const child = db.prepare('SELECT * FROM children WHERE id = ?').get(req.params.id);
    io.emit('childUpdated', child);
    res.json(child);
});

app.delete('/api/children/:id', (req, res) => {
    db.prepare('DELETE FROM children WHERE id = ?').run(req.params.id);
    io.emit('childDeleted', parseInt(req.params.id));
    res.json({ success: true, message: 'Child deleted successfully' });
});

// ===== TASK CATALOG ROUTES =====
app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM task_catalog').all();
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { name, category, icon, completion_type = 'once' } = req.body;
    const result = db.prepare('INSERT INTO task_catalog (name, category, icon, completion_type) VALUES (?, ?, ?, ?)').run(name, category, icon, completion_type);
    const task = db.prepare('SELECT * FROM task_catalog WHERE id = ?').get(result.lastInsertRowid);
    io.emit('taskAdded', task);
    res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
    const { name, category, icon, completion_type } = req.body;
    db.prepare('UPDATE task_catalog SET name = ?, category = ?, icon = ?, completion_type = ? WHERE id = ?').run(name, category, icon, completion_type, req.params.id);
    const task = db.prepare('SELECT * FROM task_catalog WHERE id = ?').get(req.params.id);
    io.emit('taskUpdated', task);
    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    db.prepare('DELETE FROM task_catalog WHERE id = ?').run(req.params.id);
    io.emit('taskDeleted', parseInt(req.params.id));
    res.json({ success: true, message: 'Task deleted successfully' });
});

// ===== TASK ASSIGNMENTS ROUTES =====
app.get('/api/assignments/:childId', (req, res) => {
    const assignments = db.prepare(`
        SELECT ta.*, tc.name, tc.category, tc.icon, tc.completion_type
        FROM task_assignments ta
        JOIN task_catalog tc ON ta.task_id = tc.id
        WHERE ta.child_id = ?
        `).all(req.params.childId);
    res.json(assignments);
});

// Get completed tasks for today
app.get('/api/assignments/:childId/completed-today', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get all cancelled transaction IDs from reversal entries
    const cancelledIds = db.prepare(`
    SELECT CAST(SUBSTR(description, INSTR(description, 'ID ') + 3,
    INSTR(SUBSTR(description, INSTR(description, 'ID ') + 3), ' ') - 1) AS INTEGER) as cancelled_id
    FROM transaction_log
    WHERE child_id= ?
    AND action_type = 'penalty'
    AND DATE(timestamp) = ?
    AND description LIKE 'Cancellation of transaction ID %'
    `).all(req.params.childId, today).map(row => row.cancelled_id);

    // Get completed tasks, excluding cancelled ones
    const completedToday = db.prepare(`
        SELECT task_assignment_id, COUNT(*) as count
        FROM transaction_log
        WHERE child_id = ?
        AND action_type = 'task'
        AND DATE(timestamp) = ?
        AND task_assignment_id IS NOT NULL
        AND amount > 0
        ${cancelledIds.length > 0 ? `AND id NOT IN (${cancelledIds.join(',')})` : ''}
        GROUP BY task_assignment_id
        `).all(req.params.childId, today);

    const completedMap = {};
    completedToday.forEach(row => {
        completedMap[row.task_assignment_id] = row.count;
    });

    res.json(completedMap);
});

app.post('/api/assignments', (req, res) => {
    const { child_id, task_id, points } = req.body;
    try {
        const result = db.prepare('INSERT INTO task_assignments (child_id, task_id, points) VALUES (?, ?, ?)').run(child_id, task_id, points);
        const assignment = db.prepare(`
        SELECT ta.*, tc.name, tc.category, tc.icon, tc.completion_type
        FROM task_assignments ta
        JOIN task_catalog tc ON ta.task_id = tc.id
        WHERE ta.id = ?
            `).get(result.lastInsertRowid);
        io.emit('assignmentAdded', assignment);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ error: 'Assignment already exists for this child and task.' });
    }
});

app.patch('/api/assignments/:id', (req, res) => {
    const { points } = req.body;
    db.prepare('UPDATE task_assignments SET points = ? WHERE id = ?').run(points, req.params.id);
    const assignment = db.prepare(`
        SELECT ta.*, tc.name, tc.category, tc.icon, tc.completion_type
        FROM task_assignments ta
        JOIN task_catalog tc ON ta.task_id = tc.id
        WHERE ta.id = ?
        `).get(req.params.id);
    io.emit('assignmentUpdated', assignment);
    res.json(assignment);
});

app.delete('/api/assignments/:id', (req, res) => {
    db.prepare('DELETE FROM task_assignments WHERE id = ?').run(req.params.id);
    io.emit('assignmentDeleted', parseInt(req.params.id));
    res.json({ success: true, message: 'Assignment deleted successfully' });
});

// ===== REWARDS ROUTES =====
app.get('/api/rewards', (req, res) => {
    const rewards = db.prepare('SELECT * FROM rewards').all();
    res.json(rewards);
});

app.post('/api/rewards', (req, res) => {
    const { name, cost, image } = req.body;
    const result = db.prepare('INSERT INTO rewards (name, cost, image) VALUES (?, ?, ?)').run(name, cost, image);
    const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(result.lastInsertRowid);
    io.emit('rewardAdded', reward);
    res.status(201).json(reward);
});

app.patch('/api/rewards/:id', (req, res) => {
    const { name, cost, image } = req.body;
    db.prepare('UPDATE rewards SET name = ?, cost = ?, image = ? WHERE id = ?').run(name, cost, image, req.params.id);
    const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(req.params.id);
    io.emit('rewardUpdated', reward);
    res.json(reward);
});

app.delete('/api/rewards/:id', (req, res) => {
    db.prepare('DELETE FROM rewards WHERE id = ?').run(req.params.id);
    io.emit('rewardDeleted', parseInt(req.params.id));
    res.json({ success: true, message: 'Reward deleted successfully' });
});

// ===== TRANSACTIONS ROUTES =====
app.get('/api/transactions', (req, res) => {
    const transactions = db.prepare(`
        SELECT t.*, c.name as child_name
        FROM transaction_log t
        JOIN children c ON t.child_id = c.id
        ORDER BY t.timestamp DESC
        `).all();
    res.json(transactions);
});

app.get('/api/transactions/pending', (req, res) => {
    const transactions = db.prepare(`
        SELECT t.*, c.name as child_name
        FROM transaction_log t
        JOIN children c ON t.child_id = c.id
        WHERE t.is_reviewed = 0
        ORDER BY t.timestamp DESC
        `).all();
    res.json(transactions);
});

// Get pending transactions for a specific child (for undo functionality)
app.get('/api/children/:childId/pending-tasks', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const pendingTasks = db.prepare(`
    SELECT id, task_assignment_id
    FROM transaction_log
    WHERE child_id = ?
    AND action_type = 'task'
    AND DATE(timestamp) = ?
    AND task_assignment_id IS NOT NULL
    AND is_reviewed = 0
 `).all(req.params.childId, today);

    const pendingMap = {};
    pendingTasks.forEach(row => {
        pendingMap[row.task_assignment_id] = row.id; // Map assignment ID to transaction
    });

    res.json(pendingMap);
});

app.post('/api/transactions', (req, res) => {
    const { child_id, action_type, amount, description, task_assignment_id } = req.body;

    const transaction = db.transaction(() => {
        // Insert into transaction_log
        const result = db.prepare('INSERT INTO transaction_log (child_id, action_type, amount, description, task_assignment_id) VALUES (?, ?, ?, ?, ?)').run(child_id, action_type, amount, description, task_assignment_id || null);

        // Update child's balance
        db.prepare('UPDATE children SET balance = balance + ? WHERE id = ?').run(amount, child_id);

        // Get updated child
        const child = db.prepare('SELECT * FROM children WHERE id = ?').get(child_id);

        // Get trannsaction with child name
        const newTransaction = db.prepare(`
            SELECT t.*, c.name as child_name
            FROM transaction_log t
            JOIN children c ON t.child_id = c.id
            WHERE t.id = ?
            `).get(result.lastInsertRowid);

        return { transaction: newTransaction, child };
    });

    const data = transaction();
    io.emit('transactionAdded', data);
    res.status(201).json(data.transaction);
});

app.patch('/api/transactions/:id/review', (req, res) => {
    const { approved } = req.body;
    const transactionId = req.params.id;

    const transaction = db.transaction(() => {
        const original = db.prepare('SELECT * FROM transaction_log WHERE id = ?').get(transactionId);

        if (approved) {
            // Mark as reviewed
            db.prepare('UPDATE transaction_log SET is_reviewed = 1 WHERE id = ?').run(transactionId);
        } else {
            // Reverse the transaction
            db.prepare('UPDATE children SET balance = balance - ? WHERE id = ?').run(original.amount, original.child_id);
            db.prepare('UPDATE transaction_log SET is_reviewed = 1 WHERE id = ?').run(transactionId);

            // Create a reversal transaction
            db.prepare('INSERT INTO transaction_log (child_id, action_type, amount, description, is_reviewed) VALUES (?, ?, ?, ?, 1)').run(
                original.child_id,
                'penalty',
                -original.amount,
                `Cancellation of transaction ID ${original.id} -description: ${original.description}`
            );
        }

        const child = db.prepare('SELECT * FROM children WHERE id = ?').get(original.child_id);
        return child;
    });

    const child = transaction();
    io.emit('transactionReviewed', { transactionId, approved, child });
    res.json({ success: true, message: 'Transaction reviewed successfully' });
});

// Undo unreviewed transaction (for child dashboard)
// IMPORTANT: This must come BEFORE the DELETE route to avoid route matching issues
app.post('/api/transactions/:id/undo', (req, res) => {
    const transactionId = req.params.id;
    const transaction = db.transaction(() => {

        // Get transaction details before deleting
        const trans = db.prepare('SELECT * FROM transaction_log WHERE id = ?').get(transactionId);

        if (!trans) {
            throw new Error('Transaction not found');
        }

        // Only allow undo of unreviewed transactions
        if (trans.is_reviewed) {
            throw new Error('Cannot undo reviewed transactions');
        }

        // Reverse the transaction amount from the child's balance
        db.prepare('UPDATE children SET balance = balance - ? WHERE id = ?').run(trans.amount, trans.child_id);

        // Delete the transaction
        db.prepare('DELETE FROM transaction_log WHERE id = ?').run(transactionId);

        // Get updated child data
        const child = db.prepare('SELECT * FROM children WHERE id = ?').get(trans.child_id);

        return { transactionId, child };
    });

    try {
        const result = transaction();
        io.emit('transactionAdded', { child: result.child, transaction: null });
        res.json({ success: true, message: 'Transaction undone successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
    const transaction = db.transaction(() => {

        // Get transaction details before deleting
        const trans = db.prepare('SELECT * FROM transaction_log WHERE id = ?').get(transactionId);

        if (!trans) {
            throw new Error('Transaction not found');
        }

        // Only allow deletion of reviewed transactions to prevent balance issues
        if (!trans.is_reviewed) {
            throw new Error('Can only delete reviewed transactions. Please approve or reject first.');
        }

        // Reverse the transaction amount from the child's balance
        db.prepare('UPDATE children SET balance = balance - ? WHERE id = ?').run(trans.amount, trans.child_id);

        // Delete the transaction
        db.prepare('DELETE FROM transaction_log WHERE id = ?').run(transactionId);

        // Get updated child data
        const child = db.prepare('SELECT * FROM children WHERE id = ?').get(trans.child_id);

        return { transactionId, child };
    });

    try {
        const result = transaction();
        io.emit('transactionDeleted', result);
        res.json({ success: true, message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Export all data
app.get('/api/export', (req, res) => {
    try {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {
                children: db.prepare('SELECT * FROM children').all(),
                tasks: db.prepare('SELECT * FROM task_catalog').all(),
                rewards: db.prepare('SELECT * FROM rewards').all(),
                assignments: db.prepare('SELECT * FROM task_assignments').all(),
                transactions: db.prepare('SELECT * FROM transaction_log').all()
            }
        };

        const filename = `points-backup-${new Date().toISOString().split('T')[0]}.json`;
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Import all data
app.post('/api/import', (req, res) => {
    try {
        const { data } = req.body;

        // Validate version
        if (!data || data.version !== '1.0') {
            return res.status(400).json({ error: 'Incompatible backup version' });
        }

        // Use transaction for atomic operation
        const importData = db.transaction(() => {
            // Clear existing data in correct order (due to foreign keys)
            db.prepare('DELETE FROM transaction_log').run();
            db.prepare('DELETE FROM task_assignments').run();
            db.prepare('DELETE FROM children').run();
            db.prepare('DELETE FROM task_catalog').run();
            db.prepare('DELETE FROM rewards').run();

            // Reset auto-increment counters
            db.prepare('DELETE FROM sqlite_sequence').run();

            // Import children
            const insertChild = db.prepare(
                'INSERT INTO children (id, name, image, balance, created_at) VALUES (?, ?, ?, ?, ?)'
            );
            data.data.children.forEach(child => {
                insertChild.run(child.id, child.name, child.image, child.balance, child.created_at);
            });

            // Import tasks
            const insertTask = db.prepare(
                'INSERT INTO task_catalog (id, name, category, icon, completion_type, created_at) VALUES (?, ?, ?, ?, ?, ?)'
            );
            data.data.tasks.forEach(task => {
                insertTask.run(task.id, task.name, task.category, task.icon, task.completion_type, task.created_at);
            });

            // Import rewards
            const insertReward = db.prepare(
                'INSERT INTO rewards (id, name, cost, image, created_at) VALUES (?, ?, ?, ?, ?)'
            );
            data.data.rewards.forEach(reward => {
                insertReward.run(reward.id, reward.name, reward.cost, reward.image, reward.created_at);
            });

            // Import assignments
            const insertAssignment = db.prepare(
                'INSERT INTO task_assignments (id, child_id, task_id, points) VALUES (?, ?, ?, ?)'
            );
            data.data.assignments.forEach(assignment => {
                insertAssignment.run(assignment.id, assignment.child_id, assignment.task_id, assignment.points);
            });

            // Import transactions
            const insertTransaction = db.prepare(
                'INSERT INTO transaction_log (id, child_id, task_assignment_id, action_type, amount, description, is_reviewed, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            data.data.transactions.forEach(trans => {
                insertTransaction.run(
                    trans.id, trans.child_id, trans.task_assignment_id,
                    trans.action_type, trans.amount, trans.description,
                    trans.is_reviewed, trans.timestamp
                );
            });
        });

        importData();

        // Notify all clients to reload
        io.emit('dataImported');

        res.json({ success: true, message: 'Data imported successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
