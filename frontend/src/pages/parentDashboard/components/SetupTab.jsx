import { renderImage, ACTION_ICONS } from '../../../config/icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import ChildPreferencesTab from './ChildPreferencesTab';
import './SetupTab.css';

function SetupTab({
    children,
    tasks,
    rewards,
    allAssignments,
    selectedTasks,
    onEditTask,
    onDeleteTask,
    onAddTask,
    onAssignTask,
    onToggleTaskSelection,
    onClearSelection,
    onDeleteAssignment,
    onEditReward,
    onDeleteReward,
    onAddReward,
    onSavePreferences,
    onEditChildPrefs
}) {
    const { t } = useLanguage();

    return (
        <div className="setup-section">
            {/* Child Preferences Section */}
            <div className="setup-subsection">
                <ChildPreferencesTab
                    children={children}
                    onSavePreferences={onSavePreferences}
                    onEditChildPrefs={onEditChildPrefs}
                />
            </div>

            {/* Tasks Section */}
            <div className="setup-subsection">
                <div className="setup-subsection-header">
                    <h3>{ACTION_ICONS.task} {t('parent.setup.taskLibrary')}</h3>
                    <div className="tasks-header-buttons">
                        <button className="add-button" onClick={onAddTask}>
                            {t('parent.addTask')}
                        </button>
                        <button className="add-button" onClick={onAssignTask}>
                            {t('parent.assignTask')}
                        </button>
                        {selectedTasks.length > 0 && (
                            <>
                                <button className="add-button assign-selected-button" onClick={onAssignTask}>
                                    {t('parent.assignSelected')} ({selectedTasks.length})
                                </button>
                                <button className="add-button clear-selection-button" onClick={onClearSelection}>
                                    {t('parent.clearSelection')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {tasks.length === 0 ? (
                    <p className="empty-message">{t('parent.emptyTasks')}</p>
                ) : (
                    <div className="tasks-with-assignments">
                        {tasks.map(task => {
                            const taskAssignments = allAssignments.filter(a => a.task_id === task.id);
                            return (
                                <div key={task.id} className="task-library-item">
                                    <div
                                        className={`task-library-card ${selectedTasks.includes(task.id) ? 'selected' : ''}`}
                                        onClick={() => onToggleTaskSelection(task.id)}
                                    >
                                        <div className="task-library-main">
                                            {selectedTasks.includes(task.id) && (
                                                <div className="selection-checkbox">{ACTION_ICONS.task}</div>
                                            )}
                                            <div className="task-library-icon">
                                                {renderImage(task.image, ACTION_ICONS.task, '2em')}
                                            </div>
                                            <div className="task-library-info">
                                                <div className="task-library-name">{task.name}</div>
                                                <div className="task-library-meta">
                                                    {t(`categories.${task.category}`)}
                                                    {' • '}
                                                    {t(`completionType.${task.completion_type}`)}
                                                </div>
                                            </div>
                                            <div className="task-library-actions">
                                                <button
                                                    className="item-action-btn edit"
                                                    onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
                                                >
                                                    {ACTION_ICONS.edit}
                                                </button>
                                                <button
                                                    className="item-action-btn delete"
                                                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                                >
                                                    {ACTION_ICONS.delete}
                                                </button>
                                            </div>
                                        </div>
                                        {taskAssignments.length > 0 && (
                                            <div className="task-assignments-inline">
                                                <span className="assignments-label">{t('parent.setup.assignedTo')}:</span>
                                                {taskAssignments.map((assignment) => (
                                                    <span key={assignment.id} className="assignment-badge">
                                                        {assignment.child_name} ({assignment.points}{ACTION_ICONS.bonus})
                                                        <button
                                                            className="assignment-badge-delete"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteAssignment(assignment.id);
                                                            }}
                                                            title={t('buttons.deleteAssignment')}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Rewards Section */}
            <div className="setup-subsection">
                <div className="setup-subsection-header">
                    <h3>{ACTION_ICONS.reward} {t('parent.tabs.rewards')}</h3>
                    <button className="add-button" onClick={onAddReward}>
                        {t('parent.addReward')}
                    </button>
                </div>
                {rewards.length === 0 ? (
                    <p className="empty-message">{t('parent.emptyRewards')}</p>
                ) : (
                    <div className="items-grid">
                        {rewards.map(reward => (
                            <div key={reward.id} className="item-card">
                                <div className="item-actions">
                                    <button
                                        className="item-action-btn edit"
                                        onClick={() => onEditReward(reward)}
                                    >
                                        {ACTION_ICONS.edit}
                                    </button>
                                    <button
                                        className="item-action-btn delete"
                                        onClick={() => onDeleteReward(reward.id)}
                                    >
                                        {ACTION_ICONS.delete}
                                    </button>
                                </div>
                                <div className="item-icon">
                                    {renderImage(reward.icon || reward.image, ACTION_ICONS.reward, '2em')}
                                </div>
                                <div className="item-name">{reward.name}</div>
                                <div className="item-info">{reward.cost} {t('parent.points')}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SetupTab;