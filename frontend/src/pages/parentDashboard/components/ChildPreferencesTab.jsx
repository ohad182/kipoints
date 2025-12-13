import React from 'react';
import { ACTION_ICONS } from '../../../config/icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import './ChildPreferencesTab.css';

function ChildPreferencesTab({ children, onEditChildPrefs }) {
    const { t } = useLanguage();

    return (
        <>
            <div className="setup-subsection-header">
                <h3>{ACTION_ICONS.settings} {t('parent.setup.childPreferences')}</h3>
            </div>
            {children.length === 0 ? (
                <p className="empty-message">{t('parent.emptyChildren')}</p>
            ) : (
                <div className="children-list">
                    {children.map(child => (
                        <div key={child.id} className="child-preference-item">
                            <span>{child.name}</span>
                            <button className="edit-button" onClick={() => onEditChildPrefs(child)}>
                                {ACTION_ICONS.edit} {t('buttons.edit')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default ChildPreferencesTab;
