import { ACTION_ICONS } from '../config/icons';
import './ChildAvatar.css';

function ChildAvatar({ child, size = 'medium', onClick, className = '' }) {
    const sizeClass = `child-avatar-${size}`;
    const combinedClassName = `child-avatar ${sizeClass} ${className}`;

    const renderImage = () => {
        if (child.image) {
            // Check if it's a URL (uploaded image) or emoji
            if (child.image.startsWith('http') || child.image.startsWith('data:')) {
                return <img src={child.image} alt={child.name} />;
            } else {
                // It's an emoji
                return <span className="emoji-avatar">{child.image}</span>;
            }
        }
        // Default avatar
        return <span className="default-avatar">{ACTION_ICONS.child}</span>;
    };

    return (
        <div 
            className={combinedClassName}
            onClick={onClick}
            title={child.name}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {renderImage()}
        </div>
    );
}

export default ChildAvatar;
