import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ACTION_ICONS } from '../../../config/icons';
import './TopBar.css';

function TopBar({ child }) {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="top-bar">
            <button className="back-button" onClick={() => navigate('/child')}>
                {t('child.back')}
            </button>
            <div className="child-name">{child.name}</div>
            <div className="balance-chip">
                <span className="balance-icon">{ACTION_ICONS.bonus}</span>
                <span className="balance-value">{child.balance}</span>
            </div>
        </div>
    );
}

export default TopBar;