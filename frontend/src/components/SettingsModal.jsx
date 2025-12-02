import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './Modal.css';

function SettingsModal({ isOpen, onClose }) {
    const { t } = useLanguage();
    const [backendUrl, setBackendUrl] = useState('');

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        const savedUrl = localStorage.getItem('backendUrl') || 'http://localhost:3000';
        setBackendUrl(savedUrl);
    }, [isOpen]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('backendUrl', backendurl);
        alert(t('settings.saved', { default: 'Settings saved! Please refresh the page for changes to take effect.' }));
        onClose();
    };

    const handleReset = () => {
        setBackendUrl('http://localhost:3000');
    };

    if (!isOpen)  return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header" >
                    <h2>⚙ {t('settings.title', { default: 'Settings' })}</h2>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('settings.backendUrl', { default: 'Backend Server URL' })}</label>
                        <input
                            type="text"
                            value={backendUrl}
                            onChange={(e) => setBackendUrl(e.target.value)}
                            placeholder="http://localhost:3000"
                            required
                        />
                        <small style={{ color: '#666', fontsize: '12px', marginTop: '5px', display: 'block' }}>
                            {t('settings.backendHelp', { default: 'Enter the URL of your backend server (e.g., http://192.168.1.100:3000)' })}

                        </small>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="modal-button secondary" onClick={handleReset}>
                            {t('settings.reset', { default: 'Reset to Default' })}
                        </button>
                        <button type="button" className="modal-button secondary" onClick={onClose}>
                            {t('modal.cancel')}
                        </button>
                        <button type="submit" className="modal-button primary">
                            {t('modal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
export default SettingsModal;