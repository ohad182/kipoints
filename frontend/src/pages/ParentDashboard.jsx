import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useSocket } from '../SocketContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';
import PromptDialog from '../components/PromptDialog';
import AddChildModal from '../components/AddChildModal';
import AddTaskModal from '../components/AddTaskModal';
import { ACTION_ICONS } from '../config/icons';
import AddRewardModal from '../components/AddRewardModal';
import AssignTaskModal from '../components/AssignTaskModal';
import PenaltyModal from '../components/PenaltyModal';
import './ParentDashboard.css';

function ParentDashboard() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('parentDashboardTab') || 'review';
    });
    const [children, setChildren] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [allAssignments, setAllAssignments] = useState([]);
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [preselectedAssignmentId, setPreselectedAssignmentId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [promptDialog, setPromptDialog] = useState(null);
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

    // Save active tab to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('parentDashboardTab', activeTab);
    }, [activeTab]);

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
            loadAllTransactions();
            loadChildren();
        });

        socket.on('transactionDeleted', () => {
            loadAllTransactions();
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
            socket.off('transactionDeleted');
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
        await Promise.all([loadChildren(), loadTasks(), loadRewards(), loadPendingTransactions(), loadAllTransactions(), loadAllAssignments()]);
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

    const loadAllTransactions = async () => {
        const data = await api.getTransactions();
        setAllTransactions(data);
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
        setConfirmDialog({
            message: t('confirm.deleteChild'),
            onConfirm: async () => {
                await api.deleteChild(id);
                setConfirmDialog(null);
                showNotification(t('alerts.childDeleted'), 'success');
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const addTask = async (data, editId) => {
        if (editId) {
            await api.updateTask(editId, data);
        } else {
            await api.addTask(data);
        }
    };

    const deleteTask = async (id) => {
        setconfirmDialog({
            message: t('confirm.deleteTask'),
            onConfirm: async () => {
                await api.deleteTask(id);
                setconfirmDialog(null);
                showNotification(t('alerts.taskDeleted'), 'success');
            },
            onCancel: () => setconfirmDialog(null)
        });
    };

    const assignTask = async (data) => {
        try {
            if (data.child_id === 'all') {
                // Assign to all children
                for (const child of children) {
                    await api.addAssignment({
                        child_id: child.id,
                        task_id: data.task_id,
                        points: data.points
                    });
                }
                showNotification(t('alerts.multipleTasksAssigned', { count: children.length }), 'success');
            } else {
                await api.addAssignment({
                    child_id: parseInt(data.child_id),
                    task_id: data.task_id,
                    points: data.points
                });
                showNotification(t('alerts.taskAssigned'), 'success');
            }
        } catch (error) {
            showNotification(t('alerts.taskAlreadyAssigned'), 'error');
        }
    };

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const assignMultipleTasks = async (childId, points) => {
        try {
            if (childId === 'all') {
                // Assign all selected tasks to all children
                let total = 0;
                for (const child of children) {
                    for (const taskId of selectedTasks) {
                        await api.addAssignment({
                            child_id: child.id,
                            task_id: parseInt(taskId),
                            points: parseInt(points)
                        });
                        total++;
                    }
                }
                showNotification(t('alerts.multipleTasksAssigned', { count: total }), 'success');
            } else {
                for (const taskId of selectedTasks) {
                    await api.addAssignment({
                        child_id: parseInt(childId),
                        task_id: parseInt(taskId),
                        points: parseInt(points)
                    });
                }
                showNotification(t('alerts.multipleTasksAssigned', { count: selectedTasks.length }), 'success');
            }
            setSelectedTasks([]);
            setShowAssignTask(false);
        } catch (error) {
            showNotification(t('alerts.someTasksAlreadyAssigned'), 'error');
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
        setconfirmDialog({
            message: t('confirm.deleteReward'),
            onConfirm: async () => {
                await api.deleteReward(id);
                setConfirmDialog(null);
                showNotification(t('alerts.rewardDeleted'), 'success');
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const deleteTransaction = async (id) => {
        setConfirmDialog({
            message: t('confirm.deleteTransaction'),
            onConfirm: async () => {
                try {
                    await api.deleteTransaction(id);
                    await loadAllTransactions();
                    setConfirmDialog(null);
                    showNotification(t('alerts.transactionDeleted'), 'success');
                } catch (error) {
                    showNotification(error.message || t('alerts.transactionDeleteError'), 'error');
                    setConfirmDialog(null);
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const addPenalty = async (data) => {
        await api.addTransaction(data);
    };

    const updateAssignmentPoints = async (id, points) => {
        setPromptDialog({
            message: t('prompts.howManyPoints'),
            defaultValue: points.toString(),
            onConfirm: async (newPoints) => {
                if (newPoints && !isNaN(newPoints)) {
                    await api.updateAssignment(id, { points: parseInt(newPoints) });
                    showNotification(t('alerts.pointsUpdated'), 'success');
                }
                setPromptDialog(null);
            },
            onCancel: () => setPromptDialog(null)
        });
    };

    const deleteAssignment = async (id) => {
        setConfirmDialog({
            message: t('confirm.deleteAssignment'),
            onConfirm: async () => {
                await api.deleteAssignment(id);
                setConfirmDialog(null);
                showNotification(t('alerts.assignmentDeleted'), 'success');
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const reviewTransaction = async (id, approved) => {
        await api.reviewTransaction(id, approved);
    };

    return (
        <div className="parent-dashboard">
            <button className="back-button" onClick={() => navigate('/')}>{t('child.back')}</button>

            <h1>{t('parent.dashboard')}</h1>

            <div className="tabs">
                <button
                    className={activeTab === 'review' ? 'active' : ''}
                    onClick={() => setActiveTab('review')}
                >
                    {t('parent.tabs.review')} ({pendingTransactions.length})
                </button>
                <button
                    className={activeTab === 'children' ? 'active' : ''}
                    onClick={() => setActiveTab('children')}
                >
                    {t('parent.tabs.children')}
                </button>
                <button
                    className={activeTab === 'tasks' ? 'active' : ''}
                    onClick={() => setActiveTab('tasks')}
                >
                    {t('parent.tabs.tasks')}
                </button>
                <button
                    className={activeTab === 'assignments' ? 'active' : ''}
                    onClick={() => setActiveTab('assignments')}
                >
                    {t('parent.tabs.assignments')} ({allAssignments.length})
                </button>
                <button
                    className={activeTab === 'rewards' ? 'active' : ''}
                    onClick={() => setActiveTab('rewards')}
                >
                    {t('parent.tabs.rewards')}
                </button>
                <button
                    className={activeTab === 'history' ? 'active' : ''}
                    onClick={() => setActiveTab('history')}
                >
                    {t('parent.tabs.history')}
                </button>
            </div>

            <div className="tab-content" key={activeTab}>
                {/* Overeview Tab */}
                {activeTab === 'review' && (
                    <div className="review-section">
                        <h2>{t('parent.tabs.review')}</h2>
                        {pendingTransactions.length === 0 ? (
                            <p className="empty-message">{t('parent.emptyPending')}</p>
                        ) : (
                            <div className="pending-list">
                                {pendingTransactions.map(transaction => (
                                    <div key={transaction.id} className="pending-item">
                                        <div className="pending-info">
                                            <strong>{transaction.child_name}</strong>
                                            <span>{transaction.description}</span>
                                            <span className={transaction.amount > 0 ? 'positive' : 'negative'}>
                                                {transaction.amount > 0 ? '+' : ''}{transaction.amount}  {t('parent.points')}
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
                                                {t('parent.approve')}
                                            </button>
                                            <button
                                                className="reject-button"
                                                onClick={() => reviewTransaction(transaction.id, false)}
                                            >
                                                {t('parent.reject')}
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
                        <button className="add-button" onClick={() => { setEditChild(null); setShowAddChild(true); }}>{t('parent.addChild')}</button>
                        <button className="add-button penalty-button" onClick={() => setShowPenalty(true)}>{t('parent.addPenalty')}</button>
                        <div className="items-grid">
                            {children.map(child => (
                                <div key={child.id} className="item-card">
                                    <div className="item-actions">
                                        <button className="item-action-btn edit" onClick={() => { setEditChild(child); setShowAddChild(true); }}>{ACTION_ICONS.edit}</button>
                                        <button className="item-action-btn delete" onClick={() => deleteChild(child.id)}>{ACTION_ICONS.delete}</button>
                                    </div>
                                    <div className="item-icon">
                                        {child.image ? (
                                            child.image.startsWith('data:') || child.image.startsWith('http') ? (
                                                <img src={child.image} alt={child.name} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                                            ) : (
                                                <span style={{ fontSize: '3rem' }}>{child.image}</span>
                                            )
                                        ) : (
                                            ACTION_ICONS.info
                                        )}
                                    </div>
                                    <div className="item-name">{child.name}</div>
                                    <div className="item-info">{child.balance} {t('parent.points')}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="management-section">
                        <div className="tasks-header">
                            <button className="add-button" onClick={() => { setEditTask(null); setShowAddTask(true); }}>{t('parent.addTask')}</button>
                            <button className="add-button" onClick={() => setShowAssignTask(true)}>{t('parent.assignTask')}</button>
                            {selectedTasks.length > 0 && (
                                <>
                                    <button className="add-button assign-selected-button" onClick={() => setShowAssignTask(true)}>
                                        {t('parent.assignSelected')} ({selectedTasks.length})
                                    </button>
                                    <button className="add-button clear-selection-button" onClick={() => setSelectedTasks([])}>
                                        {t('parent.clearSelection')}
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="items-grid">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`item-card ${selectedTasks.includes(task.id) ? 'selected' : ''}`}
                                    onClick={() => toggleTaskSelection(task.id)}
                                >
                                    <div className="item-actions">
                                        <button
                                            className="item-action-btn edit"
                                            onClick={(e) => { e.stopPropagation(); setEditTask(task); setShowAddTask(true); }}
                                        >
                                            {ACTION_ICONS.edit}
                                        </button>
                                        <button
                                            className="item-action-btn delete"
                                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                        >
                                            {ACTION_ICONS.delete}
                                        </button>
                                    </div>
                                    {selectedTasks.includes(task.id) && (
                                        <div className="selection-checkbox">{ACTION_ICONS.task}</div>
                                    )}
                                    <div className="item-icon">{task.icon || ACTION_ICONS.task}</div>
                                    <div className="item-name">{task.name}</div>
                                    <div className="item-info">
                                        {t(`categories.${task.category}`)}
                                        {' • '}
                                        {t(`completionType.${task.completion_type}`)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Assignments Tab */}
                {activeTab === 'assignments' && (
                    <div className="management-section">
                        <div className="assignments-header">
                            <button
                                className="add-button"
                                onClick={() => setShowAssignTask(true)}
                            >
                                {t('parent.assignTask')}
                            </button>
                            <select
                                className="assignment-filter"
                                value={assignmentFilter}
                                onChange={(e) => setAssignmentFilter(e.target.value)}
                            >
                                <option value="all">{t('parent.filterAll')}</option>
                                {children.map(child => (
                                    <option key={child.id} value={child.id}>{child.name}</option>
                                ))}
                            </select>
                        </div>
                        {allAssignments.length === 0 ? (
                            <p className="empty-message">{t('parent.emptyAssignments')}</p>
                        ) : (
                            <div className="assignments-list">
                                {allAssignments
                                    .filter(assignment => assignmentFilter === 'all' || assignment.child_id === parseInt(assignmentFilter))
                                    .map(assignment => (
                                        <div
                                            key={assignment.id}
                                            className={`assignment-item ${preselectedAssignmentId === assignment.id ? 'selected' : ''}`}
                                            onClick={(e) => {
                                                // Prevent click if clicking on action buttons
                                                if (!e.target.closest('.item-action-btn')) {
                                                    // Toggle selection - if clicking the same assignment, deselect it
                                                    setPreselectedAssignmentId(prev => prev === assignment.id ? null : assignment.id);
                                                }
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="assignment-info">
                                                <div className="assignment-icon">{assignment.icon || ACTION_ICONS.task}</div>
                                                <div className="assignment-details">
                                                    <strong>{assignment.child_name}</strong>
                                                    <span>{assignment.name}</span>
                                                    <span className="assignment-category">
                                                        {t(`categories.${assignment.category}`)}
                                                    </span>
                                                </div>
                                                <div className="assignment-points">{assignment.points} {t('parent.points')} </div>
                                            </div>
                                            <div className="assignment-actions">
                                                <button
                                                    className="item-action-btn edit"
                                                    onClick={() => updateAssignmentPoints(assignment.id, assignment.points)}
                                                    title={t('buttons.updatePoints')}
                                                >
                                                    {ACTION_ICONS.edit}
                                                </button>
                                                <button
                                                    className="item-action-btn delete"
                                                    onClick={() => deleteAssignment(assignment.id)}
                                                    title={t('buttons.deleteAssignment')}
                                                >
                                                    {ACTION_ICONS.delete}
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
                        <button className="add-button" onClick={() => { setEditReward(null); setShowAddReward(true); }}>{t('parent.addReward')}</button>
                        <div className="items-grid">
                            {rewards.map(reward => (
                                <div key={reward.id} className="item-card">
                                    <div className="item-actions">
                                        <button className="item-action-btn edit" onClick={() => { setEditReward(reward); setShowAddReward(true); }}>{ACTION_ICONS.edit}</button>
                                        <button className="item-action-btn delete" onClick={() => deleteReward(reward.id)}>{ACTION_ICONS.delete}</button>
                                    </div>
                                    <div className="item-icon">{reward.image || ACTION_ICONS.reward}</div>
                                    <div className="item-name">{reward.name}</div>
                                    <div className="item-info">{reward.cost} {t('parent.points')}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="history-section">
                        <h2>{t('parent.tabs.history')}</h2>
                        {allTransactions.length === 0 ? (
                            <p className="empty-message">{t('parent.emptyHistory')}</p>
                        ) : (
                            <div className="history-list">
                                {allTransactions.filter(t => t.is_reviewed).map(transaction => (
                                    <div key={transaction.id} className="history-item">
                                        <div className="transaction-info">
                                            <div className="transaction-child">{transaction.child_name}</div>
                                            <div className="transaction-desc">{transaction.description}</div>
                                            <div className="transaction-date">{new Date(transaction.timestamp).toLocaleDateString()}</div>
                                        </div>
                                        <div className="transaction-amount" style={{ color: transaction.amount > 0 ? '#4caf50' : '#f44336' }}>
                                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} {t('parent.points')}
                                        </div>
                                        <button
                                            className="item-action-btn delete"
                                            onClick={() => deleteTransaction(transaction.id)}
                                            title={t('parent.deleteTransaction')}
                                        >
                                            {ACTION_ICONS.delete}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
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
                onClose={() => {
                    setShowAssignTask(false);
                    setPreselectedAssignmentId(null);
                }}
                onSubmit={assignTask}
                onBulkSubmit={assignMultipleTasks}
                children={children}
                tasks={tasks}
                selectedTasks={selectedTasks}
                allAssignments={allAssignments}
                preselectedTaskId={preselectedAssignmentId ? allAssignments.find(a => a.id === preselectedAssignmentId)?.task_id : null}
            />
            <PenaltyModal
                isOpen={showPenalty}
                onClose={() => setShowPenalty(false)}
                onSubmit={addPenalty}
                children={children}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog !== null}
                message={confirmDialog?.message}
                onConfirm={confirmDialog?.onConfirm}
                onCancel={confirmDialog?.onCancel}
                confirmText={t('modal.confirm')}
                cancelText={t('modal.cancel')}
            />

            {/* Prompt Dialog */}
            {promptDialog && (
                <PromptDialog
                    message={promptDialog.message}
                    defaultValue={promptDialog.defaultValue}
                    onConfirm={promptDialog.onConfirm}
                    onCancel={promptDialog.onCancel}
                    confirmText={t('modal.save')}
                    cancelText={t('modal.cancel')}
                />
            )}
        </div>
    );
}

export default ParentDashboard;
