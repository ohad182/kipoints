import { useState } from 'react';
import SideNav from './SideNav';
import { useLanguage } from '../contexts/LanguageContext';
import './Toolbar.css';

function Toolbar() {
    const { t } = useLanguage();
    const [sideNavOpen, setSideNavOpen] = useState(false);

    return (
        <>
            <div className="toolbar">
                <div className="toolbar-left">
                    <button
                        className={`hamburger-button ${sideNavOpen ? 'open' : ''}`}
                        onClick={() => setSideNavOpen(!sideNavOpen)}
                        aria-label={sideNavOpen ? t('sidenav.close') : t('sidenav.open')}
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                    <h1 className="toolbar-title">{t('appTitle')}</h1>
                </div>
            </div>
            <SideNav isOpen={sideNavOpen} onClose={() => setSideNavOpen(false)} />
        </>
    );
}

export default Toolbar;