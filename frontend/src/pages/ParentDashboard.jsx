import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useSocket } from '../SocketContext';
import AddChildModal from '../components/AddChildModal';
import AddTaskModal from '../components/AddTaskModal';
import AddRewardModal from '../components/AddRewardModal';
import AssignTaskModal from '../components/AssignTaskModal';
import PenaltyModal from '../components/PenaltyModal';
import './ParentDashboard.css';

function ParentDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('review');
    const [children, setChildren] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [allAssignments, setAllAssignments] = useState([]);
    const { socket } = useSocket();

    // Modal states
    const [showAddChild, setShowAddChild] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddReward, setShowAddReward] = useState(false);
    const [showAssignTask, setShowAssignTask] = useState(false);
    const [showPenalty, setShowPenalty] = useState(false);
    const [editChild, setEditChild] = useState(null);
    const [editTask, setEditTask] = useState(null);
    const [editReward, setEditReward] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('transactionAdded', () => {
            loadPendingTransactions();
            loadChildren();
        });

        socket.on('transactionReviewed', () => {
            loadPendingTransactions();
            loadChildren();
        });

        socket.on('childAdded', () => loadChildren());
        socket.on('taskAdded', () => loadTasks());
        socket.on('rewardAdded', () => loadRewards());
        socket.on('childUpdated', () => loadChildren());
        socket.on('taskUpdated', () => loadTasks());
        socket.on('rewardUpdated', () => loadRewards());
        socket.on('childDeleted', () => loadChildren());
        socket.on('taskDeleted', () => loadTasks());
        socket.on('rewardDeleted', () => loadRewards());
        socket.on('assignmentAdded', () => loadAllAssignments());
        socket.on('assignmentUpdated', () => loadAllAssignments());
        socket.on('assignmentDeleted', () => loadAllAssignments());


        return () => {
            socket.off('transactionAdded');
            socket.off('transactionReviewed');
            socket.off('childAdded');
            socket.off('taskAdded');
            socket.off('childUpdated');
            socket.off('taskUpdated');
            socket.off('rewardUpdated');
            socket.off('childDeleted');
            socket.off('taskDeleted');
            socket.off('rewardAdded');
            socket.off('rewardDeleted');
            socket.off('assignmentAdded');
            socket.off('assignmentUpdated');
            socket.off('assignmentDeleted');
        };
    }, [socket]);

    const loadData = async () => {
        await Promise.all([loadChildren(), loadTasks(), loadRewards(), loadPendingTransactions(), loadAllAssignments()]);
    };

    const loadChildren = async () => {
        try {
            const data = await api.getChildren();
            setChildren(data);
        } catch (error) {
            console.error('Error loading children:', error);
        }
    };

    const loadTasks = async () => {
        try {
            const data = await api.getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const loadRewards = async () => {
        try {
            const data = await api.getRewards();
            setRewards(data);
        } catch (error) {
            console.error('Error loading rewards:', error);
        }
    };

    const loadPendingTransactions = async () => {
        try {
            const data = await api.getPendingTransactions();
            setPendingTransactions(data);
        } catch (error) {
            console.error('Error loading pending transactions:', error);
        }
    };

    const loadAllAssignments = async () => {
        // Get all assignments for all children
        const childrenData = await api.getChildren();
        const allAssignmentsData = [];

        for (const child of childrenData) {
            const assignments = await api.getAssignments(child.id);
            assignments.forEach(assignment => {
                allAssignments.push({
                    ...assignment,
                    childName: child.name
                });
            });
        }
        setAllAssignments(allAssignmentsData);
    };

    const addChild = async (data, editId) => {
        if (editId) {
            await api.updateChild(editId, data);
        } else {
            await api.addChild(data);
        }
    }

    const deleteChild = async (id) => {
        if (confirm('האם אתה בטוח שברצונך למחוק ילד זה? כל הנתונים שלו יימחקו.')) {
            await api.deleteChild(id);
        }
    }

    const addTask = async (data, editId) => {
        if (editId) {
            await api.updateTask(editId, data);
        } else {
            await api.addTask(data);
        }
    }

    const deleteTask = async (id) => {
        if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
            await api.deleteTask(id);
        }
    };

    const assignTask = async (data) => {
        try {
            await api.addAssignment(data);
            alert('המשימה הוקצתה בהצלחה!');
        } catch (error) {
            alert('שגיאה בהקצאת המשימה. אולי משויכת כבר.');
        }
    };

    const addReward = async (data, editId) => {
        if (editId) {
            await api.updateReward(editId, data);
        } else {
            await api.addReward(data);
        }
    }

    const deleteReward = async (id) => {
        if (confirm('האם אתה בטוח שברצונך למחוק פרס זה?')) {
            try {
                await api.deleteReward(id);
            } catch (error) {
                console.error('Error deleting reward:', error);
            }
        }
    };

    const addPenalty = async (data) => {
        await api.addTransaction(data);
    };

    const updateAssignmentPoints = async (id, points) => {
        const newPoints = prompt('הזן את מספר הנקודות החדש עבור המשימה:', points);
        if (newPoints && !isNaN(newPoints)) {
            await api.updateAssignment(id, { points: parseInt(newPoints) });
        }
    };

    const deleteAssignment = async (id) => {
        if (confirm('האם אתה בטוח שברצונך למחוק הקצאת משימה זו?')) {
            await api.deleteAssignment(id);
        }
    };

    const reviewTransaction = async (id, approved) => {
        await api.reviewTransaction(id, approved);
    };

    return (
        <div className="parent-dashboard">
            <button className="back-button" onClick={() => navigate('/')}>← חזור הביתה</button>

            <header className="dashboard-header">
                <h1>ממשק הורים</h1>
                <div className="header-stats">
                    <div className="stat">
                        <span className="stat-label">ילדים:</span>
                        <span className="stat-value">{children.length}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">משימות:</span>
                        <span className="stat-value">{tasks.length}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">פרסים:</span>
                        <span className="stat-value">{rewards.length}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">בהמתנה:</span>
                        <span className="stat-value pending">{pendingTransactions.length}</span>
                    </div>
                </div>
            </header>

            <nav className="tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    סקירה כללית
                </button>
                <button
                    className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    משימות
                </button>
                <button
                    className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rewards')}
                >
                    פרסים
                </button>
                <button
                    className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    עסקאות בהמתנה
                </button>
            </nav>

            <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <div className="children-summary">
                            <h2>ילדים</h2>
                            <div className="children-list">
                                {children.map(child => (
                                    <div key={child.id} className="child-summary-card">
                                        <div className="summary-avatar">
                                            {child.image ? (
                                                <img src={child.image} alt={child.name} />
                                            ) : (
                                                <span>👤</span>
                                            )}
                                        </div>
                                        <div className="summary-info">
                                            <h3>{child.name}</h3>
                                            <p>נקודות: <strong>{child.balance}</strong></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="tasks-section">
                        <form className="add-form" onSubmit={handleAddTask}>
                            <h2>הוסף משימה חדשה</h2>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="שם המשימה"
                                    value={newTask.name}
                                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={newTask.category}
                                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                >
                                    <option value="morning">בוקר</option>
                                    <option value="afternoon">צהריים</option>
                                    <option value="evening">ערב</option>
                                    <option value="other">אחרים</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="סמל/אמוג'י"
                                    value={newTask.icon}
                                    onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
                                    maxLength="2"
                                />
                            </div>
                            <button type="submit" className="btn-primary">הוסף משימה</button>
                        </form>

                        <div className="items-list">
                            <h2>משימות קיימות</h2>
                            {tasks.map(task => (
                                <div key={task.id} className="item-card">
                                    <span className="item-icon">{task.icon}</span>
                                    <div className="item-details">
                                        <h3>{task.name}</h3>
                                        <p>{task.category === 'morning' ? 'בוקר' : task.category === 'afternoon' ? 'צהריים' : task.category === 'evening' ? 'ערב' : 'אחרים'}</p>
                                    </div>
                                    <button
                                        className="btn-danger"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        מחק
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rewards Tab */}
                {activeTab === 'rewards' && (
                    <div className="rewards-section">
                        <form className="add-form" onSubmit={handleAddReward}>
                            <h2>הוסף פרס חדש</h2>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="שם הפרס"
                                    value={newReward.name}
                                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="עלות בנקודות"
                                    value={newReward.cost}
                                    onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="תמונה/אמוג'י"
                                    value={newReward.image}
                                    onChange={(e) => setNewReward({ ...newReward, image: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-primary">הוסף פרס</button>
                        </form>

                        <div className="items-list">
                            <h2>פרסים קיימים</h2>
                            {rewards.map(reward => (
                                <div key={reward.id} className="item-card">
                                    <span className="item-icon">{reward.image || '🎁'}</span>
                                    <div className="item-details">
                                        <h3>{reward.name}</h3>
                                        <p>{reward.cost} נקודות</p>
                                    </div>
                                    <button
                                        className="btn-danger"
                                        onClick={() => deleteReward(reward.id)}
                                    >
                                        מחק
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="transactions-section">
                        <h2>עסקאות בהמתנה לאישור</h2>
                        {pendingTransactions.length > 0 ? (
                            <div className="transactions-list">
                                {pendingTransactions.map(transaction => (
                                    <div key={transaction.id} className="transaction-card">
                                        <div className="transaction-info">
                                            <h3>{transaction.child_name}</h3>
                                            <p className="description">{transaction.description}</p>
                                            <p className="type">{transaction.action_type === 'task' ? 'משימה' : transaction.action_type === 'reward' ? 'פרס' : transaction.action_type === 'penalty' ? 'קנס' : 'בונוס'}</p>
                                        </div>
                                        <div className="transaction-amount">
                                            <span className={transaction.amount > 0 ? 'positive' : 'negative'}>
                                                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                            </span>
                                        </div>
                                        <div className="transaction-actions">
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleApproveTransaction(transaction.id)}
                                            >
                                                אשר
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleRejectTransaction(transaction.id)}
                                            >
                                                דחה
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-transactions">אין עסקאות בהמתנה</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ParentDashboard;
