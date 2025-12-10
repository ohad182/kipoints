import { useLanguage } from '../../../contexts/LanguageContext';
import CategorySection from './CategorySection';
import './DailySummaryModal.css';

function DailySummaryModal({ summary, onClose }) {
    const { t } = useLanguage();

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="daily-summary-modal-backdrop" onClick={handleBackdropClick}>
            <div className="daily-summary-modal">
                {/* Header */}
                <div className="daily-summary-header">
                    <h2>🎯 {t('dailySummary.title')}</h2>
                    <p className="daily-summary-date">
                        {new Date(summary.date).toLocaleDateString()}
                    </p>
                    <button
                        className="daily-summary-close"
                        onClick={onClose}
                        aria-label={t('modal.close')}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="daily-summary-body">
                    {/* Total Summary */}
                    <div className="daily-summary-total">
                        <div className="summary-stat">
                            <span className="stat-icon">⭐</span>
                            <span className="stat-value">{summary.totalPoints}</span>
                            <span className="stat-label">{t('dailySummary.starsEarned')}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-icon">✅</span>
                            <span className="stat-value">{summary.totalTasks}</span>
                            <span className="stat-label">{t('dailySummary.tasksDone')}</span>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="daily-summary-categories">
                        {summary.categories.length === 0 ? (
                            <div className="no-activity">
                                <p>{t('dailySummary.noActivity')}</p>
                            </div>
                        ) : (
                            summary.categories.map(category => (
                                <CategorySection
                                    key={category.name}
                                    category={category}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="daily-summary-footer">
                    <button
                        className="btn-close-modal"
                        onClick={onClose}
                    >
                        {t('modal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DailySummaryModal;
