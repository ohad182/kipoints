import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ACTION_ICONS, CHILD_ICONS } from '../../../config/icons';
import './TopBar.css';

function TopBar({ child }) {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="top-bar">
            <button className="back-button" onClick={() => navigate('/child')}>
                {t('child.back')}
            </button>
            <div className="child-info">
                <div className="child-avatar-small">
                    {child.image ? (
                        child.image.startsWith('data:') || child.image.startsWith('http') ? (
                            <img src={child.image} alt={child.name} />
                        ) : (
                            <span className="emoji-avatar">{child.image}</span>
                        )
                    ) : (
                        <span className="default-avatar">{CHILD_ICONS.user}</span>
                    )}
                </div>
                <div className="child-name">{child.name}</div>
            </div>
            <div className="balance-chip">
                <span className="balance-icon">{ACTION_ICONS.bonus}</span>
                <span className="balance-value">{child.balance}</span>
            </div>
        </div>
    );
}

export default TopBar;