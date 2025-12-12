import { useEffect } from 'react';
import './Fireworks.css';

const Fireworks = ({ duration = 2000, count = 5, onComplete }) => {
    useEffect(() => {
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB']; //, '#32CD32'
        const fireworkElements = [];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = (20 + Math.random() * 60) + '%';
                firework.style.top = (20 + Math.random() * 40) + '%';
                firework.style.color = colors[Math.floor(Math.random() * colors.length)];
                document.body.appendChild(firework);
                fireworkElements.push(firework);

                setTimeout(() => firework.remove(), 1500);
            }, i * 300);
        }

        const timer = setTimeout(() => {
            fireworkElements.forEach(el => el.remove());
            if (onComplete) onComplete();
        }, duration + 1500);

        return () => {
            clearTimeout(timer);
            fireworkElements.forEach(el => el.remove());
        };
    }, [count, duration, onComplete]);

    return null;
};

export default Fireworks;