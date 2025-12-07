import { useLanguage } from '../../../contexts/LanguageContext';
import { CHILD_ICONS } from '../../../config/icons';
import './ChildAvatar.css';

function ChildAvatar({ child }) {
    const { t } = useLanguage();

    return (
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
    );
}


export default ChildAvatar;