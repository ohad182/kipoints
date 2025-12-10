import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import LanguageSelector from './LanguageSelector';
import './Modal.css';

function SettingsModal({ isOpen, onClose }) {
    const { t } = useLanguage();
    const [backendUrl, setBackendUrl] = useState('');
    const [dailySummaryMode, setDailySummaryMode] = useState('popup');

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        const savedUrl = localStorage.getItem('backendUrl') || 'http://localhost:3000';
        const savedMode = localStorage.getItem('dailySummaryMode') || 'popup';
        setBackendUrl(savedUrl);
        setDailySummaryMode(savedMode);
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('backendUrl', backendUrl);
        localStorage.setItem('dailySummaryMode', dailySummaryMode);
        alert(t('settings.saved', { default: 'Settings saved! Please refresh the page for changes to take effect.' }));
        onClose();
    };

    const handleReset = () => {
        setBackendUrl('http://localhost:3000');
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header" >
                    <h2>⚙ {t('settings.title', { default: 'Settings' })}</h2>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('settings.language', { default: 'Language' })}</label>
                        <LanguageSelector />
                    </div>

                    <div className="form-group">
                        <label>{t('settings.dailySummaryMode', { default: 'Daily Summary Display' })}</label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="dailySummaryMode"
                                    value="popup"
                                    checked={dailySummaryMode === 'popup'}
                                    onChange={(e) => setDailySummaryMode(e.target.value)}
                                />
                                {t('settings.dailySummaryModePopup', { default: '📱 Modal Popup' })}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="dailySummaryMode"
                                    value="drawer"
                                    checked={dailySummaryMode === 'drawer'}
                                    onChange={(e) => setDailySummaryMode(e.target.value)}
                                />
                                {t('settings.dailySummaryModeDrawer', { default: '📊 Bottom Drawer' })}
                            </label>
                        </div>
                    </div>

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