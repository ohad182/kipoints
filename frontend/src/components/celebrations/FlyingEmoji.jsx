import { useEffect, useState } from 'react';
import './FlyingEmoji.css';

const FlyingEmoji = ({ emoji = '🐘', duration = 3000, count = 5, onComplete }) => {
    const [icon, setIcons] = useState([]);

    useEffect(() => {
        const emojiDatas = [];

        // Create emojis with different delay (start time)
        for (let i = 0; i < count; i++) {
            const emojiData = {
                id: `element-${Date.now()}-${i}`,
                delay: i * (duration / count / 2), // Stagger elements
                top: Math.random() * 60 + 10, // random height between 10% and 70%
                direction: Math.random() > 0.5 ? 'left' : 'right' // Random starting side
            };
            emojiDatas.push(emojiData);


            // Create elements
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = `celebration-emoji ${emojiData.direction === 'left' ? 'from-left' : 'from-right'}`;
                element.style.top = `${emojiData.top}%`;
                element.style.animationDuration = `${duration}ms`;
                element.textContent = emoji;
                element.dataset.emojiId = emojiData.id;
                document.body.appendChild(element);

                // Remove after animation completes
                setTimeout(() => {
                    element.remove();
                    setIcons(prev => prev.filter(e => e.id !== emojiData.id));
                }, duration);
            }, emojiData.delay);
        }

        setIcons(emojiDatas);

        // Call onComplete after all owls finish
        const completeTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, duration + (count * (duration / count / 2)));

        return () => {
            clearTimeout(completeTimer);
            // Clean up amy remaining emojis
            document.querySelectorAll('.celebration-emoji').forEach(el => el.remove());
        };
    }, [emoji, duration, count, onComplete]);

    return null;
};

export default FlyingEmoji;