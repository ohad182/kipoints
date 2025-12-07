import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ACTION_ICONS } from '../config/icons';
import ChildAvatar from './ChildAvatar';
import SettingsModal from './SettingsModal';
import { api } from '../api';
import './SideNav.css';

function SideNav({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [children, setChildren] = useState([]);
    const [childrenExpanded, setChildrenExpanded] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        loadChildren();
    }, []);

    const loadChildren = async () => {
        try {
            const data = await api.getChildren();
            setChildren(data);
        } catch (error) {
            console.error('Failed to load children:', error);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    const toggleChildren = () => {
        setChildrenExpanded(!childrenExpanded);
    };

    const isActive = (path) => {
        if (path === '/child') {
            return location.pathname === '/child';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {isOpen && <div className="sidenav-backdrop" onClick={onClose} />}
            <nav className={`sidenav ${isOpen ? 'open' : ''}`}>
                <div className="sidenav-header">
                    <div className="app-logo">
                        <span className="logo-icon">{ACTION_ICONS.star}</span>
                        <span className="logo-text">{t('appTitle')}</span>
                    </div>
                </div>

                <div className="sidenav-content">
                    <div className="sidenav-section">
                        <button 
                            className={`sidenav-item ${isActive('/child') ? 'active' : ''}`}
                            onClick={() => handleNavigate('/child')}
                        >
                            <span className="item-icon">{ACTION_ICONS.children}</span>
                            <span className="item-label">{t('sidenav.children')}</span>
                            <span 
                                className={`expand-icon ${childrenExpanded ? 'expanded' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleChildren();
                                }}
                            >
                                {ACTION_ICONS.chevronDown}
                            </span>
                        </button>

                        {childrenExpanded && children.length > 0 && (
                            <div className="sidenav-nested">
                                {children.map(child => (
                                    <button
                                        key={child.id}
                                        className={`sidenav-item nested ${isActive(`/child/${child.id}`) ? 'active' : ''}`}
                                        onClick={() => handleNavigate(`/child/${child.id}`)}
                                    >
                                        <ChildAvatar child={child} size="small" />
                                        <span className="item-label">{child.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="sidenav-divider"></div>

                    <div className="sidenav-section sidenav-footer">
                        <button 
                            className={`sidenav-item ${isActive('/parent') ? 'active' : ''}`}
                            onClick={() => handleNavigate('/parent')}
                        >
                            <span className="item-icon">{ACTION_ICONS.family}</span>
                            <span className="item-label">{t('sidenav.parentDashboard')}</span>
                        </button>
                        <button 
                            className="sidenav-item"
                            onClick={() => {
                                setShowSettings(true);
                                onClose();
                            }}
                        >
                            <span className="item-icon">{ACTION_ICONS.settings}</span>
                            <span className="item-label">{t('sidenav.settings')}</span>
                        </button>
                    </div>
                </div>
                <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
            </nav>
        </>
    );
}

export default SideNav;