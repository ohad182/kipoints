import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useSocket } from "../SocketContext";
import './ChildDashboard.css';

function ChildDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [child, setChild] = useState(null);
    const [tasks, setTasks] = useState({ morning: [], afternoon: [], evening: [], other: [] });
    const [rewards, setRewards] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        socket.on('transactionAdded', (data) => {
            if (data.child.id === parseInt(id)) {
                setChild(data.child);
            }
        });

        socket.on('transactionReviewed', (data) => {
            if (data.child.id === parseInt(id)) {
                setChild(data.child);
            }
        });

        return () => {
            socket.off('transactionAdded');
            socket.off('transactionReviewed');
        };
    }, [socket, id]);

    const loadData = async () => {
        const [childData, assignments, rewardsData] = await Promise.all([
            api.getChildren().then(children => children.find(c => c.id === parseInt(id))),
            api.getAssignments(id),
            api.getRewards()
        ]);

        setChild(childData);
        setRewards(rewardsData);

        const grouped = {
            morning: assignments.filter(a => a.category === 'morning'),
            afternoon: assignments.filter(a => a.category === 'afternoon'),
            evening: assignments.filter(a => a.category === 'evening'),
            other: assignments.filter(a => a.category === 'other')
        };
        setTasks(grouped);
    };

    const completeTask = async (task) => {
        await api.addTransaction({
            child_id: parseInt(id),
            action_type: 'task',
            amount: task.points,
            description: task.name
        });
    };

    const buyReward = async (reward) => {
        if (child.balance < reward.cost) {
            alert("אין מספיק נקודות לרכוש את הפרס הזה.");
            return;
        }

        if(confirm(`האם אתה בטוח שברצונך לרכוש את הפרס "${reward.name}" ב-${reward.cost} נקודות?`)) {
            await api.addTransaction({
                child_id: parseInt(id),
                action_type: 'reward',
                amount: -reward.cost,
                description: ` קנייה:${reward.name}`
            });
        }
    };

    if (!child) return <div className="loading">טוען...</div>;

    return (
        <div className="child-dashboard">
            <button className="back-button" onClick={() => navigate('/child')}>← חזרה</button>

            <div className="dashboard-header">
                <h1>שלום {child.name}!</h1>
                <div className="balance-display">
                    <span className="balance-label">היתרה שלך:</span>
                    <span className="balance-amount">{child.balance}</span>
                    <span className="balance-label">נקודות</span>
                </div>
            </div>

            <div className="tasks-section">
                <h2>משימות זמינות</h2>
                {['morning', 'afternoon', 'evening', 'other'].map(category => (
                    <div key={category} className="task-category">
                        <h3>
                            {category === 'morning' && 'בוקר' }
                             {category === 'afternoon' && 'צהריים'}
                             {category === 'evening' && 'ערב'}
                             {category === 'other' && 'אחר'}
                        </h3>
                        <div className="tasks-grid">
                            {tasks[category].map(task => (
                                    <div key={task.id} className="task-card" onClick={() => completeTask(task)}>
                                        <div className="task-icon">{task.icon || '✔'}</div>
                                        <div className="task-name">{task.name}</div>
                                        <div className="task-points">+{task.points} נקודות</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="rewards-section">
                <h2>פרסים לרכישה</h2>
                <div className="rewards-grid">
                    {rewards.map(reward => (
                        <div key={reward.id} className={`reward-card ${child.balance < reward.cost ? 'disabled' : ''}`} onClick={() => buyReward(reward)}>
                            <div className="reward-image">{reward.image || '🎁'}</div>
                            <div className="reward-name">{reward.name}</div>
                            <div className="reward-cost">{reward.cost} נקודות</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default ChildDashboard;