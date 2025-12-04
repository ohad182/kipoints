import { useLanguage } from '../../../contexts/LanguageContext';
import { CATEGORY_ICONS, ACTION_ICONS } from '../../../config/icons';
import './TasksView.css';

function TasksView({ 
    tasks, 
    activeCategory, 
    onCategoryChange, 
    completedToday, 
    pendingTasks, 
    onCompleteTask, 
    onUndoTask 
}) {
    const { t } = useLanguage();

    const categories = [
        { id: 'morning', icon: CATEGORY_ICONS.morning, label: t('categories.morning') },
        { id: 'afternoon', icon: CATEGORY_ICONS.afternoon, label: t('categories.afternoon') },
        { id: 'evening', icon: CATEGORY_ICONS.evening, label: t('categories.evening') },
        { id: 'other', icon: CATEGORY_ICONS.other, label: t('categories.other') }
    ];

    const currentTasks = tasks[activeCategory] || [];

    return (
        <div className="tasks-view">
            {/* Category Tabs */}
            <div className="category-tabs">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat.id)}
                    >
                        <span className="tab-icon">{cat.icon}</span>
                        <span className="tab-label">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Tasks Grid */}
            <div className="tasks-container">
                {currentTasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">{ACTION_ICONS.smile}</div>
                        <div className="empty-text">{t('child.noTasks')}</div>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {currentTasks.map(task => {
                            const isCompleted = task.completion_type === 'once' && completedToday[task.id];
                            const canUndo = pendingTasks[task.id]; // Show undo if task has pending transaction
                            return (
                                <div key={task.id} className="task-card-wrapper">
                                    <button
                                        className={`task-card ${isCompleted ? 'completed' : ''}`}
                                        onClick={() => onCompleteTask(task)}
                                        disabled={isCompleted}
                                    >
                                        <div className="task-card-content">
                                            <div className="task-icon-large">{task.icon || ACTION_ICONS.task}</div>
                                            <div className="task-name">{task.name}</div>
                                            {isCompleted ? (
                                                <div className="completed-badge">{ACTION_ICONS.completed}</div>
                                            ) : (
                                                <div className="task-points">+{task.points}  {ACTION_ICONS.bonus}</div>
                                            )}
                                        </div>
                                    </button>
                                    {canUndo && (
                                        <button 
                                            className="undo-button"
                                            onClick={() => onUndoTask(task)}
                                        >
                                            {t('child.undo')}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TasksView;