import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useSocket } from '../SocketContext';
import './ChildrenView.css';

function ChildrenView() {
    const [children, setChildren] = useState([]);
    const navigate = useNavigate();
    const { socket } = useSocket();

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
            <button className="back-button" onClick={() => navigate('/')}>← חזור הביתה</button>

            <h1>בחר ילד</h1>
            <div className="children-grid">
                {children.map(child => (
                    <div
                        key={child.id}
                        className="child-card"
                        onClick={() => navigate(`/child/${child.id}`)}
                    >
                        <div className="child-avatar">
                            {child.image ? (
                                <img src={child.image} alt={child.name} />
                            ) : (
                                <span className="default-avatar">👤</span>
                            )}
                        </div>
                        <h2>{child.name}</h2>
                        <div className="child-balance">{child.balance} נקודות </div>
                    </div>
                ))}
            </div>
            {children.length === 0 && (
                <p className="no-children">אין ילדים במערכת. הורה צריך להוסיף ילדים תחילה.</p>
            )}
        </div>
    );
}

export default ChildrenView;