import { useEffect, useState } from 'react';
import './FallingEmoji.css';

const FallingEmoji = ({ emoji = '🐘', duration = 3000, count = 5, onComplete }) => {
    const [pile, setPile] = useState([]);

    useEffect(() => {
        const emojiElements = [];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'celebration-emoji-fall';
                element.textContent = emoji;
                element.style.left = (30 + Math.random() * 40) + '%';
                document.body.appendChild(element);
                emojiElements.push(element);
                setTimeout(() => {
                    element.remove();
                    setPile(prev => [...prev, emoji]);
                }, 2000);
            }, i * 400);
        }

        const timer = setTimeout(() => {
            emojiElements.forEach(el => el.remove());
            setPile([]);
            if (onComplete) onComplete();
        }, duration + 2500);

        return () => {
            clearTimeout(timer);
            emojiElements.forEach(el => el.remove());
            setPile([]);
        };
    }, [emoji, count, duration, onComplete]);

    return pile.length > 0 ? (
        <div className="emoji-pile">
            {pile.map((emojiChar, index) => (
                <span key={index}>{emojiChar}</span>
            ))}
        </div>
    ) : null;
};

export default FallingEmoji;