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
    const { name, image } = req.body;
    const result = db.prepare('INSERT INTO children (name, image) VALUES (?, ?)').run(name, image);
    const child = db.prepare('SELECT * FROM children WHERE id = ?').get(result.lastInsertRowid);
    io.emit('childAdded', child);
    res.status(201).json(child);
});

app.patch('/api/children/:id', (req, res) => {
    const { name, image } = req.body;
    db.prepare('UPDATE children SET name = ?, image = ? WHERE id = ?').run(name, image, req.params.id);
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
    const today =new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const completedToday = db.prepare(`
        SELECT task_assignment_id, COUNT(*) as count
        FROM transaction_log
        WHERE child_id = ?
        AND action_type = 'task'
        AND DATE(timestamp) = ?
        AND task_assignment_id IS NOT NULL
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
