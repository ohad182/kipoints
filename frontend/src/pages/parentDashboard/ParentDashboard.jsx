import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useSocket } from '../../SocketContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import PromptDialog from '../../components/PromptDialog';
import AddChildModal from './modals/AddChildModal';
import AddTaskModal from './modals/AddTaskModal';
import AddRewardModal from './modals/AddRewardModal';
import AssignTaskModal from './modals/AssignTaskModal';
import PenaltyModal from './modals/PenaltyModal';
import AdjustPointsModal from './modals/AdjustPointsModal';
import DashboardTab from './components/DashboardTab';
import SetupTab from './components/SetupTab';
import ReviewTab from './components/ReviewTab';
import HistoryTab from './components/HistoryTab';
import BackupTab from './components/BackupTab';
import './ParentDashboard.css';

function ParentDashboard() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('parentDashboardTab') || 'dashboard';
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
    const [showAdjustPoints, setShowAdjustPoints] = useState(false);
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

        socket.on('dataImported', () => {
            // Reload all data when import happens
            loadData();
        });

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

    const adjustPoints = async (data) => {
        try {
            await api.addTransaction(data);
            setShowAdjustPoints(false);
            showNotification(t('alerts.pointsAdjusted'), 'success');
        } catch (error) {
            showNotification(t('alerts.error'), 'error');
        }
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

    const reviewAllTransactions = async (approved) => {
        if (pendingTransactions.length === 0) return;

        const action = approved ? t('parent.approveAll') : t('parent.rejectAll');
        setConfirmDialog({
            isOpen: true,
            title: action,
            message: `${action} ${pendingTransactions.length} ${t('parent.points')}?`,
            onConfirm: async () => {
                try {
                    // Review all pending transactions
                    await Promise.all(
                        pendingTransactions.map(transaction =>
                            api.reviewTransaction(transaction.id, approved)
                        )
                    );
                    setConfirmDialog(null);
                } catch (error) {
                    console.error('Failed to review all transactions:', error);
                    setConfirmDialog(null);
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const handleExport = async () => {
        try {
            const blob = await api.exportData();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `points-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showNotification(t('backup.exportSuccess'), 'success');
        } catch (error) {
            showNotification(t('backup.exportError'), 'error');
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setConfirmDialog({
            message: t('backup.importWarning'),
            onConfirm: async () => {
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    await api.importData(data);
                    showNotification(t('backup.importSuccess'), 'success');
                    // Reload page after successful import
                    setTimeout(() => window.location.reload(), 2000);
                } catch (error) {
                    showNotification(t('backup.importError'), 'error');
                }
                setConfirmDialog(null);
                // Reset file input
                event.target.value = '';
            },
            onCancel: () => {
                setConfirmDialog(null);
                event.target.value = '';
            }
        });
    };

    return (
        <div className="parent-dashboard">
            <h1>{t('parent.dashboard')}</h1>

            <div className="tabs">
                <button
                    className={activeTab === 'dashboard' ? 'active' : ''}
                    onClick={() => setActiveTab('dashboard')}
                >
                    {t('parent.tabs.dashboard')}
                </button>
                <button
                    className={activeTab === 'setup' ? 'active' : ''}
                    onClick={() => setActiveTab('setup')}
                >
                    {t('parent.tabs.setup')}
                </button>
                <button
                    className={activeTab === 'review' ? 'active' : ''}
                    onClick={() => setActiveTab('review')}
                >
                    {t('parent.tabs.review')} ({pendingTransactions.length})
                </button>
                <button
                    className={activeTab === 'history' ? 'active' : ''}
                    onClick={() => setActiveTab('history')}
                >
                    {t('parent.tabs.history')}
                </button>
                <button
                    className={activeTab === 'backup' ? 'active' : ''}
                    onClick={() => setActiveTab('backup')}
                >
                    {t('parent.tabs.backup')}
                </button>
            </div>

            <div className="tab-content" key={activeTab}>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <DashboardTab
                        children={children}
                        tasks={tasks}
                        allAssignments={allAssignments}
                        pendingTransactions={pendingTransactions}
                        rewards={rewards}
                        allTransactions={allTransactions}
                        onAssignTask={() => setShowAssignTask(true)}
                        onAddChild={() => { setEditChild(null); setShowAddChild(true); }}
                        onAddPenalty={() => setShowPenalty(true)}
                        onAdjustPoints={() => setShowAdjustPoints(true)}
                        onEditChild={(child) => { setEditChild(child); setShowAddChild(true); }}
                        onDeleteChild={deleteChild}
                    />
                )}

                {/* Setup Tab */}
                {activeTab === 'setup' && (
                    <SetupTab
                        tasks={tasks}
                        rewards={rewards}
                        allAssignments={allAssignments}
                        selectedTasks={selectedTasks}
                        onEditTask={(task) => { setEditTask(task); setShowAddTask(true); }}
                        onDeleteTask={deleteTask}
                        onAddTask={() => { setEditTask(null); setShowAddTask(true); }}
                        onAssignTask={() => setShowAssignTask(true)}
                        onToggleTaskSelection={toggleTaskSelection}
                        onClearSelection={() => setSelectedTasks([])}
                        onDeleteAssignment={deleteAssignment}
                        onEditReward={(reward) => { setEditReward(reward); setShowAddReward(true); }}
                        onDeleteReward={deleteReward}
                        onAddReward={() => { setEditReward(null); setShowAddReward(true); }}
                    />
                )}

                {/* Review Tab */}
                {activeTab === 'review' && (
                    <ReviewTab
                        pendingTransactions={pendingTransactions}
                        onReviewTransaction={reviewTransaction}
                        onReviewAll={reviewAllTransactions}
                    />
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <HistoryTab
                        allTransactions={allTransactions}
                        onDeleteTransaction={deleteTransaction}
                    />
                )}

                {/* Backup Tab */}
                {activeTab === 'backup' && (
                    <BackupTab
                        onExport={handleExport}
                        onImport={handleImport}
                    />
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
            {showAdjustPoints && (
                <AdjustPointsModal
                    children={children}
                    onClose={() => setShowAdjustPoints(false)}
                    onSave={adjustPoints}
                />
            )}

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
