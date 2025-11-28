import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useSocket } from "../SocketContext";
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
        }
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
                {children.length > 0 ? (
                    children.map(child => (
                        <div
                            key={child.id}
                            className="child-card"
                            onClick={() => handleChildClick(child.id)}
                        >
                            <div className="child-avatar">
                                {child.image ? (
                                    <img src={child.image} alt={child.name} />
                                ) : (
                                    <span className="default-avatar">👤</span>
                                )}
                            </div>
                            <div className="child-info">
                                <h2>{child.name}</h2>
                                <div className="child-balance">
                                    <span className="balance-label">נקודות:</span>
                                    <span className="balance-value">{child.balance}</span>
                                </div>
                            </div>
                            <div className="child-arrow">→</div>
                        </div>
                    ))
                ) : (
                    <div className="no-children">
                        <p>אין ילדים זמינים</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChildrenView;