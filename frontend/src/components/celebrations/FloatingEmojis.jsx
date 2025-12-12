import { useEffect } from 'react';
import './FloatingEmojis.css';

const FloatingEmojis = ({ category = 'other', duration = 4000, count = 15, onComplete }) => {
    useEffect(() => {
        const emojis = {
            morning: ['☀', '🌄', '🌞', '⭐', '🌟', '🐘', '🦉'],
            afternoon: ['🌤', '☁', '🎈', '🎉', '🌈', '🐘', '🦉'],
            evening: ['🌙', '⭐', '🌟', '🌟', '🌠', '🐘', '🦉'],
            other: ['🎊', '🎉', '🎁', '🏆', '👏', '🐘', '🦉']
        }

        const categoryEmojis = emojis[category] || emojis.other;
        const emojiElements =  [];

        for (let i = 0; i < count; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'celebration-emoji';
            emoji.textContent = categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.animationDelay = Math.random() * 0.8 + 's';
            document.body.appendChild(emoji);
            emojiElements.push(emoji);
        }

        const timer = setTimeout(() => {
            emojiElements.forEach(el => el.remove());
            if (onComplete) onComplete();
        }, duration + 1000);

        return () => {
            clearTimeout(timer);
            emojiElements.forEach(el => el.remove());
        };
    }, [category, count, duration, onComplete]);

    return null;
};

export default FloatingEmojis;