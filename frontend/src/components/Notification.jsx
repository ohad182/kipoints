import { useEffect } from 'react';
import { ACTION_ICONS } from '../config/icons';
import './Notification.css';

function Notification({ message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return ACTION_ICONS.success;
            case 'error': return ACTION_ICONS.error;
            case 'warning': return ACTION_ICONS.warning;
            case 'info': return ACTION_ICONS.info;
            default: return ACTION_ICONS.info;
        }
    };

    return (
        <div className={`notification ${type}`}>
            <div className="notification-content">
                <span className="notification-icon">
                    {getIcon()}
                </span>
                <span className="notification-message">{message}</span>
            </div>
            <button className="notification-close" onClick={onClose}>x</button>
        </div>
    );
}

export default Notification;