import { useEffect } from 'react';
import './Confetti.css';

const Confetti = ({ duration = 3000, count = 50, onComplete }) => {
    useEffect(() => {
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32', '#9370DB'];
        const shapes = ['star', 'circle', 'square'];
        const confettiElements = [];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            confettiElements.push(confetti);
        }

        const timer = setTimeout(() => {
            confettiElements.forEach(el => el.remove());
            if (onComplete) onComplete();
        }, duration + 2000);

        return () => {
            clearTimeout(timer);
            confettiElements.forEach(el => el.remove());
        };
    }, [count, duration, onComplete]);

    return null;
};

export default Confetti;