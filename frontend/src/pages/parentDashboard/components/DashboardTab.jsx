import { ACTION_ICONS, CHILD_ICONS } from '../../../config/icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import './DashboardTab.css';

function DashboardTab({ children, tasks, allAssignments, pendingTransactions, rewards, allTransactions, onAssignTask, onAddChild, onAddPenalty, onAdjustPoints, onEditChild, onDeleteChild }) {
    const { t } = useLanguage();

    return (
        <div className="dashboard-overview">
            {/* Stats Cards */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">{CHILD_ICONS.user}</div>
                    <div className="stat-value">{children.length}</div>
                    <div className="stat-label">{t('parent.stats.children')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">{ACTION_ICONS.task}</div>
                    <div className="stat-value">{tasks.length}</div>
                    <div className="stat-label">{t('parent.stats.tasks')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">{ACTION_ICONS.pending}</div>
                    <div className="stat-value">{pendingTransactions.length}</div>
                    <div className="stat-label">{t('parent.stats.pending')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">{ACTION_ICONS.reward}</div>
                    <div className="stat-value">{rewards.length}</div>
                    <div className="stat-label">{t('parent.stats.rewards')}</div>
                </div>
            </div>

            {/* Children Overview */}
            <div className="dashboard-section">
                <div className="setup-subsection-header">
                    <h3>{t('parent.childrenOverview')}</h3>
                    <button className="add-button" onClick={onAddChild}>
                        {t('parent.addChild')}
                    </button>
                </div>
                {children.length === 0 ? (
                    <p className="empty-message">{t('parent.emptyChildren')}</p>
                ) : (
                    <div className="children-overview-grid">
                        {children.map(child => {
                            const childAssignments = allAssignments.filter(a => a.child_id === child.id);
                            return (
                                <div key={child.id} className="child-overview-card">
                                    <div className="item-actions">
                                        <button
                                            className="item-action-btn edit"
                                            onClick={() => onEditChild(child)}
                                        >
                                            {ACTION_ICONS.edit}
                                        </button>
                                        <button
                                            className="item-action-btn delete"
                                            onClick={() => onDeleteChild(child.id)}
                                        >
                                            {ACTION_ICONS.delete}
                                        </button>
                                    </div>
                                    <div className="child-overview-icon">
                                        {child.image ? (
                                            child.image.startsWith('data:') || child.image.startsWith('http') ? (
                                                <img src={child.image} alt={child.name} />
                                            ) : (
                                                <span className="child-emoji">{child.image}</span>
                                            )
                                        ) : (
                                            ACTION_ICONS.info
                                        )}
                                    </div>
                                    <div className="child-overview-name">{child.name}</div>
                                    <div className="child-overview-balance">{child.balance} {ACTION_ICONS.bonus}</div>
                                    <div className="child-overview-tasks">
                                        {childAssignments.length} {t('parent.stats.activeTasks')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <button
                    className="add-button penalty-button"
                    onClick={onAddPenalty}
                    style={{ marginTop: '1rem' }}
                >
                    {t('parent.addPenalty')}
                </button>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h3>{t('parent.quickActions')}</h3>
                <div className="quick-actions">
                    <button
                        className="quick-action-btn assign-task"
                        onClick={onAssignTask}
                    >
                        {ACTION_ICONS.add} {t('parent.quickAction.assignTask')}
                    </button>
                    <button
                        className="quick-action-btn adjust-points"
                        onClick={onAdjustPoints}
                    >
                        {ACTION_ICONS.bonus} {t('parent.quickAction.adjustPoints')}
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-section">
                <h3>{t('parent.recentActivity')}</h3>
                {allTransactions.length === 0 ? (
                    <p className="empty-message">{t('parent.emptyHistory')}</p>
                ) : (
                    <div className="recent-activity-list">
                        {allTransactions.slice(0, 5).map(transaction => (
                            <div key={transaction.id} className="recent-activity-item">
                                <span className="activity-icon">
                                    {transaction.amount > 0 ? ACTION_ICONS.completed : ACTION_ICONS.reward}
                                </span>
                                <span className="activity-child">{transaction.child_name}</span>
                                <span className="activity-description">{transaction.description}</span>
                                <span className={`activity-points ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}{ACTION_ICONS.bonus}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardTab;
