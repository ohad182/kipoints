import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import './Modal.css';

const ANIMATION_OPTIONS = ['None', 'Confetti', 'Fireworks', 'FallingEmoji', 'FloatingEmojis', 'FlyingEmoji'];

function ChildPreferencesModal({ isOpen, onClose, onSave, child }) {
    const { t } = useLanguage();
    const [preferences, setPreferences] = useState({});

    useEscapeKey(isOpen, onClose);

    useEffect(() => {
        if (child) {
            // Initialize state with the child's current preferences or defaults
            setPreferences({
                morning_animation: child.preferences?.morning_animation || 'FallingEmoji',
                morning_emoji: child.preferences?.morning_emoji || '🐘',
                afternoon_animation: child.preferences?.afternoon_animation || 'FallingEmoji',
                afternoon_emoji: child.preferences?.afternoon_emoji || '🐘',
                evening_animation: child.preferences?.evening_animation || 'FlyingEmoji',
                evening_emoji: child.preferences?.evening_emoji || '🚀',
                other_animation: child.preferences?.other_animation || 'FlyingEmoji',
                other_emoji: child.preferences?.other_emoji || '⭐',
            });
        }
    }, [child]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(child.id, preferences);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    const renderPreferenceInput = (category) => (
        <div className="preference-category" key={category}>
            <h4>{t(`categories.${category}`)}</h4>
            <div className="form-group">
                <label>{t('parent.setup.animation')}</label>
                <select
                    name={`${category}_animation`}
                    value={preferences[`${category}_animation`] || ''}
                    onChange={handleChange}
                >
                    {ANIMATION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>{t('parent.setup.emoji')}</label>
                <input
                    type="text"
                    name={`${category}_emoji`}
                    value={preferences[`${category}_emoji`] || ''}
                    onChange={handleChange}
                    maxLength="2"
                />
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('parent.setup.editPreferencesFor', { name: child.name })}</h2>
                    <button onClick={onClose} className="modal-close">&times;</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="preferences-grid">
                        {['morning', 'afternoon', 'evening', 'other'].map(renderPreferenceInput)}
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="modal-button secondary" onClick={onClose}>{t('buttons.cancel')}</button>
                        <button type="submit" className="modal-button primary">{t('buttons.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChildPreferencesModal;
