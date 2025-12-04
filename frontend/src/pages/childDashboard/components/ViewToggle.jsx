import { useLanguage } from '../../../contexts/LanguageContext';
import { ACTION_ICONS } from '../../../config/icons';
import './ViewToggle.css';

function ViewToggle({ view, onViewChange }) {
    const { t } = useLanguage();

    return (
        <div className="view-toggle">
            <button
                className={`toggle-btn ${view === 'tasks' ? 'active' : ''}`}
                onClick={() => onViewChange('tasks')}
            >
                {ACTION_ICONS.task} {t('child.myTasks')}
            </button>
            <button
                className={`toggle-btn ${view === 'rewards' ? 'active' : ''}`}
                onClick={() => onViewChange('rewards')}
            >
                {ACTION_ICONS.reward} {t('child.rewards')}
            </button>
        </div>
    );
}

export default ViewToggle;