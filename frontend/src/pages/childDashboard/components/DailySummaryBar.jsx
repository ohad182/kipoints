import { useState, useEffect } from 'react';
import { api } from '../../../api';
import { useLanguage } from '../../../contexts/LanguageContext';
import DailySummaryModal from './DailySummaryModal';
import CategorySection from './CategorySection';
import './DailySummaryBar.css';

function DailySummaryBar({ childId, onUpdate }) {
    const [summary, setSummary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState('popup');
    const { t } = useLanguage();

    useEffect(() => {
        loadSummary();
        // Load display mode preference
        const savedMode = localStorage.getItem('dailySummaryMode') || 'popup';
        setDisplayMode(savedMode);
    }, [childId]);

    // Update when parent notifies us (via onUpdate callback)
    useEffect(() => {
        if (onUpdate) {
            loadSummary();
        }
    }, [onUpdate]);

    const loadSummary = async () => {
        try {
            const data = await api.getDailySummary(childId);
            setSummary(data);
        } catch (error) {
            console.error('Failed to load daily summary:', error);
        }
    };

    if (!summary) return null;

    // Use actual max points from summary (sum of all available tasks for today)
    const maxPoints = summary.maxPoints || summary.totalPoints || 1;
    const progress = summary.totalPoints > 0 ? (summary.totalPoints / maxPoints) * 100 : 0;

    // Fun messages based on progress
    const getProgressMessage = () => {
        if (summary.totalPoints === 0) return '🌟';
        if (progress >= 100) return '🎉';
        if (progress >= 75) return '🌟';
        if (progress >= 50) return '⭐';
        return '✨';
    };

    // Popup mode: show full-width bar + modal
    if (displayMode === 'popup') {
        return (
            <>
                <div className="daily-summary-bar" onClick={() => setIsModalOpen(true)}>
                    <div className="daily-summary-content">
                        <span className="daily-summary-text">
                            {getProgressMessage()} {t('dailySummary.today')}: {summary.totalPoints} ⭐
                        </span>

                        <div className="daily-progress-bar">
                            <div
                                className="daily-progress-fill"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>

                        <span className="daily-summary-action">
                            👆 {t('dailySummary.clickToSee')}
                        </span>
                    </div>
                </div>

                {isModalOpen && (
                    <DailySummaryModal
                        summary={summary}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </>
        );
    }

    // Drawer mode: show centered drawer with all content
    return (
        <div className={`daily-summary-drawer ${isDrawerOpen ? 'open' : ''}`}>
            {/* Handle Always visible */}
            <div className="drawer-handle" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                <div className="handle-bar"></div>
                <div className="drawer-handle-content">
                    <span className="drawer-title-text">
                        {getProgressMessage()} {t('dailySummary.today')}: {summary.totalPoints} ⭐
                    </span>
                    <div className="drawer-progress-bar">
                        <div
                            className="drawer-progress-fill"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    <span className="drawer-toggle-icon">{isDrawerOpen ? '▼' : '▲'}</span>
                </div>
            </div>

            {/* Content - Slides up when open */}
            <div className="drawer-content">
                {/* Date */}
                <p className="drawer-date">
                    {new Date(summary.date).toLocaleDateString()}
                </p>

                {/* Total Summary */}
                <div className="drawer-summary-total">
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
                <div className="drawer-categories">
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
        </div>
    );
}

export default DailySummaryBar;
