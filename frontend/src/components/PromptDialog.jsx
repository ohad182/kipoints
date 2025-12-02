import { usestate } from 'react';
import './PromptDialog.css';

function PromptDialog({ message, defaultValue = '', onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }) {
    const [value, setValue] = usestate(defaultvalue);

    const handlesubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onConfirm(value);
        }
    };

    return (
        <div className="prompt-overlay" onClick={onCancel}>
            <div className="prompt-dialog" onclick={(e) => e.stopPropagation()}>
                <div className="prompt-message" > {message}</div >
                <form onSubmit={handleSubmit} >
                    <input
                        type="number"
                        className="prompt-input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                        min="1"
                        required
                    />
                    <div className="prompt-actions">
                        < button type="button" className="prompt-button cancel" onClick={onCancel}>
                            {cancelText}
                        </button>
                        <button type="submit" className="prompt-button confirm" disabled={!value.trim()}>
                            {confirmText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
    
export default PromptDialog;