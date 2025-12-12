import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { renderImage, CATEGORY_ICONS, ACTION_ICONS } from '../../../config/icons';
import { Confetti, FloatingEmojis, Fireworks, FallingEmoji, FlyingEmoji } from '../../../components/celebrations';
import './TasksView.css';

function TasksView({
    tasks,
    activeCategory,
    onCategoryChange,
    completedToday,
    pendingTasks,
    onCompleteTask,
    onUndoTask,
    childImage
}) {
    const { t } = useLanguage();
    const [celebration, setCelebration] = useState(null);

    const categories = [
        { id: 'morning', icon: CATEGORY_ICONS.morning, label: t('categories.morning'), time: '5:00 AM - 11:59 AM' },
        { id: 'afternoon', icon: CATEGORY_ICONS.afternoon, label: t('categories.afternoon'), time: '12:00 PM - 5:59 PM' },
        { id: 'evening', icon: CATEGORY_ICONS.evening, label: t('categories.evening'), time: '6:00 PM - 9:59 PM' },
        { id: 'other', icon: CATEGORY_ICONS.other, label: t('categories.other'), time: t('categories.otherTime') }
    ];

    const currentTasks = tasks[activeCategory] || [];

    // Check for category completion
    useEffect(() => {
        if (!currentTasks.length) return;

        const completedCount = currentTasks.filter(task =>
            task.completion_type === 'once' && completedToday[task.id]
        ).length;

        // Only trigger celebration if all tasks in category are completed
        if (completedCount === currentTasks.length && completedCount > 0 && !celebration) {
            // setCelebration('emojis'); // or 'confetti' or 'emojis' based on preference
            const celebrations = {
                morning: 'emojis',
                afternoon: 'confetti',
                evening: 'falling',
                other: 'flying'
            };
            //setCelebration(celebrations[activeCategory] || 'confetti');
            // setCelebration('falling');
            setCelebration('flying');
        }
    }, [completedToday, activeCategory, currentTasks, celebration]);

    return (
        <div className="tasks-view">
            {/* Category Tabs */}
            <div className="category-tabs">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat.id)}
                        title={cat.time}
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
                                        title={task.name}
                                    >
                                        <div className="task-card-content">
                                            <div className="task-icon-large">
                                                {renderImage(task.image, ACTION_ICONS.task, '3em')}
                                            </div>
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

            {/* Celebrations */}
            {celebration === 'confetti' && (
                <Confetti onComplete={() => setCelebration(null)} />
            )}
            {celebration === 'emojis' && (
                <FloatingEmojis category={activeCategory} onComplete={() => setCelebration(null)} />
            )}
            {celebration === 'fireworks' && (
                <Fireworks onComplete={() => setCelebration(null)} />
            )}
            {celebration === 'falling' && (
                <FallingEmoji emoji={childImage} onComplete={() => setCelebration(null)} />
            )}
            {celebration === 'flying' && (
                <FlyingEmoji emoji={childImage} onComplete={() => setCelebration(null)} />
            )}
        </div>
    );
}

export default TasksView;