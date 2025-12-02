import { ACTION_ICONS } from '../config/icons';
import './ConfirmDialog.css';

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-icon">{ACTION_ICONS.warning}</div>
                {title && <div className="confirm-title">{title}</div>}
                <div className="confirm-message">{message}</div>
                <div className="confirm-actions">
                    <button className="confirm-button cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="confirm-button confirm" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;