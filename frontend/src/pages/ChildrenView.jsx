import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useSocket } from '../SocketContext';
import { useLanguage } from '../contexts/LanguageContext';
import './ChildrenView.css';

function ChildrenView() {
    const [children, setChildren] = useState([]);
    const navigate = useNavigate();
    const { socket } = useSocket();
    const { t } = useLanguage();

    useEffect(() => {
        loadChildren();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('childAdded', (child) => {
            setChildren(prev => [...prev, child]);
        });

        return () => {
            socket.off('childAdded');
        };
    }, [socket]);

    const loadChildren = async () => {
        const data = await api.getChildren();
        setChildren(data);
    };

    return (
        <div className="children-view">
            <button className="back-button" onClick={() => navigate('/')}>{t('child.back')}</button>
            <h1>{t('child.selectChild')}</h1>
            <div className="children-grid">
                {children.map(child => (
                    <div
                        key={child.id}
                        className="child-card"
                        onClick={() => navigate(`/child/${child.id}`)}
                    >
                        <div className="child-avatar">
                            {child.image ? (
                                child.image.startsWith('data:') || child.image.startsWith('http') ? (
                                    <img src={child.image} alt={child.name} />
                                ) : (
                                    <span className="emoji-avatar">{child.image}</span>
                                )
                            ) : (
                                <span className="default-avatar">👤</span>
                            )}
                        </div>
                        <h2>{child.name}</h2>
                        <div className="child-balance">{child.balance} {t('child.points')} </div>
                    </div>
                ))}
            </div>
            {children.length === 0 && (
                <p className="no-children">{t('child.noChildren')}</p>
            )}
        </div>
    );
}

export default ChildrenView;