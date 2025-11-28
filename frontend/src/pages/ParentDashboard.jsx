import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useSocket } from "../SocketContext";
import AddChildModal from "../components/AddChildModal";
import AddTaskModal from "../components/AddTaskModal";
import AddRewardModal from "../components/AddRewardModal";
import AssignTaskModal from "../components/AssignTaskModal";
import PenaltyModal from "../components/PenaltyModal";
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


    const [newTask, setNewTask] = useState({ name: '', category: 'other', icon: '' });
    const [newReward, setNewReward] = useState({ name: '', cost: '', image: '' });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('childAdded', (child) => {
            setChildren(prev => [...prev, child]);
        });

        socket.on('childUpdated', (child) => {
            setChildren(prev => prev.map(c => c.id === child.id ? child : c));
        });

        socket.on('taskAdded', (task) => {
            setTasks(prev => [...prev, task]);
        });

        socket.on('rewardAdded', (reward) => {
            setRewards(prev => [...prev, reward]);
        });

        socket.on('transactionAdded', (data) => {
            setPendingTransactions(prev => [...prev, data.transaction]);
        });

        return () => {
            socket.off('childAdded');
            socket.off('childUpdated');
            socket.off('taskAdded');
            socket.off('rewardAdded');
            socket.off('transactionAdded');
        };
    }, [socket]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [childrenData, tasksData, rewardsData, transactionsData] = await Promise.all([
                api.getChildren(),
                api.getTasks(),
                api.getRewards(),
                api.getPendingTransactions()
            ]);
            setChildren(childrenData);
            setTasks(tasksData);
            setRewards(rewardsData);
            setPendingTransactions(transactionsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.name.trim()) return;

        try {
            await api.addTask(newTask);
            setNewTask({ name: '', category: 'other', icon: '' });
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleAddReward = async (e) => {
        e.preventDefault();
        if (!newReward.name.trim() || !newReward.cost) return;

        try {
            await api.addReward({ ...newReward, cost: parseInt(newReward.cost) });
            setNewReward({ name: '', cost: '', image: '' });
        } catch (error) {
            console.error('Error adding reward:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
            try {
                await api.deleteTask(id);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleDeleteReward = async (id) => {
        if (confirm('האם אתה בטוח שברצונך למחוק פרס זה?')) {
            try {
                await api.deleteReward(id);
            } catch (error) {
                console.error('Error deleting reward:', error);
            }
        }
    };

    const handleApproveTransaction = async (id) => {
        try {
            await api.reviewTransaction(id, { approved: true });
            setPendingTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error approving transaction:', error);
        }
    };

    const handleRejectTransaction = async (id) => {
        try {
            await api.reviewTransaction(id, { approved: false });
            setPendingTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error rejecting transaction:', error);
        }
    };

    if (loading) {
        return <div className="loading">טוען...</div>;
    }

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
                                        onClick={() => handleDeleteTask(task.id)}
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
                                        onClick={() => handleDeleteReward(reward.id)}
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
