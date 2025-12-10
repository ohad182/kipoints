import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { renderImage, ACTION_ICONS } from '../../../config/icons';
import './CategorySection.css';

function CategorySection({ category }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { t } = useLanguage();

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="category-section" >
            <div
                className="category-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="category-info">
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">
                        {t(`categories.${category.name}`)}
                    </span>
                    <span className="category-badge">
                        ⏳ {category.taskCount} {t('dailySummary.tasks')}
                    </span>
                </div>

                <div className="category-points">
                    <span className="points-value">{category.points} ⭐</span>
                    <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
                        ▼
                    </span>
                </div>
            </div>

            {isExpanded && (
                <div className="category-tasks">
                    {category.tasks.map(task => (
                        <div key={task.transactionId} className="task-item">
                            <div className="task-info">
                                <div className="task-icon">
                                    {renderImage(task.image, ACTION_ICONS.task, '1.5em')}
                                </div>
                                <div className="task-details">
                                    <span className="task-name">{task.name}</span>
                                    <span className="task-time">{formatTime(task.completedAt)}</span>
                                </div>
                            </div>
                            <div className="task-status">
                                <span className="task-points">+{task.points}</span>
                                {task.isReviewed ? (
                                    <span className="status-badge reviewed">✓</span>
                                ) : (
                                    <span className="status-badge pending">⏳</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategorySection;
