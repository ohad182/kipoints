import { useLanguage } from '../../../contexts/LanguageContext';
import { ACTION_ICONS } from '../../../config/icons';
import ChildAvatar from '../../../components/ChildAvatar';
import './TopBar.css';

function TopBar({ child, allChildren, onSwitchChild }) {
    const { t } = useLanguage();

    // Filter out the current child from the list
    const otherChildren = allChildren?.filter(c => c.id !== child.id) || [];

    return (
        <div className="top-bar">
            {otherChildren.length > 0 && (
                <div className="other-children">
                    {otherChildren.map(otherChild => (
                        <ChildAvatar
                            key={otherChild.id}
                            child={otherChild}
                            size="small"
                            onClick={() => onSwitchChild(otherChild.id)}
                        />
                    ))}
                </div>
            )}
            <div className="child-info">
                <ChildAvatar 
                    child={child} 
                    size="medium"
                    className="current-child-avatar"
                />
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