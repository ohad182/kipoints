import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import { useSocket } from '../../SocketContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import TopBar from './components/TopBar';
import ViewToggle from './components/ViewToggle';
import TasksView from './components/TasksView';
import RewardsView from './components/RewardsView';
import './ChildDashboard.css';

function ChildDashboard() {
    const { id } = useParams();
    const [child, setChild] = useState(null);
    const [tasks, setTasks] = useState({ morning: [], afternoon: [], evening: [], other: [] });
    const [rewards, setRewards] = useState([]);
    const [completedToday, setCompletedToday] = useState({});
    const [pendingTasks, setPendingTasks] = useState({}); // Track pending (unreviewed) task transactions

    // Function to get category based on current time
    const getTimeBasedCategory = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return 'morning';// 5:00 AM - 11:59 AM
        } else if (hour >= 12 && hour < 18) {
            return 'afternoon'; // 12:00 PM - 5:59 PM
        } else if (hour >= 18 && hour < 22) {
            return 'evening'; // 6:00 PM - 9:59 PM
        } else {
            return 'evening'; // 10:00 PM - 4:59 AM  (default to evening)
        }
    };

    const [activeCategory, setActiveCategory] = useState(getTimeBasedCategory);
    const [view, setView] = useState('tasks'); // 'tasks' or 'rewards'
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const { socket } = useSocket();
    const { t } = useLanguage();
    const { showNotification } = useNotification();

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        socket.on('transactionAdded', async (data) => {
            if (data.child.id === parseInt(id)) {
                setChild(data.child);
                // Reload completed tasks to update the UI
                const completedData = await api.getCompletedToday(id);
                setCompletedToday(completedData);
                // Reload pending tasks to show undo buttons
                const pendingData = await api.getPendingTasks(id);
                setPendingTasks(pendingData);
            }
        });

        socket.on('transactionReviewed', async (data) => {
            if (data.child.id === parseInt(id)) {
                setChild(data.child);
                // Reload completed tasks when review happens
                const completedData = await api.getCompletedToday(id);
                setCompletedToday(completedData);
                // Reload pending tasks (undo buttons will disappear for reviewed tasks)
                const pendingData = await api.getPendingTasks(id);
                setPendingTasks(pendingData);
            }
        });

        return () => {
            socket.off('transactionAdded');
            socket.off('transactionReviewed');
        };
    }, [socket, id]);

    const loadData = async () => {
        const [childData, assignments, rewardsData, completedData, pendingData] = await Promise.all([
            api.getChildren().then(children => children.find(c => c.id === parseInt(id))),
            api.getAssignments(id),
            api.getRewards(),
            api.getCompletedToday(id),
            api.getPendingTasks(id)
        ]);

        setChild(childData);
        setRewards(rewardsData);
        setCompletedToday(completedData);
        setPendingTasks(pendingData);

        const grouped = {
            morning: assignments.filter(a => a.category === 'morning'),
            afternoon: assignments.filter(a => a.category === 'afternoon'),
            evening: assignments.filter(a => a.category === 'evening'),
            other: assignments.filter(a => a.category === 'other')
        };
        setTasks(grouped);
    };

    const completeTask = async (task) => {
        // Check if task is once-per-day and already completed
        if (task.completion_type === 'once' && completedToday[task.id]) {
            showNotification(t('child.alreadyCompleted'), 'warning');
            return;
        }

        const transaction = await api.addTransaction({
            child_id: parseInt(id),
            action_type: 'task',
            amount: task.points,
            description: task.name,
            task_assignment_id: task.id
        });

        // Update local state
        if (task.completion_type === 'once') {
            setCompletedToday(prev => ({
                ...prev,
                [task.id]: 1
            }));
        }

        // Track this completion for undo (stays until reviewed by parent)
        setPendingTasks(prev => ({
            ...prev,
            [task.id]: transaction.id
        }));

        showNotification(t('child.taskCompleted', { points: task.points }), 'success');
    };

    const undoTaskCompletion = async (task) => {
        const transactionId = pendingTasks[task.id];
        if (!transactionId) return;

        try {
            await api.undoTransaction(transactionId);

            // Update local state
            if (task.completion_type === 'once') {
                setCompletedToday(prev => {
                    const updated = { ...prev };
                    delete updated[task.id];
                    return updated;
                });
            }

            // Remove from pending tasks
            setPendingTasks(prev => {
                const updated = { ...prev };
                delete updated[task.id];
                return updated;
            });

            showNotification(t('child.taskUndone'), 'info');
        } catch (error) {
            console.error('Failed to undo task:', error);
            showNotification(t('child.error'), 'error');
        }
    };

    const buyReward = async (reward) => {
        if (child.balance < reward.cost) {
            showNotification(t('child.notEnoughPoints'), 'error');
            return;
        }

        setConfirmDialog({
            isOpen: true,
            title: t('child.confirmPurchaseTitle'),
            message: t('child.confirmpurchase', { name: reward.name, cost: reward.cost }),
            onConfirm: async () => {
                await api.addTransaction({
                    child_id: parseInt(id),
                    action_type: 'reward',
                    amount: -reward.cost,
                    description: `${t('child.purchasePrefix')}${reward.name}`
                });
                showNotification(t('child.rewardPurchased', { name: reward.name }), 'success');
                setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
            }
        });
    };

    if (!child) return <div className="loading">{t('child.loading')}</div>;

    return (
        <div className="child-dashboard">
            {/* Top Bar */}
            <TopBar child={child} />

            {/* Main Content Area */}
            <div className="main-content">
                {/* View Toggle */}
                <ViewToggle view={view} onViewChange={setView} />

                {view === 'tasks' ? (
                    <TasksView
                        tasks={tasks}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        completedToday={completedToday}
                        pendingTasks={pendingTasks}
                        onCompleteTask={completeTask}
                        onUndoTask={undoTaskCompletion}
                    />
                ) : (
                    <RewardsView
                        rewards={rewards}
                        childBalance={child.balance}
                        onBuyReward={buyReward}
                    />
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isopen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setconfirmDialog({ isopen: false, title: '', message: '', onConfirm: null })}
                confirmText={t('modal.confirm')}
                cancelText={t('modal.cancel')}
            />
        </div>
    );
}

export default ChildDashboard;