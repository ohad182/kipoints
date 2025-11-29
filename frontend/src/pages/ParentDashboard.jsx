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
                allAssignmentsData.push({
                    ...assignment,
                    child_name: child.name
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
    };

    const deleteChild = async (id) => {
        if (confirm('האם אתה בטוח שברצונך למחוק ילד זה? כל הנתונים שלו יימחקו.')) {
            await api.deleteChild(id);
        }
    };

    const addTask = async (data, editId) => {
        if (editId) {
            await api.updateTask(editId, data);
        } else {
            await api.addTask(data);
        }
    };

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
    };

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

            <h1>ממשק הורים</h1>

            <div className="tabs">
                <button
                    className={activeTab === 'review' ? 'active' : ''}
                    onClick={() => setActiveTab('review')}
                >
                    סקירה כללית               ({pendingTransactions.length})
                </button>
                <button
                    className={activeTab === 'children' ? 'active' : ''}
                    onClick={() => setActiveTab('children')}
                >
                    ילדים
                </button>
                <button
                    className={activeTab === 'tasks' ? 'active' : ''}
                    onClick={() => setActiveTab('tasks')}
                >
                    משימות
                </button>
                <button
                    className={activeTab === 'assignments' ? 'active' : ''}
                    onClick={() => setActiveTab('assignments')}
                >
                    שיוכים ({allAssignments.length})
                </button>
                <button
                    className={activeTab === 'rewards' ? 'active' : ''}
                    onClick={() => setActiveTab('rewards')}
                >
                    פרסים
                </button>
                <button
                    className={activeTab === 'transactions' ? 'active' : ''}
                    onClick={() => setActiveTab('transactions')}
                >
                    עסקאות בהמתנה
                </button>
            </div>

            <div className="tab-content">
                {/* Overeview Tab */}
                {activeTab === 'review' && (
                    <div className="review-section">
                        <h2>פעולות ממתינות לבדיקה</h2>
                        {pendingTransactions.length === 0 ? (
                            <p className="empty-message">אין פעולות ממתינות</p>
                        ) : (
                            <div className="pending-list">
                                {pendingTransactions.map(transaction => (
                                    <div key={transaction.id} className="pending-item">
                                        <div className="pending-info">
                                            <strong>{transaction.child_id}</strong>
                                            <span>{transaction.description}</span>
                                            <span className={transaction.amount > 0 ? 'positive' : 'negative'}>
                                                {transaction.amount > 0 ? '+' : ''}{transaction.amount} נקודות
                                            </span>
                                            <span className="timestamp">
                                                {new Date(transaction.timestamp).toLocaleString('he-IL')}
                                            </span>
                                        </div>
                                        <div className="pending-actions">
                                            <button
                                                className="approve-button"
                                                onClick={() => reviewTransaction(transaction.id, true)}
                                            >
                                                אשר
                                            </button>
                                            <button
                                                className="rejeect-button"
                                                onClick={() => reviewTransaction(transaction.id, false)}
                                            >
                                                דחה
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Children Management Tab */}
                {activeTab === 'children' && (
                    <div className="management-section">
                        <button className="add-button" onClick={() => { setEditChild(null); setShowAddChild(true); }}>הוסף ילד +</button>
                        <button className="add-button penalty-button" onClick={() => setShowPenalty(true)}>הורד נקודות -</button>
                        <div className="items-grid">
                            {children.map(child => (
                                <div key={child.id} className="item-card">
                                    <div className="item-actions">
                                        <button className="item-action-btn edit" onClick={() => {setEditChild(child); setShowAddChild(true); }}>✏️</button>
                                        <button className="item-action-btn delete" onClick={() => deleteChild(child.id)}>🗑️</button>
                                    </div>
                                    <div className="item-icon">
                                        {child.image ? (
                                            <img src={child.image} alt={child.name} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                                        ) : (
                                            '👤'
                                        )}
                                    </div>
                                    <div className="item-name">{child.name}</div>
                                    <div className="item-info">{child.balance}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="management-section">
                        <button className="add-button" onClick={() => { setEditTask(null); setShowAddTask(true); }}>הוסף משימה +</button>
                        <button className="add-button" onClick={() => setShowAssignTask(true)}>שיוך משימה לילד</button>
                        <div className="items-grid">
                            <h2>משימות קיימות</h2>
                            {tasks.map(task => (
                                <div key={task.id} className="item-card">
                                    <div className="items-actions">
                                        <button className="item-action-btn edit" onClick={() => { setEditTask(task); setShowAddTask(true); }}>✏️</button>
                                        <button className="item-action-btn delete" onClick={() => deleteTask(task.id) }>🗑️</button>
                                    </div>
                                    <div className="item-icon">{task.icon || 'i'}</div>
                                    <div className="item-name">{task.name}</div>
                                    <div className="item-info">
                                        {task.category === 'morning' ? 'בוקר' : task.category === 'afternoon' ? 'צהריים' : task.category === 'evening' ? 'ערב' : 'אחרים'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Assignments Tab */}
                {activeTab === 'assignments' && (
                    <div className="management-section">
                        <button className="add-button" onClick={() => setShowAssignTask(true)}>שיוך משימה לילד</button>
                        {allAssignments.length === 0 ? (
                            <p className="empty-message">אין שיוכים עדייו</p>
                        ) : (
                            <div className="assignments-grid">
                            {allAssignments.map(assignment => (
                                <div key={assignment.id} className="assignment-item">
                                    <div className="assignment-info">
                                        <div className="assignment-icon">{assignment.icon || 'v'}</div>
                                        <div className="assignment-details">
                                            <strong>{assignment.child_name}</strong>
                                            <span>{assignment.name}</span>
                                            <span className="assignment-category">
                                                {assignment.category === 'morning' && 'בוקר'}
                                                {assignment.category === 'afternoon' && 'צהריים'}
                                                {assignment.category === 'evening' && 'ערב'}
                                                {assignment.category === 'other' && 'אחר'}
                                            </span>
                                        </div>
                                        <div className="assignment-points">{assignment.points} נקודות </div>
                                    </div>
                                    <div className="assignment-actions">
                                        <button
                                          className="item-action-btn edit"
                                          onClick={() => updateAssignmentPoints(assignment.id, assignment.points)}
                                          title="ערוך נקודות"
                                          >
                                            ✏️
                                        </button>
                                        <button
                                          className="item-action-btn delete"
                                          onClick={() => deleteAssignment(assignment.id)}
                                          title="מחק שיוך"
                                          >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>
                )}


                {/* Rewards Tab */}
                {activeTab === 'rewards' && (
                    <div className="management-section">
                        <button className="add-button" onClick={() => { setEditReward(null); setShowAddReward(true); }}>הוסף פרס +</button>
                        <div className="items-grid">
                            <h2>פרסים קיימים</h2>
                            {rewards.map(reward => (
                                <div key={reward.id} className="item-card">
                                    <div className="items-actions">
                                        <button className="item-action-btn edit" onClick={() => { setEditReward(reward); setShowAddReward(true); }}>✏️</button>
                                        <button className="item-action-btn delete" onClick={() => deleteReward(reward.id) }>🗑️</button>
                                    </div>
                                    <div className="item-icon">{reward.image || 'i'}</div>
                                    <div className="item-name">{reward.name}</div>
                                    <div className="item-info">{reward.cost} נקודות </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modals */}
                <AddChildModal
                    isOpen={showAddChild}
                    onClose={() => { setShowAddChild(false); setEditChild(null); }}
                    onSubmit={addChild}
                    editData={editChild}
                />
                <AddTaskModal
                    isOpen={showAddTask}
                    onClose={() => { setShowAddTask(false); setEditTask(null); }}
                    onSubmit={addTask}
                    editData={editTask}
                />
                <AddRewardModal
                    isOpen={showAddReward}
                    onClose={() => { setShowAddReward(false); setEditReward(null); }}
                    onSubmit={addReward}
                    editData={editReward}
                />
                <AssignTaskModal
                    isOpen={showAssignTask}
                    onClose={() => setShowAssignTask(false)}
                    onSubmit={assignTask}
                    children={children}
                    tasks={tasks}
                />
                <PenaltyModal
                    isOpen={showPenalty}
                    onClose={() => setShowPenalty(false)}
                    onSubmit={addPenalty}
                    children={children}
                />


            </div>
        </div>
    )
};

export default ParentDashboard;
