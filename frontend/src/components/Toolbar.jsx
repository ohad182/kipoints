import { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import SettingsModal from './SettingsModal';
import { useLanguage } from '../contexts/LanguageContext';
import './Toolbar.css';

function Toolbar() {
    const { t } = useLanguage();
    const [showSettings, setShowSettings] = useState(false);

    return(
        <>
          <div className="toolbar">
            <div className="toolbar-left">
                <h1 className="toolbar-title">{t('appTitle')}</h1>
            </div>
            <div className="toolbar-right">
                <LanguageSelector />
                <button className="toolbar-button" onClick={() => setShowSettings(true)} title={t('settings.title')}>
                    ⚙
                </button>
            </div>
          </div>
          <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
}

export default Toolbar;